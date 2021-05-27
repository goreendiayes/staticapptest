import { atlas, map, regionPopup } from './Map';
import { fetchJSON } from '~/src/common/util';
import { DataSets } from './DataSets';
import { GEOM_ROOT_LOCATION } from '~/src/common/urls';

const singleton = ( () => {
    let instance;
    
    const init=()=> {
        let _firstLoad = true;
        let _sourceLoading = false;
        let _geojson = {}; // store by endpoint lookup
        let _events = [];
        let _names = {};

        const _getRegionJSON = async(region, path) => {
          if (!_geojson.hasOwnProperty(region) && path) {
            let json = await fetchJSON(path, true);
            json = _cleanJSON(region, json);
            DataSets.loadCrosswalkData(region);
            _geojson[region] = JSON.stringify(json);                
          }
          return JSON.parse(_geojson[region]);
        }
        
        const _addPolygonSource = async (region, geom) => {
          let datasource = undefined;
          if (region && geom) {
            try {
              datasource = new atlas.source.DataSource(region);
              map.sources.add(datasource);
              if (geom && geom.features && geom.features.length) {
                datasource.add(geom);
                _sourceLoading = false;
                if (_firstLoad) {
                  _firstLoad = false;
                  let bounds = atlas.data.BoundingBox.fromData(geom);
                  map.setCamera({
                    bounds: bounds,
                    padding: 10,
                  });
                }
              }
            } catch (e) {
              console.debug(`_addPolygonSource catch - ${e.message}`);
            }
          }
          return datasource;
        }
        const _cleanJSON = (region, geom) => {
          let setNames = false;
          let regionID = _getRegionID(region);
          let regionNameID = _getRegionNameID(region);

          if(!_names.hasOwnProperty(region)){
            setNames = true;
            _names[region] = [];
          }
          if(geom && geom.features && geom.features.length){
            geom.features.forEach((f, i)=>{
              f.id = parseInt(f.properties[regionID]);
              f.properties.id = f.id;
              if(setNames){
                switch (region) {
                  case "censustracts":
                    _names[region].push({id: f.id, name: `Census Tract ${f.properties[regionNameID]}`, region: region, area: f.properties.shape_area});
                    break;
                  case "cities":
                    if (f.properties.feat_type == "Land" && f.properties.city_name!="Unincorporated") {
                      _names[region].push({
                        id: f.id,
                        name: f.properties[regionNameID],
                        region: region,
                        area: f.properties.shape_area
                      });
                    }                    
                    break;
                  default:
                    _names[region].push({id: f.id, name: f.properties[regionNameID], region: region, area: f.properties.NB_AREA});
                    break;
                }                
              }
            });
          }
          return geom;
        }
        const _getColorScale = () => {   
          return ['match',
            ["get", "_class"],
            'q5-9', "#a82727",///'rgb(153,27,30)', // red 
            'q4-9', "#be5227",//'rgb(183,80,24)',
            'q3-9', "#d47d27",//'rgb(202,116,20)',
            'q2-9', "#e9a927",//'rgb(222,152,15)',
            'q1-9', "#ffd427",//'rgb(252,205,9)', //yellow */ 
            'transparent'
            ];
        }
        const _mergeData = (details, geom) => {
          const t0 = performance.now();

          if(geom){
            geom.features.forEach((f, i) => {
              try {
                let index = details.data.ids[f.id];
                f.properties._name = details.data[index].name ? details.data[index].name : `Census Tract ${f.properties.LABEL}`
                f.properties._val = details.data[index].val;
                f.properties._class = details.scales["jenks9"](details.data[index].val);
              } catch (e) {}
            });
          }
          const t1 = performance.now();
          console.debug(
            `_mergeData ${details.region} took ${t1 - t0} ms`
          );
          return geom;
        }
        const _prepareDisplaySource = (geom) => {
          let name = "displaydata";
          let source = map.sources.getById(name);

          if (_events[0]) {
            let e = _events[0];
            map.events.remove("mousemove", e.layer, e.mousemove);
            map.events.remove("mouseleave", e.layer, e.mouseleave);
            _events = [];
          }

          if (source) {
            try {
              map.layers.remove([name]);
            } catch (e) {}
            map.sources.remove([name]);
          }
          source = new atlas.source.DataSource(name);
          map.sources.add(source);
          if (geom && geom.features && geom.features.length) {
            source.add(geom);
          }

          return source;
        }
        const _displayData = (details, geom) => {
          let name = 'displaydata';
          let options = {
            fillColor: _getColorScale(details),
            fillOpacity: 0.75,
            filter: [
              "any",
              ["==", ["geometry-type"], "Polygon"],
              ["==", ["geometry-type"], "MultiPolygon"],
            ],
          };
          geom = _mergeData(details, geom);
          let source = _prepareDisplaySource(geom);
          const t0 = performance.now();
          map.events.add("ready", function () {
            let datavis = new atlas.layer.PolygonLayer(source, name, {
              fillColor: options.fillColor,
              fillOpacity: options.fillOpacity,
              filter: options.filter,
            });
            let mousemove = function (e) {
              if (e.shapes && e.shapes.length > 0 && e.shapes[0].properties._val) {
                let properties = e.shapes[0].properties;
                regionPopup.setOptions({
                  content:
                    '<div style="padding:10px"><b>' +
                    properties._name +
                    "</b><br/>value: " +
                    properties._val +
                    "</div>",
                  position: e.position,
                });
                regionPopup.open(map);
              }
            };
            let mouseleave = function (e) {
              regionPopup.close();
            };
            let evt = {
                region: details.region,
                layer: datavis,
                mousemove: mousemove,
                mouseleave: mouseleave,
            };
            _events.push(evt);
            let before = map.layers.getLayerById(`${details.region}_lines`) ? `${details.region}_lines` : 'labels';
            map.layers.add([datavis], before);
            map.events.add("mousemove", datavis, mousemove);
            map.events.add("mouseleave", datavis, mouseleave);
          });
          const t1 = performance.now();
          console.debug(`_displayData ${details.region} took ${t1 - t0} ms - ${details.year}-${details.pa.name}`);
        }
        const _determingRegionPath = (region) => {
          return `${GEOM_ROOT_LOCATION}${region}`;
          //return `${GEOM_ROOT_LOCATION}${region}.json`;
        }
        const _duplicate = (obj) => {
          if (!obj) return [];
          return JSON.parse(JSON.stringify(obj)); // slow for big objects
        }
        const _getRegionID = (region) => {
          switch (region) {
            case "cities":
              return "objectid";
            case "neighborhoods":
              return "OBJECTID";
            case "censustracts":
              return "CT20";
            default:
              return "OBJECTID";
          }
        }
        const _getRegionNameID = (region) => {
          switch (region) {
            case "cities":
              return "city_name";
            case "neighborhoods":
              return "name";
            case "censustracts":
              return "LABEL";
            default:
              return "name";
          }
        }
     
        // public methods
        return {
          ensureRegionSourceIsLoaded: async (region) => {
            let path = _determingRegionPath(region);
            if (_sourceLoading == region) return false;

            let source = map.sources.getById(region);
            if (!source) {
              _sourceLoading = region;
              const t0 = performance.now();
              let geom = await _getRegionJSON(region, path);
              const t1 = performance.now();
              console.debug(
                `ensureRegionSourceIsLoaded download ${region} took ${
                  t1 - t0
                } ms`
              );
              source = _addPolygonSource(region, geom);
            }
            return source;
          },
          loadRegionDataSet: async (details) => {
            // incase the geometry is still loading
            if (!_geojson.hasOwnProperty(details.region)) {
              setTimeout(() => {
                Regions.loadRegionDataSet(details);
              }, 500);
              console.debug(`geom ${details.region} not loaded yet`);
              return;
            }
            let json = await _getRegionJSON(details.region);
            _displayData(details, json);
          },
          getRegionID: (region) => {
            return(_getRegionID(region));
          },
          getRegionNameID: (region) => {
            return(_getRegionNameID(region));
          },
          getRegionMapping: (region) => {
            return _duplicate(_names[region]);
          },
        };
   
    };
   
    return {
      getInstance: () => {   
        if ( !instance ) {
          instance = init();
        }   
        return instance;
      }   
    };
   
  })();
  export const Regions = singleton.getInstance();
  export default Regions;