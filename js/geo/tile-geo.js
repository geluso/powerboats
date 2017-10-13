class TileGeo {
  static distance(t1, t2) {
    if (t1 === undefined || t2 === undefined) {
      return Infinity;
    }
    var dx = t1.xIndex - t2.xIndex;
    var dy = t1.yIndex - t2.yIndex;
    var dz = t1.zIndex - t2.zIndex;

    var dd = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return dd;
  }
}
