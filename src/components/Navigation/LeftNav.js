import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


import RegionSelect from '~/src/components/Navigation/RegionSelect';
import DateSelect from '~/src/components/Date/DateSelect';
import PolicyAreas from './PolicyAreas';

const useStyles = makeStyles((theme) => ({
    root: {
    },
}));

export default function LeftNav() {
  const classes = useStyles();


  return (
    <React.Fragment>
      <RegionSelect />
      {/* <DateSelect /> */}
      <PolicyAreas />
    </React.Fragment>
  );
}
