import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { SET_SHAPE_CENSUSTRACTS_OUTLINES, SET_SHAPE_CITIES_OUTLINES, SET_SHAPE_NEIGHBORHOODS_OUTLINES, } from '~/src/reducers/Map';
import { classicNameResolver } from 'typescript';

const BlueCheckbox = withStyles({
    root: {
      display: 'flex',
      color: blue[400],
      '&$checked': {
        color: blue[600],
      },
      formControl: {
        margin: 4,
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);


export default function Outlines() {

    const dispatch = useDispatch();
    const censusTractsOutlines = useSelector((s) => {
      return s.Map.censusTractsOutlines;
    });
    const cityOutlines = useSelector((s) => {
      return s.Map.cityOutlines;
    });
    const neighborhoodsOutlines = useSelector((s) => {
      return s.Map.neighborhoodsOutlines;
    });

    const handleChange = (event) => {
      switch (event.target.name) {
        case "censustracts":
          dispatch({
            type: SET_SHAPE_CENSUSTRACTS_OUTLINES,
            data: event.target.checked,
          });
          break;
        case "cities":
          dispatch({
            type: SET_SHAPE_CITIES_OUTLINES,
            data: event.target.checked,
          });
          break;
        case "neighborhoods":
          dispatch({
            type: SET_SHAPE_NEIGHBORHOODS_OUTLINES,
            data: event.target.checked,
          });
          break;
        default:
          break;
      }
    };
  return (
    <div>
      <FormGroup style={{marginLeft: 15}}>
        <InputLabel style={{padding: '10px 0 0 0'}}>Show Outlines</InputLabel>
        <FormControlLabel
          control={
            <BlueCheckbox
              checked={neighborhoodsOutlines}
              onChange={handleChange}
              name="neighborhoods"
            />
          }
          label="Neighborhoods"
        />
        <FormControlLabel
          control={
            <BlueCheckbox
              checked={cityOutlines}
              onChange={handleChange}
              name="cities"
            />
          }
          label="Cities"
        />
        <FormControlLabel
          control={
            <BlueCheckbox
              checked={censusTractsOutlines}
              onChange={handleChange}
              name="censustracts"
            />
          }
          label="Census Tracts"
        />
      </FormGroup>
    </div>
  );
}
