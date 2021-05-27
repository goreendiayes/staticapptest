import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Outlines from './Outlines';

import {SET_SHAPE_SELECTED, setOutlinesSingleState} from '~/src/reducers/Map';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      padding: '10px',
      fontSize: '1.25rem',
      textAlign: 'center',
    },
    container: {
      width: '100%',
    },
}));


export default function RegionSelect() {
    const classes = useStyles();
    const dispatch = useDispatch();
  
    const shapeSelected = useSelector((s) => {
      return s.Map.shapeSelected;
    });
    const handleChange = (event) => {
      dispatch({type: SET_SHAPE_SELECTED, data: event.target.value});
      dispatch(setOutlinesSingleState(event.target.value));  
    };

    return (
      <React.Fragment>
        <div className={classes.container}>
        <Select
          className={classes.root}
          labelId="shape-select-label"
          id="shape-select"
          value={shapeSelected}
          onChange={handleChange}
        >
          <MenuItem value={'neighborhoods'}>Neighborhoods</MenuItem>
          <MenuItem value={'cities'}>Cities</MenuItem>
          <MenuItem value={'censustracts'}>Census Tracts</MenuItem>
        </Select>
        </div>
        <div className={classes.container}>
        <Outlines/>
        </div>
        
      </React.Fragment>
    );
  }