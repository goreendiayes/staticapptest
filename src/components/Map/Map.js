import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { debounce } from "lodash";
import { useGlobalEvent } from "beautiful-react-hooks";
import { withStyles } from "@material-ui/core/styles";
import * as turf from "@turf/turf"; // https://turfjs.org/docs

import { Regions } from '~/src/components/Map/Regions';
import SwitchSearch from "../Search/SwitchSearch";
import { mapWidthChanged } from "~/src/reducers/Map";
import { addRegionBreadCrumb, SET_DATA_REGION_BREADCRUMB, } from "~/src/reducers/UI";
import { setActiveRegionLayer, toggleRegionOutline } from "./loadGeom";
import { loadDataSet } from "../Navigation/data";

import {
  AZURE_MAP_KEY,
  MAP_START_CENTER,
  HEADER_HEIGHT,
} from "~/src/common/constants";

export var map = undefined;
export var mb = undefined;
export var atlas = window.atlas;

export var regionPopup;

const styles = ({}) => ({
  root: {
    padding: 0,
    position: "relative",
  },
});

const Map = ({ classes }) => {
  const dispatch = useDispatch();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const onWindowResize = useGlobalEvent("resize");

  /* const region_breadcrumb = useSelector((s) => {
    return s.Map.region_breadcrumb;
  }); */
  const policyarea_selected = useSelector((s) => {
    return s.UI.policyarea_selected;
  });
  const year = useSelector((s) => {
    return s.UI.year;
  });
  const dates = useSelector((s) => {
    return s.UI.dates;
  });
  const shapeSelected = useSelector((s) => {
    return s.Map.shapeSelected;
  });
  const censusTractsOutlines = useSelector((s) => {
    return s.Map.censusTractsOutlines;
  });
  const cityOutlines = useSelector((s) => {
    return s.Map.cityOutlines;
  });
  const neighborhoodsOutlines = useSelector((s) => {
    return s.Map.neighborhoodsOutlines;
  });

  const handleRegionClick = (e) => {
    if (e.shapes && e.shapes.length > 0) {
      let regionNameID = Regions.getRegionNameID(shapeSelected);
      var properties;
      if (e.shapes[0] instanceof atlas.Shape) {
        properties = e.shapes[0].getProperties();
      } else {
        properties = e.shapes[0].properties;
      }
      let _breadCrumb = {
        region: shapeSelected,
        id: e.shapes[0].id,
        name: regionNameID == 'LABEL'
          ? `Census Tract ${properties[regionNameID]}`
          : properties[regionNameID]
      };
      dispatch(addRegionBreadCrumb(_breadCrumb));
    }
  };

  // initial map setup
  useEffect(() => {
    map = new atlas.Map("azureMap", {
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey: AZURE_MAP_KEY,
      },
      zoom: 7,
      center: MAP_START_CENTER,
      view: "Auto",

      dblClickZoomInteraction: false,
      wheelZoomRate: 0.01,
    });
    mb = map.map;
    window.map = map;
    window.mb = mb;
    //window.turf = turf;

    
    map.events.add("ready", function () {

      map.controls.add(
        [
          new atlas.control.ZoomControl(),
          new atlas.control.CompassControl(),
          new atlas.control.PitchControl(),
          new atlas.control.StyleControl(),
        ],
        {
          position: "top-right",
        }
      );
      
      regionPopup = new atlas.Popup({
        position: [0, 0],
      });

      //mb.on("mousemove", function (e) {
      //  debounced_onMouseMove(e);
      //});
      setTimeout(() => {
        Regions.ensureRegionSourceIsLoaded('censustracts');
      }, 3500);
      
    });
    

    return () => map.remove();
  }, []);

  // triggers when the region selection changes
  useEffect(() => {
    dispatch({
      type: SET_DATA_REGION_BREADCRUMB,
      data: [],
    });
    map.events.add("ready", async () => {
      let outlines = {
        censustracts: censusTractsOutlines,
        cities: cityOutlines,
        neighborhoods: neighborhoodsOutlines,
      };
      await setActiveRegionLayer(
        shapeSelected,
        outlines[shapeSelected],
        handleRegionClick
      );
      loadDataSet(shapeSelected, policyarea_selected, year);
    });
  }, [shapeSelected]);

  // triggers when a policy area or date selection changes
  useEffect(() => {
    loadDataSet(shapeSelected, policyarea_selected, year);
  }, [shapeSelected, policyarea_selected, year, dates]);

  // triggers when the outline selection changes
  useEffect(() => {
    map.events.add("ready", function () {
      let outlines = {
        censustracts: censusTractsOutlines,
        cities: cityOutlines,
        neighborhoods: neighborhoodsOutlines,
      };
      Object.keys(outlines).forEach((k, i) => {
        toggleRegionOutline(k, outlines[k]);
      });
    });
  }, [censusTractsOutlines, cityOutlines, neighborhoodsOutlines]);

  onWindowResize((event) => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    mapWidthChanged(windowWidth);
    //console.debug(`w: ${windowWidth} h: ${windowHeight}`);
  });

  return (
    <div
      id="azureMap"
      data-testid="azureMap"
      className={classes.root}
      style={{ height: windowHeight - HEADER_HEIGHT }}
    >
      <SwitchSearch />
    </div>
  );
};

const _resize = () => {
  mb && mb.resize();
};
export const resize = debounce(_resize, 250);
const debounced_onMouseMove = debounce((e) => {
  let coords = `coordinates: ${JSON.stringify({
    screen: JSON.stringify(e.point),
    lnglat: JSON.stringify(e.lngLat.wrap()),
  })}`;
  if (window.debug && window.debug.showCoords) {
    console.log(coords);
  }
}, 250);
export const clearPoint = () => {
  const name = "addPointAtLonLat";
  map.events.add("ready", function () {
    let dataSource = map.sources.getById(name);
    if (dataSource) {
      dataSource.clear();
    }
  });
};
export const addPointAtLonLat = (lonlat) => {
  const name = "addPointAtLonLat";
  if (lonlat && lonlat.lon && lonlat.lat) {
    map.events.add("ready", function () {
      let dataSource = map.sources.getById(name);
      if (dataSource) {
        dataSource.clear();
      } else {
        dataSource = new atlas.source.DataSource(name);
        map.sources.add(dataSource);
        map.layers.add(new atlas.layer.SymbolLayer(dataSource), name);
      }
      dataSource.add(
        new atlas.data.Feature(new atlas.data.Point([lonlat.lon, lonlat.lat]))
      );
    });
  }
};
export const addBoundingBox = (topLeft, btmRight) => {
  const name = "addBoundingBox";
  if (topLeft && btmRight) {
    map.events.add("ready", function () {
      let dataSource = map.sources.getById(name);
      if (dataSource) {
        dataSource.clear();
      } else {
        dataSource = new atlas.source.DataSource(name);
        map.sources.add(dataSource);
        //map.layers.add(new atlas.layer.SymbolLayer(dataSource), name);
        map.layers.add(
          new atlas.layer.PolygonLayer(dataSource, null, {
            fillColor: "red",
            fillOpacity: 0.3,
          }),
          "labels"
        );
      }

      dataSource.add(
        new atlas.data.Feature(
          new atlas.data.Polygon([
            [
              topLeft,
              [topLeft[0], btmRight[1]],
              btmRight,
              [btmRight[0], topLeft[1]],
              topLeft,

              /* [-73.98235, 40.76799],
            [-73.95785, 40.80044],
            [-73.94928, 40.7968],
            [-73.97317, 40.76437],
            [-73.98235, 40.76799] */
            ],
          ])
        )
      );
      //dataSource.add(new atlas.data.Feature(new atlas.data.Point([lonlat.lon, lonlat.lat])));
    });
  }
};
export const zoomToLonLat = (lonlat) => {
  if (lonlat && lonlat.lon && lonlat.lat) {
    mb.setCenter([lonlat.lon, lonlat.lat]);
    mb.setZoom(11);
  }
};
export default withStyles(styles)(Map);
