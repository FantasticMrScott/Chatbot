function hexToRgb(hex) {
  var hex = hex.replace(/[^0-9A-F]/gi, ''); //remove # from hexcode
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint) >> 8 & 255;
  var b = bigint & 255;
  var result =  r.toString().padStart(3, '0') + g.toString().padStart(3, '0') + b.toString().padStart(3,'0'); //make sure RGB is in xxx,xxx,xxx format
  var result = result + encodeURI('@'); // @ symbold alerts the arduino that the string is complete
  return result;
}

module.exports = {hexToRgb};