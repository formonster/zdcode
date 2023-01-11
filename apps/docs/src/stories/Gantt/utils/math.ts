export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  var radLat1 = (lat1 * Math.PI) / 180.0
  var radLat2 = (lat2 * Math.PI) / 180.0
  var a = radLat1 - radLat2
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    )
  s = s * 63.78137 // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000
  return s
}

export function getAngle(x1: number, y1: number, x2: number, y2: number) {
  var radian = Math.atan2(y1 - y2, x1 - x2);
  var angle = 180 / Math.PI * radian;
  return angle
}