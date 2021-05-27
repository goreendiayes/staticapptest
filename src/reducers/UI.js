import {updateMapSelectedRegionLayerFilter} from '~/src/components/Map/loadGeom';

export const SET_DATA_POLICYAREA_BREADCRUMB = 'SET_DATA_POLICYAREA_BREADCRUMB';
export const SET_DATA_REGION_BREADCRUMB = 'SET_DATA_REGION_BREADCRUMB';
export const SET_DATA_POLICYAREA_SELECTED = 'SET_DATA_POLICYAREA_SELECTED';
export const SET_YEAR_SELECTED = 'SET_YEAR_SELECTED';
export const SET_DATES_ARRAY = 'SET_DATES_ARRAY';
export const SET_DOMAIN_ARRAY = 'SET_DOMAIN_ARRAY';

export const setData = (section, data) => ({
    type: section,
    data
});
export const clearRegionBreadCrumb = () =>{
  return (dispatch, getState) => {
    dispatch({ 
      type: SET_DATA_REGION_BREADCRUMB, 
      data: [] 
    });
    updateMapSelectedRegionLayerFilter([]);
  }
}
export const removeRegionBreadCrumb = (index) => {
  return (dispatch, getState) => {
    let breadcrumb = getState().UI.region_breadcrumb;
    breadcrumb = Array.isArray(breadcrumb) ? breadcrumb : [];
    if(breadcrumb.length >=index+1){
      breadcrumb.splice(index, 1);
    }
    dispatch({ 
      type: SET_DATA_REGION_BREADCRUMB, 
      data: JSON.parse(JSON.stringify(breadcrumb)) 
    });
    updateMapSelectedRegionLayerFilter(breadcrumb);
  }
}
export const addRegionBreadCrumb = (data) => {
  return (dispatch, getState) => {
    let breadcrumb = getState().UI.region_breadcrumb;
    breadcrumb = Array.isArray(breadcrumb) ? breadcrumb : [];

  let atindex = null;
  if (
    breadcrumb.filter((b, i) => {
      let dupe = isEquivalent(data, b);
      if(dupe) atindex = i;
      return dupe;
    }).length === 0
  ) {
    breadcrumb.push(data);
  }else{
    breadcrumb.splice(atindex, 1);
  }

    dispatch({
      type: SET_DATA_REGION_BREADCRUMB,
      data: JSON.parse(JSON.stringify(breadcrumb)),
    });
    updateMapSelectedRegionLayerFilter(breadcrumb);

    function isEquivalent(a, b) {
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);
      if (aProps.length != bProps.length) {
        return false;
      }
    
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
          return false;
        }
      }
      return true;
    }


  }
}
export const setDates = (years) => {
  return (dispatch, getState) => {
    let year = getState().UI.year;
    if(!years.includes(year)){
      year = years.length-1;
    }
    dispatch({ 
      type: SET_YEAR_SELECTED, 
      data: year
    });
    dispatch({ 
      type: SET_DATES_ARRAY, 
      data: years
    });
  }
}
export const setDomain = (domain=[]) => {
  return (dispatch, getState) => {
    dispatch({ 
      type: SET_DOMAIN_ARRAY, 
      data: domain
    });
  }
}
export default function reducer(
  state = {
    policyarea_selected: [0,5], // [root idx, sub1 idx, sub2 idx]
    domain: [],//[10, 500, 1000, 1500, 2500, 5000, 10000, 25000, 50000, 400000],
    policyarea_breadcrumb: "Demography>Total Population",
    region_breadcrumb: [],
    year: 2019,    
    dates: [2019],
  },
  action
) {
  switch (action.type) {
    case SET_DATA_POLICYAREA_BREADCRUMB:
      return {
        ...state,
        policyarea_breadcrumb: action.data,
      };
    case SET_DATA_REGION_BREADCRUMB:
      return {
        ...state,
        region_breadcrumb: action.data,
      };
    case SET_DATA_POLICYAREA_SELECTED:
      return {
        ...state,
        policyarea_selected: action.data,
      };
    case SET_YEAR_SELECTED:
      return {
        ...state,
        year: action.data,
      };
    case SET_DATES_ARRAY:
      return {
        ...state,
        dates: action.data,
      };
      case SET_DOMAIN_ARRAY:
        return {
          ...state,
          domain: action.data,
        }
  }
  return state;
}