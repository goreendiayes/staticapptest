
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AddressAutoComplete from './AddressAutoComplete';
import RegionSearch from './RegionSearch';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        top: 35, left: '35%',
        backgroundColor: '#ffffff',
        width: 450,
        zIndex: 10,
    },
    button:{
      position: 'absolute',
      top: '5px',
      right: '3px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      zIndex: 15,
    },
}));

export default function SwitchSearch() {
    const classes = useStyles();
    const [searchRegion, setSearchRegion] = useState(false);

    const handleClick = (event) => {
      setSearchRegion(!searchRegion);
    };

    return (
      <Box className={classes.root}>
        <div className={classes.button}>
          <IconButton
            color="primary"
            onClick={handleClick}
            aria-label="change search by region or address"
            component="span"
          >
            <SearchOutlinedIcon />
          </IconButton>
         
        </div>
        {searchRegion ? <RegionSearch /> : <AddressAutoComplete />}
      </Box>
    );

}

