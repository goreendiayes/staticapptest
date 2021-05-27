import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import LeftNav from "./LeftNav";
import DataTab from "./DataTab";
import {SIDE_DRAWER_WIDTH} from '~/src/common/constants';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {index === 0 && <LeftNav />}
      {index === 1 && <DataTab />}
      {index === 2 && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: SIDE_DRAWER_WIDTH,
    flexGrow: 1,
    marginTop: 0,
  },
  tabRoot: {
    minWidth: SIDE_DRAWER_WIDTH/3,
  },
  tabPanel: {
  }
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label=""
        >
          <Tab  index={0} value={0} label="Filters" classes={{ root: classes.tabRoot }} />
          <Tab label="Data" {...a11yProps(1)} classes={{ root: classes.tabRoot }} />
          <Tab label="Stories" {...a11yProps(2)} classes={{ root: classes.tabRoot }} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        
      >
        <TabPanel value={value} index={0} dir={theme.direction} >
          tab One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          tab Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          tab Three
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
