import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {choosePolicyArea} from './PolicyAreas';

const useStyles = makeStyles((theme) => ({
  root: {
    /* border: 'solid 1px red', */
    padding: 5,

  },
  item: {
    padding: 0,
  },
  nestedMenu: {
    /* border: 'solid 1px yellow', */
    padding: 0,
    
  },
  nestedItem: {
    marginLeft: 10,
    /* border: 'solid 1px green', */
    padding: 0,
    backgroundColor: 'whitesmoke',
  },

}));
export const NestedMenu = (props) => {
    return props.menu
      ? props.menu.map((item, key) => <MenuItem key={key} item={item} />)
      : null;   
}
function hasChildren(item) {
    const { items: children } = item;
  
    if (!children) {
      return false;
    }
  
    if (children.constructor !== Array) {
      return false;
    }
  
    if (children.length === 0) {
      return false;
    }
  
    return true;
  }  
const MenuItem = ({ item }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} />;
};

const SingleLevel = ({ item }) => {
  const classes = useStyles();
  const setPolicyarea = (policyareaIdx, event) => {
    choosePolicyArea(policyareaIdx);
  };
  return (
    <ListItem button onClick={(event) => setPolicyarea(item.index, event)} className={classes.nestedItem}>
      <ListItemText primary={item.name} />
    </ListItem>
  );
};

const MultiLevel = ({ item }) => {
  const classes = useStyles();
  const { items: children } = item;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <ClickAwayListener onClickAway={handleClickAway}>
        <ListItem button onClick={handleClick} className={classes.root}>
          <ListItemText primary={item.name} className={classes.item} />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        </ClickAwayListener>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div">
            {children.map((child, key) => (
              <MenuItem key={key} item={child}  />
            ))}
          </List>
        </Collapse>
        
    </React.Fragment>
  );
};
export default NestedMenu;