import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import {addPointAtLonLat, zoomToLonLat, clearPoint} from '~/src/components/Map/Map';
import {zoomToSelectedRegionGeom} from '~/src/components/Map/loadGeom';
import {removeRegionBreadCrumb, clearRegionBreadCrumb} from '~/src/reducers/UI';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    width: 500,
  },
}));

export default function Breadcrumbs() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const policyarea_breadcrumb = useSelector((s) => {
    let section = s.UI.policyarea_breadcrumb.split('>')
    return section.length ? section[0] : "unknown"
  });
  const region_breadcrumb = useSelector((s)=>{
    return s.UI.region_breadcrumb;
  });


  const handleClickRegion = (index, e) => {
    zoomToSelectedRegionGeom(region_breadcrumb[index]);
  }
  const handleDeleteRegion = (index, e) => {
    dispatch(removeRegionBreadCrumb(index));
  };
  const handleClearRegion = () => {
    dispatch(clearRegionBreadCrumb());
  }
  const handleClickAddress = () => {
    zoomToLonLat(search_address.position);
    addPointAtLonLat(search_address.position);
  }
  const handleDeleteAddress = () => {
    clearPoint();
    dispatch({type: SET_MAP_SEARCH_ADDRESS, data: {}});
  };

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <Paper elevation={0}>
      <span className={classes.root}>
        {policyarea_breadcrumb && (
          <Chip
            label={policyarea_breadcrumb.replaceAll(">", " > ")}
            size="small"
            color="primary"
          />
        )}
        {region_breadcrumb && region_breadcrumb.length > 1 && (
          <Chip
            label="Clear"
            size="small"
            onClick={handleClearRegion}
            variant="outlined"
          />
        )}
        {region_breadcrumb &&
          region_breadcrumb.length > 0 &&
          region_breadcrumb.map((c, index) => (
            <Chip
              key={index}
              /* variant="outlined" */
              size="small"
              clickable
              label={c.name}
              onClick={(event) => handleClickRegion(index, event)}
              onDelete={(event) => handleDeleteRegion(index, event)}
            />
          ))}
      </span>
    </Paper>
  );
}