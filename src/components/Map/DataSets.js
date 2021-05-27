import store from '~/src/store';
import * as d3 from 'd3';
import { Regions } from '~/src/components/Map/Regions';
import {setDates, setDomain} from '~/src/reducers/UI';
import { DATA_SUPRESS_POP_COUNT_MIN } from '~/src/common/constants';
import { NEIGHBORHOOD_CROSSWALK, CITY_CROSSWALK } from '~/src/common/urls';


const singleton = ( () => {
    let instance;
    
    const init=()=> {
        let _data = {}; // store by endpoint lookup
        let _crosswalk = {}  // store by region
        let _active = null;
        let _paCache = {};

        // work on the entire set
        const _addMetadata = (details) => {
          const t0 = performance.now();
                    
          if (!_data.hasOwnProperty(details.url)) return;
          let ds = _data[details.url];
          // find the date ranges
          let yrs = ds.map((d) => {
            return d.year;
          });
          ds.years = [...new Set(yrs)].sort((a, b) => a - b);
          const t1 = performance.now();
          console.debug(`_addMetadata ${details.region} took ${t1 - t0} ms`);
        }
        const _getDataset = (details) => {
          if (!_data.hasOwnProperty(details.url)) return [];
          return _data[details.url];
        }
        const _determine_PA_breaks_Cache = (details) =>{
          let paHash, cached;
          paHash = JSON.stringify({region:details.region, pa:details.pa.index}).hashCode();
          cached = _paCache.hasOwnProperty(paHash);
          return {hash: paHash, cached: cached};
        }
        const _filterCensustracts = (details) => {
          const t0 = performance.now();
          let ds = _getDataset(details);
          store.dispatch(setDates(ds.years));
          let dataid = _getDataID('censustracts');          
          let filtered = [];
          let variable = details.pa.pct ? details.pa.pct : details.pa.count;
          let denom = details.denom, count = details.pa.count;
        
          if (denom) {
            filtered = ds
              .filter((d) => !isNaN(d[variable]))
              .map((d) => {
                return {
                  id: d[dataid],
                  year: d.year,
                  val: d[variable],
                  count: d[count],
                  denom: d[denom],
                };
              });
          }          
          details. years = _duplicate(ds.years);          
          const t1 = performance.now();
          console.debug(`_filterCensustracts took ${t1 - t0} ms`);
          return filtered;
        }
        const _filterByYear = (details, year=null) => {
          // work filtered by year
          let filtered = _filterCensustracts(details);
          filtered = filtered.filter((d) => {
            return d.year == year;
          });
          filtered.ids = {};
          filtered.forEach((f, i) => {
            filtered.ids[f.id] = i;
          });
          return filtered;
        };
        
        const _crossref_fCT_Region = (cw, ctds, year, pct=false, avg=false) => {
          let o = {
            id: cw.id, 
            name: cw.name, 
            year: year,
            count: 0,
            denom: 0,
            val: 0,
          };
          
            for (let ctid in cw.tracts) {
              try {
                let pctin = cw.tracts[ctid];
                let variable = ctds[ctds.ids[ctid]];
                o.denom += variable.denom * pctin;
                if (pct) {
                  o.count += variable.count * pctin
                }
               
              } catch (e) {
                //missing ct variables are filtered out due to null or 0 pop denom
                //console.debug(cw, ctid);
              }
            }
            if(!pct && !avg){
              o.val = Math.round(o.denom);
            }else if (pct){
              o.val = Math.round(( o.count / o.denom)*100);
            }
         
          return o;
        }
        const _rollUpCensusTractsData = (details) => {
          let ctds = null;
           // look in _paCache to see if breaks have already been determined to save doing them again
           let paHash = _determine_PA_breaks_Cache(details);
           if (paHash.cached) {
             //only need the year selected
             ctds = _filterByYear(details, details.year)
             .filter((d) => {
              return d.denom >= DATA_SUPRESS_POP_COUNT_MIN 
            });
           } else {
             // if first rollup per pa, need to calculate per decade
             ctds = _filterCensustracts(details)
             .filter((d) => {
              return d.denom >= DATA_SUPRESS_POP_COUNT_MIN 
            });
             let values = ctds.map((d) => d.val);
             let ranges = [...new Set(values)];
             _paCache[paHash.hash] = {
               domain: _jenks({ values: ranges, classes: 5 }, null),
             };
             ctds = ctds.filter((d) => {
               return d.year == details.year;
             });             
           }
           ctds.ids = {};
           ctds.forEach((f, i) => {
             ctds.ids[f.id] = i;
           });
           store.dispatch(setDomain(_paCache[paHash.hash].domain));
           details.scales = {
             domain: _duplicate(_paCache[paHash.hash].domain),
             jenks9: d3
               .scaleThreshold()
               .domain(_duplicate(_paCache[paHash.hash].domain))
               .range(
                 d3.range(6).map((i) => {
                   return `q${i}-9`;
                 })
               ),
           };
           return ctds;
        }
        const _rollUpRegionData = (details) => {
          const t0 = performance.now();
          let cw = _crosswalk[details.region];
          let ctds = null;
          let pct = details.pa.pct ? true: false;
          let avg = details.pa.avg ? true: false;
          
          let rollup = [];
          // look in _paCache to see if breaks have already been determined to save doing them again
          let paHash = _determine_PA_breaks_Cache(details);
          if (paHash.cached) {
            //only need the year selected
            ctds = _filterByYear(details, details.year);
            cw.forEach((c) => {
              rollup.push(
                _crossref_fCT_Region(c, ctds, details.year, pct, avg)
              );
            });
            rollup = rollup.filter((d) => {
              return d.denom >= DATA_SUPRESS_POP_COUNT_MIN 
            });
          } else {
            // if first rollup per pa, need to calculate per decade
            ctds = _filterCensustracts(details);
            details.years.forEach((y) => {
              ctds = _filterByYear(details, y);
              cw.forEach((c) => {
                rollup.push(_crossref_fCT_Region(c, ctds, y, pct, avg));
              });
            });
            rollup = rollup.filter((d) => {
              return d.denom >= DATA_SUPRESS_POP_COUNT_MIN 
            });
            let values = rollup.map((d) => d.val);
            //let ranges = [...new Set(values)];
            _paCache[paHash.hash] = {
              domain: _jenks({ values: values, classes: 5 }, null), //[2, 20399, 46769, 80570, 119829, 446317]//
            };
            rollup = rollup.filter((d) => {
              return d.year == details.year;
            });
          }
          store.dispatch(setDomain(_paCache[paHash.hash].domain));
          details.scales = {
            domain: _duplicate(_paCache[paHash.hash].domain),
            jenks9: d3
              .scaleThreshold()
              .domain(_duplicate(_paCache[paHash.hash].domain))
              .range(
                d3.range(6).map((i) => {
                  return `q${i}-9`;
                })
              ),
          };
          rollup.ids = {};
          rollup.forEach((f, i) => {
            rollup.ids[f.id] = i;
          });
          const t1 = performance.now();
          console.debug(`_rollUpRegionData ${details.region} took ${t1 - t0} ms`);
          return rollup;
        }
        const _duplicate = (obj) => {
            if(!obj) return [];
            return JSON.parse(JSON.stringify(obj)) // slow for big objects
        }
        const _getDataID = (region) => {
          switch (region) {
            case 'censustracts':
              return 'geoid20';
            default:
              return 'OBJECTID';
          }
        }
        const _getCensusTractData = async(details) => {
          let countycode = false;
          const t0 = performance.now();
          let dataset = await d3.csv(details.url, (d) => {
            // convert from string to ints, fix geoid20 to match geometry - '6037' couny code
            Object.keys(d).forEach((k, i) => {
              if (k == "geoid") return;
              else if (k == "geoid20") {
                //if(d[k] == '6037930400') debugger
                if (!countycode) {
                  countycode = d[k].startsWith("6037");
                }
                if (countycode) {
                  d[k] = +d[k].slice(4, d[k].length);
                }
              } else {
                // note: the +d convertion is faster but evaluates nulls as zero
                //d[k] = +d[k];
                d[k] = parseInt(d[k]);
              }
            });
            return d;
          });
          _data[details.url] = dataset;
          const t1 = performance.now();
          console.debug(`_parse csv took ${t1 - t0} ms - ${details.url}`);
          _addMetadata(details); 
        }
        const _loadCrosswalkData = async (region) => {
          if(_crosswalk.hasOwnProperty(region)) return;
          const t0 = performance.now();

          let records = Regions.getRegionMapping(region);
              let nametoid = {};

              records.forEach((f, i) => {
                if(!nametoid.hasOwnProperty(f.name)){
                  id: f.id,
                  nametoid[f.name] = f.id;
                }else{
                  let sorted = records.filter(c=>c.name == f.name).sort(function (a, b) {
                    return a.area - b.area;
                  });
                  //use the shape with the largest area
                  nametoid[f.name] =sorted[sorted.length-1].id;
                }
              });
              let cwtable = region == 'neighborhoods' ? NEIGHBORHOOD_CROSSWALK : CITY_CROSSWALK;
              let namefield = region == 'neighborhoods' ? 'name' : 'city_name';
              
              // merge ids
              //CT20	name	pct_censustract
              let csv = await d3.csv(cwtable, (d) => {
                // convert from string to ints, fix CT20 to match geometry - '6037' couny code
                Object.keys(d).forEach((k, i) => {
                  if (k == "CT20") {
                    d[k] = +d[k];
                  }
                  if (k == "pct_censustract"){
                    d[k] = +d[k];
                  }
                });
                d.geomid=nametoid[d[namefield]];
                return d;
              });
              // filter out ct with 0% in region
              csv = csv.filter(d=>{
                return d.pct_censustract > 0;
              });

              let cw =[]
              cw.geomids = {};
              csv.forEach((d,i)=>{
                let obj = cw[cw.geomids[d.geomid]];
                if(!obj){
                  obj = {
                    id: d.geomid,
                    name: d[namefield],
                    tracts: {},
                  };
                  cw.geomids[d.geomid] = cw.length;
                  cw.push(obj);
                }
                if(!obj.tracts.hasOwnProperty(d.CT20)){
                  obj.tracts[d.CT20] = d.pct_censustract;
                }else{
                  obj.tracts[d.CT20] += d.pct_censustract;
                }
              });
              _crosswalk[region] = cw;
          const t1 = performance.now();
          console.debug(`_loadCrosswalkData ${region} took ${t1 - t0} ms`);
        }        
        const _jenks = (options, cb) => {
          let data = options.values, n_classes = options.classes;
          // Compute the matrices required for Jenks breaks. These matrices
          // can be used for any classing of data with `classes <= n_classes`
          function getMatrices(data, n_classes) {
            // in the original implementation, these matrices are referred to
            // as `LC` and `OP`
            //
            // * lower_class_limits (LC): optimal lower class limits
            // * variance_combinations (OP): optimal variance combinations for all classes
            var lower_class_limits = [],
              variance_combinations = [],
              // loop counters
              i,
              j,
              // the variance, as computed at each step in the calculation
              variance = 0;

            // Initialize and fill each matrix with zeroes
            for (i = 0; i < data.length + 1; i++) {
              var tmp1 = [],
                tmp2 = [];
              for (j = 0; j < n_classes + 1; j++) {
                tmp1.push(0);
                tmp2.push(0);
              }
              lower_class_limits.push(tmp1);
              variance_combinations.push(tmp2);
            }

            for (i = 1; i < n_classes + 1; i++) {
              lower_class_limits[1][i] = 1;
              variance_combinations[1][i] = 0;
              // in the original implementation, 9999999 is used but
              // since Javascript has `Infinity`, we use that.
              for (j = 2; j < data.length + 1; j++) {
                variance_combinations[j][i] = Infinity;
              }
            }

            for (var l = 2; l < data.length + 1; l++) {
              // `SZ` originally. this is the sum of the values seen thus
              // far when calculating variance.
              var sum = 0,
                // `ZSQ` originally. the sum of squares of values seen
                // thus far
                sum_squares = 0,
                // `WT` originally. This is the number of
                w = 0,
                // `IV` originally
                i4 = 0;

              // in several instances, you could say `Math.pow(x, 2)`
              // instead of `x * x`, but this is slower in some browsers
              // introduces an unnecessary concept.
              for (var m = 1; m < l + 1; m++) {
                // `III` originally
                var lower_class_limit = l - m + 1,
                  val = data[lower_class_limit - 1];

                // here we're estimating variance for each potential classing
                // of the data, for each potential number of classes. `w`
                // is the number of data points considered so far.
                w++;

                // increase the current sum and sum-of-squares
                sum += val;
                sum_squares += val * val;

                // the variance at this point in the sequence is the difference
                // between the sum of squares and the total x 2, over the number
                // of samples.
                variance = sum_squares - (sum * sum) / w;

                i4 = lower_class_limit - 1;

                if (i4 !== 0) {
                  for (j = 2; j < n_classes + 1; j++) {
                    // if adding this element to an existing class
                    // will increase its variance beyond the limit, break
                    // the class at this point, setting the lower_class_limit
                    // at this point.
                    if (
                      variance_combinations[l][j] >=
                      variance + variance_combinations[i4][j - 1]
                    ) {
                      lower_class_limits[l][j] = lower_class_limit;
                      variance_combinations[l][j] =
                        variance + variance_combinations[i4][j - 1];
                    }
                  }
                }
              }

              lower_class_limits[l][1] = 1;
              variance_combinations[l][1] = variance;
            }

            // return the two matrices. for just providing breaks, only
            // `lower_class_limits` is needed, but variances can be useful to
            // evaluage goodness of fit.
            return {
              lower_class_limits: lower_class_limits,
              variance_combinations: variance_combinations,
            };
          }

          // the second part of the jenks recipe: take the calculated matrices
          // and derive an array of n breaks.
          function breaks(data, lower_class_limits, n_classes) {
            var k = data.length - 1,
              kclass = [],
              countNum = n_classes;

            // the calculation of classes will never include the upper and
            // lower bounds, so we need to explicitly set them
            kclass[n_classes] = data[data.length - 1];
            kclass[0] = data[0];

            // the lower_class_limits matrix is used as indexes into itself
            // here: the `k` variable is reused in each iteration.
            while (countNum > 1) {
              kclass[countNum - 1] = data[lower_class_limits[k][countNum] - 2];
              k = lower_class_limits[k][countNum] - 1;
              countNum--;
            }

            return kclass;
          }

          if (n_classes > data.length) return null;

          // sort data in numerical order, since this is expected
          // by the matrices function
          data = data.slice().sort(function (a, b) {
            return a - b;
          });

          // get our basic matrices
          var matrices = getMatrices(data, n_classes),
            // we only need lower class limits here
            lower_class_limits = matrices.lower_class_limits;

          // extract n_classes out of the computed matrices
          if(cb){
            cb( breaks(data, lower_class_limits, n_classes) );
          }else{
            return breaks(data, lower_class_limits, n_classes);
          }
          
        }
        const _dowork = (resolve, data) => {
          let counts = 0;
          const id = setInterval(() => {
            counts += 1;
            if (counts === 5) {
              clearInterval(id);
              data.counts = counts;
              resolve(JSON.stringify(data));
            }
          }, 1000);
          return id;
        }
        // public methods
        return {
          /*
          // cancel-able promise
          let during = DataSets.start({load: 'test'});
          during.promise.then((data) => {
            if(!data) throw('request canceled.');
            console.debug(`Promise resolved. ${data}`);
            return data;
          })
          .then((data) => {
            console.debug(`then${data}`);
          })
          .finally(() => {
            console.debug('finally');
          });
          during.promise.catch((error) => {
            console.debug(error);
          });
          */
          start: (data={}) => {
            if (_active) _active.cancel();

            let finished = false;
            let cancel = () => (finished = true);

            const promise = new Promise((resolve, reject) => {
              const id = _dowork(resolve, data);

              cancel = () => {
                if (finished) {
                  return;
                }
                clearInterval(id);
                reject();
              };
              if (finished) {
                cancel();
              }
            })
              .then((resolvedValue) => {
                finished = true;
                return resolvedValue;
              })
              .catch((err) => {
                finished = true;
                return err;
              });
            _active = { promise, cancel };
            return _active;
          },
          loadCensusTractData: async (details) => {
            if (details && details.url && !_data.hasOwnProperty(details.url)) {
              await _getCensusTractData(details);
            }
            
            if(details.display) {
              details.data = _rollUpCensusTractsData(details);
              Regions.loadRegionDataSet(details);
            }
          },
          loadNeighborhoodData: async (details) => {
            if (details && details.url && !_data.hasOwnProperty(details.url)) {
              await _getCensusTractData(details);
            }
            if (details && details.display) {
              let retry=false;
              console.debug('checing to see if nh data is ready', details)
              if(!_data.hasOwnProperty(details.url)){
                console.debug('ct data for pa not ready')
                retry=true
              }
              if(!_crosswalk[details.region]){
                console.debug(`cw data for${details.region} not ready`);
                retry=true
              }
              if (retry) {
                setTimeout(() => {
                  DataSets.loadNeighborhoodData(details);
                }, 1500);////debug - reduce down to 500
                return;
              }
              console.debug('----nh data is ready', details)

              details.data = _rollUpRegionData(details);
              Regions.loadRegionDataSet(details);
            }
          },
          loadCitiesData: async (details) => {
            if (details && details.url && !_data.hasOwnProperty(details.url)) {
              await _getCensusTractData(details);
            }
            if (details && details.display) {
              let retry=false;
              console.debug('checing to see if cities data is ready', details)
              if(!_data.hasOwnProperty(details.url)){
                console.debug('ct data for pa not ready')
                retry=true
              }
              if(!_crosswalk[details.region]){
                console.debug(`cw data for ${details.region} not ready`);
                retry=true
              }
              if (retry) {
                setTimeout(() => {
                  DataSets.loadCitiesData(details);
                }, 1500);////debug - reduce down to 500
                return;
              }
              console.debug('----cities data is ready', details)

              details.data = _rollUpRegionData(details);
              Regions.loadRegionDataSet(details);
            }
          },
          loadCrosswalkData: (region) => {
            if(region == 'censustracts') return;
            _loadCrosswalkData(region);
          }
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
  export const DataSets = singleton.getInstance();
  export default DataSets;