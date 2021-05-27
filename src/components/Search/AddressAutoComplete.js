
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import {debounce} from 'lodash';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


import {searchByAddress} from './AddressSearch';
import {addPointAtLonLat, zoomToLonLat} from '../Map/Map';
import {SET_MAP_SEARCH_ADDRESS} from '~/src/reducers/Map';

const useStyles = makeStyles((theme) => ({

}));




export default function AddressAutoComplete() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [options, setResults] = useState([]);
    const [inputValue, setInputValue] = React.useState('');

    const debounce_searchByAddress = debounce(async (e)=>{
        let searchTerm = e.target.value;
        let options = [];
        if (searchTerm.length > 2) {
          let response = await searchByAddress(searchTerm);
          if (response && response.results && response.results.length > 0) {
     
            options = response.results.map((r) => {
                return { title: r.address.freeformAddress, position: r.position };
              });
            setResults(options);
          }
        }
    }, 500);
    const onTextChange = (e) => {
        debounce_searchByAddress(e);       
    };

    return (
      <Autocomplete
        options={options}
        getOptionLabel={(o) => o.title}
        filterOptions={(x) => x}
        onInputChange={(event, newInputValue) => {
          let option = options.filter((o) => {
            return o.title == newInputValue;
          });
          if (option[0]) {
            zoomToLonLat(option[0].position);
            addPointAtLonLat(option[0].position);
            dispatch({ type: SET_MAP_SEARCH_ADDRESS, data: option[0] });
          }
        }}
        forcePopupIcon={false}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search by Address`}
            variant="outlined"
            onChange={onTextChange}
          />
        )}
      />
    );

}

