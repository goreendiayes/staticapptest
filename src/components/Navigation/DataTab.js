import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';



import Chart from "../Chart/Chart";


const useStyles = makeStyles((theme) => ({
    root: {
    },
}));

export default function DataTab() {
  const classes = useStyles();


  
  return (
    <React.Fragment>
      <Chart />
    </React.Fragment>
  );
}
