import React, {Component} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';

import Breadcrumbs from './Breadcrumbs';

import logoWide from '~/src/images/logo/logo-wide.png';
import logoNarrow from '~/src/images/logo/logo-narrow.png';
import logoUSCPrice from '~/src/images/logo/USCPrice.png';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    lineHeight: 3,
  },
  link: {
    color: '#ffffff', 
    padding: '0 10px 0 10px',
  },
  mainLogo:{
    width: '85%',
  },
  otherLogo: {
    width: '100%',
  },
  toolbarIcons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",    
  },
  breadcrumbs: {
    backgroundColor: '#ffffff',
  },
  
}));

export default function Header() {
    const classes = useStyles();

    const preventDefault = (event) => event.preventDefault();

    return (
      <div className={classes.root}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <Box className={classes.toolbarIcons}>
                  <IconButton style={{ color: "#ffffff" }}>
                    <EmailIcon />
                  </IconButton>
                  <IconButton style={{ color: "#ffffff" }}>
                    <TwitterIcon />
                  </IconButton>
                  <IconButton style={{ color: "#ffffff" }}>
                    <FacebookIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}>
                  <Box className={classes.links}>
                    <Link
                      href="#"
                      className={classes.link}
                      onClick={preventDefault}
                    >
                      About
                    </Link>
                    <Link
                      href="#"
                      className={classes.link}
                      onClick={preventDefault}
                    >
                      Community
                    </Link>
                    <Link
                      href="#"
                      className={classes.link}
                      onClick={preventDefault}
                    >
                      Stories
                    </Link>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <img src={logoWide} className={classes.mainLogo} />
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}>
                  <Box className={classes.links}>
                    <Link
                      href="#"
                      className={classes.link}
                      onClick={preventDefault}
                    >
                      Data
                    </Link>
                    <Link
                      href="#"
                      className={classes.link}
                      onClick={preventDefault}
                    >
                      Reports
                    </Link>
                    <Link
                      href="#"
                      className={classes.link}
                      onClick={preventDefault}
                    >
                      Map
                    </Link>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={1}>
                <img src={logoUSCPrice} className={classes.otherLogo} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} className={classes.breadcrumbs}>
          <Grid item xs={12} sm={9} style={{overflow: 'hidden', overflowX: 'scroll',}}>
            <Breadcrumbs />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>xs=12 sm=6</Paper>
          </Grid>
        </Grid>
      </div>
    );
}