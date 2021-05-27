import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import {debounce} from 'lodash';
import {SET_YEAR_SELECTED} from '~/src/reducers/UI';

const useStyles = makeStyles({
  root: {
  },
});

function valuetext(value) {
  return `${value}`;
}


export default function DateSlider(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const year = useSelector((s)=>{
    return s.UI.year;
  });
  const dates = useSelector((s) => {
    return s.UI.dates;
  });

  const markers = dates.map((d) => {
    return { value: d, label: `${d}` };
  });
  const handleChange = (event, value) => {
    _saveValue(value);
  };
  const _saveValue = debounce((value) => {
    dispatch({type: SET_YEAR_SELECTED, data: value});
  }, 250);

  return (
    
    <div className={classes.root} style={{width: `${44.4*dates.length}px` }}>
 
       <Slider
        /* defaultValue={year} */
        value={year}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-custom"
        step={1}
        min={dates[0]}
        max={dates[dates.length-1]}
        valueLabelDisplay="auto"
        marks={markers}
        track={false}
        onChange={handleChange}
      />

    </div>
  );
}
