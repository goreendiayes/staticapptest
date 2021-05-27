export default function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
  
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }
  
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
  
      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
  
    // If we made it this far, objects
    // are considered equivalent
    return true;
}

export const fetchJSON = async (URL, useCors=false) => {
  try {
      let options = { method: "GET", mode: 'cors', };
      const response = await fetch(URL, useCors ? options : undefined);
      if(!response.ok) {
          throw new Error(response);
      }
      return await response.json()
  } catch(error) {
      throw error
  }
}

(() => {
  String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
})()