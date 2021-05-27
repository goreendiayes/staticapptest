import {map, addBoundingBox} from '../Map/Map';
//import {initAzureAD} from '~/src/common/azure/tokenService';

let token = undefined;
let addresssGeocodeServiceUrlTemplate = 'https://{azMapsDomain}/search/{searchType}/json?typeahead=true&api-version=1&query={query}&language={language}&countrySet={countrySet}&view=Auto&topLeft={topLeft}&btmRight={btmRight}';

export const searchByAddress = async(searchTerm) => {
    /* if (!token) {
        await initAzureAD();
    } */
  //Create a URL to the Azure Maps search service to perform the address search.
  //let center = map.getCamera().center;
  
  /*la county turf bbox
  [-118.94467377287629, 33.29910117358037, -117.64637399956041, 34.82315000077199]

  0: (2) [-118.94467377287629, 33.29910117358037]
  1: (2) [-117.64637399956041, 33.29910117358037]
  2: (2) [-117.64637399956041, 34.82315000077199]
  3: (2) [-118.94467377287629, 34.82315000077199]
  4: (2) [-118.94467377287629, 33.29910117358037]


  topLeft  -118.94467377287629, 34.82315000077199
  btmRight -117.64637399956041, 33.29910117358037 */

  let requestUrl = addresssGeocodeServiceUrlTemplate
    .replace("{query}", encodeURIComponent(searchTerm))
    .replace('{searchType}', "fuzzy") // ['address', 'fuzzy', 'poi', 'poi/category']
    .replace("{language}", "en-US")
    .replace("{countrySet}", "US")//A comma seperated string of country codes to limit the suggestions to.
    .replace("{topLeft}", '34.82315000077199,-118.94467377287629')
    .replace("{btmRight}", '33.29910117358037,-117.64637399956041')

    //debug to show searchable bounding box on the map
    //addBoundingBox([-118.94467377287629, 34.82315000077199], [-117.64637399956041, 33.29910117358037]);


  //Proces the request.
  requestUrl = requestUrl.replace('{azMapsDomain}', atlas.getDomain());
  let requestParams = map.authentication.signRequest({ url: requestUrl });
  let transform = map.getServiceOptions().tranformRequest;
  if (transform) {
      requestParams = transform(request);
  }
  let result = await fetch(requestParams.url, {
    method: "GET",
    mode: "cors",
    headers: new Headers(requestParams.headers),
  })
  .then((r) => r.json())
    .then((data) => {
      return data;
    });
    

    return result;
}
