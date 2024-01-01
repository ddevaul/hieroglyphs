export default class T3 {

  distanceSquaredBetween2Points = (pointX1, pointY1, pointX2, pointY2) => {
    const distanceSq = (pointX1 - pointX2)**2 + (pointY1 - pointY2)**2;
    return distanceSq;
  }

  distanceBetweenSemicircle = (pointX, pointY) => {
    const RADIUS = 100;
    const CIRCLE_VERTICAL_OFFSET = 250;
    const circleEquation = (x) => Math.sqrt(RADIUS**2 - x**2) + CIRCLE_VERTICAL_OFFSET

    const closestX = (RADIUS * pointX) / Math.sqrt(CIRCLE_VERTICAL_OFFSET**2 - 2*CIRCLE_VERTICAL_OFFSET*pointY + pointX**2 + pointY**2)
    const closestY = circleEquation(closestX)
    const distance = this.distanceSquaredBetween2Points(pointX, pointY, closestX, closestY);
    return [distance, closestX, closestY]
  }

  distanceBetweenBottom = (pointX, pointY) => {
    const HEIGHT = 250;
  }

}