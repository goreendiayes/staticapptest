import store from '~/src/store';
import { fetchJSON } from '~/src/common/util';
import { POLICY_AREA_LOCATION } from '~/src/common/urls';
import { DataSets } from '~/src/components/Map/DataSets';
import { regionPopup } from '~/src/components/Map/Map';

import { API_ROOT_URL } from '~/src/common/urls';
import { ReactComponent as Demography } from '~/src/images/icons/Demography.svg';
import { ReactComponent as Education } from '~/src/images/icons/Education.svg';
import { ReactComponent as EmploymentIncome } from '~/src/images/icons/EmploymentIncome.svg';
import { ReactComponent as Environment } from '~/src/images/icons/Environment.svg';
import { ReactComponent as FoodInsecurity } from '~/src/images/icons/FoodInsecurity.svg';
import { ReactComponent as Health } from '~/src/images/icons/Health.svg';
import { ReactComponent as HousingRealEstate } from '~/src/images/icons/HousingRealEstate.svg';
import { ReactComponent as PublicSafety } from '~/src/images/icons/PublicSafety.svg';
import { ReactComponent as SocialConnectedness } from '~/src/images/icons/SocialConnectedness.svg';
import { ReactComponent as Transportation } from '~/src/images/icons/Transportation.svg';
//add other image

let prevHash = undefined;
export const getItemFromIndex = (index=[])=>{
  if(!index || !Array.isArray(index)){
    index = [0,0,0];
  }
}
export const loadPolicyAreas = async() => {
  if(!policyAreas){
    policyAreas = await fetchJSON(POLICY_AREA_LOCATION);
    if(!policyAreas.indexed){
      policyAreas.forEach((c, ci)=>{
        c.image = imageMap[c.image];
        c.index = [ci];
        if(c.items){
          c.items.forEach((s1, s1i)=>{
            s1.index = [ci, s1i];
            if(s1.items){
              s1.items.forEach((s2, s2i)=>{
                s2.index = [ci, s1i, s2i];
              })
            }
          })
        }
      });
    }
    //store.dispatch(setData(SET_DATA_POLICYAREA_SELECTED, [0,0,0]));
  }
  return policyAreas;
}
export const loadDataSet = (shapeSelected, policyarea_selected, year, cache=true) => {
  if ((policyarea_selected.length)) {
    let reload = true;
    let details = getPolicyAreaDetails(policyarea_selected);
    details.display = (cache && details.pa?true:false);
    details.year = year ? year : null;
    details.region = shapeSelected;
    details.hash = JSON.stringify(details).hashCode();
    if (prevHash) {
      reload = prevHash != details.hash;
    }
    prevHash = cache ? (details.hash) : (null);
    if (reload && details.display) {
      let source = map.sources.getById("displaydata");
      source && source.clear();
      regionPopup.close();
      switch (shapeSelected) {
        case "censustracts":
          DataSets.loadCensusTractData(details);
          break;
        case "neighborhoods":
          DataSets.loadNeighborhoodData(details);
          break;
        case "cities":
          DataSets.loadCitiesData(details);
          break;

        default:
          break;
      }
    }
    
  }
}

const getPolicyAreaDetails = (selected) => {
  let denom, url, pa;
  if (policyAreas && selected && Array.isArray(selected) && selected.length > 0) {
    switch (selected.length) {
      case 2:
        denom = policyAreas[selected[0]].items[selected[1]].total;
        url = policyAreas[selected[0]].items[selected[1]].url;
        pa = policyAreas[selected[0]].items[selected[1]];
        break;
      case 3:
        denom =  policyAreas[selected[0]].items[selected[1]].total;
        url = policyAreas[selected[0]].items[selected[1]].url;
        pa = policyAreas[selected[0]].items[selected[1]].items[selected[2]];
        break;
      default:
        break;
    }
  }
  return {pa, denom, url: `${API_ROOT_URL}/datasets?fileName=${url}`}; // api
  //return {pa, denom, url: `${API_ROOT_URL}/datasets?fileName=Dataset/Census Tracts/Demography/${url}`}; // local
}
export const getBreadCrumb = (selected) => {
  let breadcrumb = "";
  if (selected && Array.isArray(selected) && selected.length > 0) {
    switch (selected.length) {
      case 1:
        breadcrumb += `${policyAreas[selected[0]].name}`;
        break;
      case 2:
        breadcrumb += `${policyAreas[selected[0]].name}>`;
        breadcrumb += `${policyAreas[selected[0]].items[selected[1]].name}`;
        break;
      case 3:
        breadcrumb += `${policyAreas[selected[0]].name}>`;
        breadcrumb += `${policyAreas[selected[0]].items[selected[1]].name}>`;
        breadcrumb += `${policyAreas[selected[0]].items[selected[1]].items[selected[2]].name}`;
        break;
      default:
        break;
    }
  }
  return breadcrumb;
};
let policyAreas = undefined;
const imageMap = {
  'Demography': Demography,
  'Education': Education,
  'EmploymentIncome': EmploymentIncome,
  'Environment': Environment, 
  'FoodInsecurity': FoodInsecurity,
  'Health': Health,
  'HousingRealEstate': HousingRealEstate,
  'PublicSafety': PublicSafety,
  'SocialConnectedness': SocialConnectedness,
  'Transportation': Transportation,
};