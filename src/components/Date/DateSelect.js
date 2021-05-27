import React, {Component} from 'react';
import { makeStyles } from "@material-ui/core/styles";

import Box from '@material-ui/core/Box';
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import { useSelector, useDispatch } from 'react-redux';
import {SET_YEAR_SELECTED} from '~/src/reducers/UI';
import {SIDE_DRAWER_WIDTH, USC_RED} from '~/src/common/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: SIDE_DRAWER_WIDTH/2,
    margin: `20px 0 5px ${SIDE_DRAWER_WIDTH/4}px`,
    "& .MuiOutlinedInput-input": {
      color: "silver"
    },
    "& .MuiInputLabel-root": {
      color: "silver"
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "silver"
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "black"
    },
    "&:hover .MuiInputLabel-root": {
      color: "black"
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "silver"
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: USC_RED
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: USC_RED
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: USC_RED
    }
  },
}));

export default function DateSelect(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const year = useSelector((s)=>{
    return s.UI.year;
  });
  const dates = useSelector((s) => {
    return s.UI.dates;
  });
  const handleChange = (event) => {
    dispatch({type: SET_YEAR_SELECTED, data: event.target.value});
  };
  return (
    <Box>
      <TextField
        className={classes.root}
        value={year}
        onChange={handleChange}
        variant="outlined"
        label="Date Range"
        select
      >
        {dates.map((date, i) => (
          <MenuItem value={date} key={i}>
            {date}
          </MenuItem>
        ))}
      </TextField>
      
    </Box>
  );
}