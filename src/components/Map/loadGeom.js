import { atlas, map } from './Map';
import {debounce} from 'lodash';

import { Regions } from './Regions';

let events = [];

export const toggleRegionOutline = async(region, outline=false)=>{
  if (!region) {
    console.debug("No region passed to toggleRegionOutline");
    return false;
  }

  if(!outline){
    removeOutlinesLayer(region);
  }else{
    await Regions.ensureRegionSourceIsLoaded(region);
    showOutline(region);
  }
}
export const setActiveRegionLayer = async (region, outline, clickEvent) => {
  outline = true;
  let options = {
    fillColor: "transparent",
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
  };
  let datasource = await Regions.ensureRegionSourceIsLoaded(region);

  map.events.add("ready", function () {
    if(events[0]){
        let e = events[0];
        map.events.remove('click', e.rsl, e.click);
        map.events.remove('mousemove', e.rsl, e.mousemove);
        map.events.remove('mouseleave', e.rsl, e.mouseleave);
        events = [];
    }
    let evt = {};
    try {
        map.layers.remove(['region_selectLayer', 'region_hoverLayer', 'region_selectedoutline']);
      } catch (e) { }

    let rsl = new atlas.layer.PolygonLayer(datasource, "region_selectLayer", {
      fillColor: options.fillColor,
      filter: options.filter,
    });
    let rhl = new atlas.layer.PolygonLayer(datasource, `region_hoverLayer`, {
      fillColor: "rgba(150, 50, 255, 0.2)",
      filter: ["==", ["get", "id"], ""],
    });
    let selectedLayer = new atlas.layer.LineLayer(datasource, 'region_selectedoutline', {
      strokeColor: "black",
      strokeWidth: 1.5,
      filter: [
        "any",
        ['in', ["get", "id"], ['literal', []]] 
      ],
    });
    let click = function(e){
        clickEvent(e);
    }
    let mousemove = function (e) {
      if (e.shapes && e.shapes.length > 0) {        
        rhl.setOptions({
          filter: ["==", ["get", "id"], e.shapes[0].properties["id"]],
        });
        /* let properties = e.shapes[0].properties;
        regionPopup.setOptions({
          content:
            '<div style="padding:10px"><b>' +
            properties.name +
            "</b><br/>pct: " +
            properties.pct +
            "</div>",
          position: e.position,
        });
        regionPopup.open(map); */
      }
    };
    let mouseleave = function (e) {
      /* regionPopup.close(); */
      rhl.setOptions({
        filter: ["==", ["get", "id"], ""],
      });
    };
    evt = {
        region: region,
        rsl: rsl,
        rhl: rhl,
        click: click,
        mousemove: mousemove,
        mouseleave: mouseleave,
    };
    events.push(evt);
    map.layers.add([rsl, rhl], "labels");
    map.layers.add([selectedLayer]);
    map.events.add('click', rsl, click);
    //map.events.add("mousemove", rsl, mousemove);
    //map.events.add("mouseleave", rsl, mouseleave);
    if (outline) {
      showOutline(region);
    }
  });
};

export const zoomToSelectedRegionGeom = async(breadcrumb) => {
  if(!breadcrumb || !breadcrumb.region) return false;
  let source = await Regions.ensureRegionSourceIsLoaded(breadcrumb.region);

  if(source){
    let geom = source.getShapes();
    if(geom && geom.length){
      let feature = geom.filter((g) => {
        return g.data.properties.id == breadcrumb.id;
      });
      if(feature && feature.length){
        let bbox = atlas.data.BoundingBox.fromData(feature[0].data);
        if(bbox){
          map.setCamera({
            bounds: bbox,
            padding: 80,
          });
        }
      }
    }
  }
}
export const updateMapSelectedRegionLayerFilter = (breadcrumb)=>{
  let layer = isLayerLoaded('region_selectedoutline');
  if(!layer || !breadcrumb) return false;

  if (breadcrumb.length > 0) {
    let ids = breadcrumb.map(b=>{
      return b.id;
      })
    layer.setOptions({
      filter: ["in", ["get", "id"], ["literal", ids]],
    });
  } else {
    layer.setOptions({
      filter: ["in", ["get", "OBJECTID"], ["literal", []]],
    });
  }
}

const isLayerLoaded = (name) => {
    return map.layers.getLayerById(name);
}

const removeOutlinesLayer = (region) => {
    try {
        map.layers.remove(`${region}_lines`);
      } catch (e) {}
}
const showOutline = async(region) => {
  let datasource = await Regions.ensureRegionSourceIsLoaded(region);
  let outlinesLoaded = isLayerLoaded(`${region}_lines`);
  
  if (region && datasource && !outlinesLoaded) {
    map.events.add("ready", function () {
        map.layers.add(
          [
            //Add a layer for rendering the outline of polygons.
            new atlas.layer.LineLayer(datasource, `${region}_lines`, {
              strokeColor: "#00a2ff",
              strokeWidth: 1,
              filter: [
                "any",
                ["==", ["geometry-type"], "Polygon"],
                ["==", ["geometry-type"], "MultiPolygon"],
              ],
            }),
          ],
          "labels"
        );
    });
  }
};