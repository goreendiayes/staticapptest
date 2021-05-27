export const SET_SHAPE_SELECTED = 'SET_SHAPE_SELECTED';
export const SET_SHAPE_CENSUSTRACTS_OUTLINES = 'SET_SHAPE_CENSUSTRACTS_OUTLINES';
export const SET_SHAPE_CITIES_OUTLINES = 'SET_SHAPE_CITIES_OUTLINES';
export const SET_SHAPE_NEIGHBORHOODS_OUTLINES = 'SET_SHAPE_NEIGHBORHOODS_OUTLINES';
export const SET_MAP_COMPRESSED = 'MAP/SET_MAP_COMPRESSED';
export const SET_MAP_SEARCH_ADDRESS = 'SET_MAP_SEARCH_ADDRESS';

export const setData = (section, data) => ({
    type: section,
    data
});
export const mapWidthChanged = (width) => {
  //store.dispatch(setData(SET_MAP_COMPRESSED, width <= 1500));
};
export const setOutlinesSingleState = (region) =>{
  return (dispatch, getState) => {
    dispatch({
      type: SET_SHAPE_NEIGHBORHOODS_OUTLINES,
      data: region == 'neighborhoods' ? true : false,
    });
    dispatch({
      type: SET_SHAPE_CITIES_OUTLINES,
      data: region == 'cities' ? true : false,
    });
    dispatch({
      type: SET_SHAPE_CENSUSTRACTS_OUTLINES,
      data: region == 'censustracts' ? true : false,
    });
  }
}


export default function reducer(
  state = {
    shapeSelected: 'neighborhoods', //neighborhoods, cities, censustracts
    censusTractsOutlines: false,
    cityOutlines: false,
    neighborhoodsOutlines: true,
    search_address: {},
    compressed: false,
  },
  action
) {
  switch (action.type) {
    case SET_SHAPE_SELECTED:
    return {
      ...state,
      shapeSelected: action.data,
    }

    case SET_SHAPE_CENSUSTRACTS_OUTLINES:
    return {
      ...state,
      censusTractsOutlines: action.data,
    }
    case SET_SHAPE_CITIES_OUTLINES:
    return {
      ...state,
      cityOutlines: action.data,
    }
    case SET_SHAPE_NEIGHBORHOODS_OUTLINES:
    return {
      ...state,
      neighborhoodsOutlines: action.data,
    }

    case SET_MAP_COMPRESSED:
      return {
        ...state,
        compressed: action.data,
      }
    case SET_MAP_SEARCH_ADDRESS:
    return {
      ...state,
      search_address: action.data,
    }

  }
  return state;
}