import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';



const useStyles = makeStyles((theme) => ({
    root: {
    },
}));

export default function DateSelect(props) {
    const classes = useStyles();
  
    

    return (
      <React.Fragment>
        <InputLabel id="date-range-select-label">Date Range</InputLabel>
        <Select
          labelId="date-range-select-label"
          id="date-range-select"
          value={props.dates[props.selectedDateIndex]}
          onChange={props.dateChanged}
        >
          {props.dates.map((d, i)=>{
            return (
              <MenuItem key={i} value={d}>{d}</MenuItem>
            )
          })}
        </Select>
      </React.Fragment>
    );
  }