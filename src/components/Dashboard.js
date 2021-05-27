import React from "react";
import { useSelector } from 'react-redux';

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import PrintIcon from '@material-ui/icons/Print';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';



import {USC_RED, SIDE_DRAWER_WIDTH, HEADER_HEIGHT} from '~/src/common/constants';
import Header from './Navigation/Header';
import NavTabs from './Navigation/NavTabs';
import Map, {resize} from "./Map/Map";
import DateSlider from './Date/DateSlider';
import Legend from "./Legend/Legend";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {

    backgroundColor: USC_RED,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
  },
  header: {
    width: '100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  drawrTopPadding: {
      height: HEADER_HEIGHT,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: SIDE_DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: 63,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    position: 'relative',
    flexGrow: 1,
    margin: `${HEADER_HEIGHT}px 0 0 0`,
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  },
  container: {
    padding: 0,
    margin: 0,
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  sliderContainer: {
    left: 20,
    bottom: 20,
    position: 'absolute',
    backgroundColor: '#ffffff',
    padding: '10px 30px 10px 30px',
    borderRadius: 5,
  }
}));


export default function Dashboard() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
    resize();
  };
  function OpenClose() {
    if (open) {
      return (
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      );
    } else {
      return (
        <IconButton onClick={handleDrawerOpen}>
          <ChevronRightIcon />
        </IconButton>
      );
    }
  }


  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar
        /* position="absolute" */
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar} disableGutters>
          <Header className={classes.header} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <Box className={classes.drawrTopPadding}></Box>
        <Divider />
        <div className={classes.toolbarIcon}>
          <IconButton>
            <PrintIcon />
          </IconButton>
          <IconButton>
            <CloudDownloadIcon />
          </IconButton>
          <OpenClose />
        </div>
        <NavTabs />
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <StylesProvider injectFirst>
          <Map />
          <Box className={classes.sliderContainer}>
            <DateSlider />
          </Box>
          <Legend />
        </StylesProvider>
      </main>
    </div>
  );
}
