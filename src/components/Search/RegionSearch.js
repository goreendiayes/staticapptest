
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {zoomToSelectedRegionGeom} from '~/src/components/Map/loadGeom';
import {Regions} from '../Map/Regions';
import { addRegionBreadCrumb, SET_DATA_REGION_BREADCRUMB, } from "~/src/reducers/UI";

const useStyles = makeStyles((theme) => ({

}));

export default function RegionSearch(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [names, setNames] = useState([]);
    const [options, setOptions] = useState([]);
    const region = useSelector((s) => {
        return s.Map.shapeSelected;
    });
    const shapeSelected = useSelector((s) => {
        return s.Map.shapeSelected;
      });
    useEffect(() => {
        setNames([]);
        setOptions([]);
    }, [shapeSelected]);

    const getRegionText = () => {
      if (region) {
        let text = region == "censustracts" ? "Census Tracts" : region;
        return text.charAt(0).toUpperCase() + text.substring(1);
      }
    };

    const onTextChange = (e) => {
        let test = e.target.value.toUpperCase();
        if(!names || names.length==0){
            let results = Regions.getRegionMapping(region);
            results = results.filter(r=>{
                return r.name != 'Unincorporated';
            }).map(r=>{
                r.test = r.name.toUpperCase();
                return r;
            }).sort((a, b) => {
                let fa = a.name.toLowerCase(),
                    fb = b.name.toLowerCase();
            
                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });            
            setNames(results);
        }        
        let _options = names.filter((n) => {
            return n.test.includes(test);
        })
        setOptions(_options);
    };

    return (
      <Autocomplete
        options={options}
        getOptionLabel={(o) => o.name}
        filterOptions={(x) => x}
        onInputChange={(event, newInputValue) => {
          let test = newInputValue.toUpperCase();
          let option = options.filter((o) => {
            return o.test == test;
          });
          if (option.length) {
              option.forEach((o, i) => {
                zoomToSelectedRegionGeom({
                  region: o.region,
                  id: o.id,
                  name: o.name,
                });
                dispatch(
                  addRegionBreadCrumb({
                    region: o.region,
                    id: o.id,
                    name: o.name,
                  })
                );
              });
          }
        }}
        key={region}
        disableClearable
        forcePopupIcon={false}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search by ${getRegionText()}`}
            variant="outlined"
            onChange={onTextChange}
          />
        )}
      />
    );

}

