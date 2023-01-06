function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,8), 16);
  return r.toString().padStart(3, '0') + g.toString().padStart(3, '0') + b.toString().padStart(3, '0') + '@';
}


module.exports = {hexToRgb};