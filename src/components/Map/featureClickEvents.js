
export const showPopUp = (e) => {
  //Make sure the event occurred on a shape feature.
  if (e.shapes && e.shapes.length > 0) {
    //By default, show the popup where the mouse event occurred.
    var pos = e.position;
    var offset = [0, 0];
    var properties;

    if (e.shapes[0] instanceof atlas.Shape) {
      properties = e.shapes[0].getProperties();

      //If the shape is a point feature, show the popup at the points coordinate.
      if (e.shapes[0].getType() === "Point") {
        pos = e.shapes[0].getCoordinates();
        offset = [0, -18];
      }
    } else {
      properties = e.shapes[0].properties;

      //If the shape is a point feature, show the popup at the points coordinate.
      if (e.shapes[0].type === "Point") {
        pos = e.shapes[0].geometry.coordinates;
        offset = [0, -18];
      }
    }
    console.log(properties);
    /* //Update the content and position of the popup.
        popup.setOptions({
            //Create a table from the properties in the feature.
            content: atlas.PopupTemplate.applyTemplate(properties),
            position: pos,
            pixelOffset: offset
        });

        //Open the popup.
        popup.open(map); */
  }
};
