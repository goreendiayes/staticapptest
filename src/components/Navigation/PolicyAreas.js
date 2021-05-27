import React, { useState, useEffect } from 'react';
import store from '~/src/store';
import { makeStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import NestedMenu from './NestedMenu';

import SvgIcon from '@material-ui/core/SvgIcon';

import {loadPolicyAreas, getBreadCrumb} from './data';
import {setData, SET_DATA_POLICYAREA_SELECTED, SET_DATA_POLICYAREA_BREADCRUMB} from '~/src/reducers/UI';

import {SIDE_DRAWER_WIDTH} from '~/src/common/constants';

const viewbox = "0, 0, 400,403";
const useStyles = makeStyles((theme) => ({
  root: {
  },
  itemIcon: {
    zoom: 1.5,
    minWidth: 30,
  },
  img: {
    borderRadius: 25,
  },
  menu: {
    marginLeft: SIDE_DRAWER_WIDTH,  //pops the menu out over the map
  },
}));
export const choosePolicyArea = (policyareaIdx) => {
  let breadcrumb = getBreadCrumb(policyareaIdx);
  store.dispatch(setData(SET_DATA_POLICYAREA_SELECTED, policyareaIdx));
  store.dispatch(setData(SET_DATA_POLICYAREA_BREADCRUMB, breadcrumb));
}
export const PolicyAreas = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [policyAreas, setPolicyAreas] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);
  const [rootIdx, setRootIdx] = useState(null);

  useEffect(async () => {
    const json = await loadPolicyAreas();
    setPolicyAreas(json);
  }, []);


  const handleClick = (key, event) => {
    setRootIdx(key);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setRootIdx(null);
    setAnchorEl(null);
  };
  
  const ITEM_HEIGHT = 100;
  return (
    <React.Fragment>
      <List className={classes.root}>
        {policyAreas.map((cat, i) => (
          <ListItem
            button
            selected={false}
            key={i}
            id={i}
            aria-haspopup="true"
            onClick={(event) => handleClick(i, event)}
          >
            <ListItemIcon className={classes.itemIcon}>
              <SvgIcon
                className={classes.img}
                component={cat.image}
                viewBox={viewbox}
              />
            </ListItemIcon>
            <ListItemText primary={cat.name} />
          </ListItem>
        ))}
      </List>
      {rootIdx !== null && (
        <Menu
          className={classes.menu}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 500,
            },
          }}
        >
          {policyAreas[rootIdx].items != null && (
            <NestedMenu menu={policyAreas[rootIdx].items} />
          )}
        </Menu>
      )}
    </React.Fragment>
  );
}

export default PolicyAreas;