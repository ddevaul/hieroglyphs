import {
  Dimensions, 
  PanResponder,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Svg, { Polyline, Line, Circle, Path } from 'react-native-svg';

export default class Cobra {
  constructor(length) {
    this.length = length;
    this.name = 'Cobra';
    this.tolerance = 15;
    this.strokeWidth = 5;
    this.numSegments = 2;
    this.line1Points = [
      [{"x": 95, "y": 110},{"x": 95, "y": 115.5},{"x": 85.5, "y": 120},{"x": 80, "y": 120},],
      [{"x": 80, "y": 120},{"x": 74.5, "y": 120},{"x": 65, "y": 115.5},{"x": 65, "y": 110},],
      [{"x": 65, "y": 110},{"x": 65, "y": 104.5},{"x": 74.5, "y": 100},{"x": 80, "y": 100},],
      [{"x": 80, "y": 100},{"x": 85.5, "y": 100},{"x": 95, "y": 104.5},{"x": 95, "y": 110},],
      [{"x": 95, "y": 110},{"x": 95, "y": 110},{"x": 88, "y": 136},{"x": 87, "y": 138},],
      [{"x": 87, "y": 138},{"x": 85, "y": 143},{"x": 81, "y": 155},{"x": 82, "y": 158},],
      [{"x": 82, "y": 158},{"x": 83, "y": 165},{"x": 90, "y": 165},{"x": 90, "y": 165},],
      [{"x": 87, "y": 165},{"x": 87, "y": 165},{"x": 230, "y": 160},{"x": 230, "y": 160},],
      [{"x": 230, "y": 160},{"x": 270, "y": 160},{"x": 280, "y": 210},{"x": 280, "y": 270},],
      [{"x": 280, "y": 270},{"x": 280, "y": 300},{"x": 300, "y": 355},{"x": 305, "y": 360},],
    ]
    this.line2Points = [
      [{"x": 82, "y": 158},{"x": 83, "y": 175},{"x": 90, "y": 175},{"x": 90, "y": 175},],
      [{"x": 87, "y": 175},{"x": 87, "y": 175},{"x": 230, "y": 180},{"x": 230, "y": 180},],
      [{"x": 230, "y": 180},{"x": 270, "y": 185},{"x": 280, "y": 210},{"x": 280, "y": 270},],
    ]
  }

  distance = (point1, point2) => {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) **2 )
  }

  bezier = (t, point1, point2, point3, point4) => {
    let x_bezier = (1 - t)**3 * point1.x + 3 * (1 - t) ** 2 * t * point2.x + 3 * (1 - t) * t**2 * point3.x + t**3 * point4.x;
    let y_bezier = (1 - t)**3 * point1.y + 3 * (1 - t) ** 2 * t * point2.y + 3 * (1 - t) * t**2 * point3.y + t**3 * point4.y;
    return {"x": x_bezier, "y": y_bezier};
  }

  slope = (point1, point2) => {
    return [point2.x - point1.x, point2.y - point1.y];
  }

  isOrderInvariantLine = (bezierPoints, points, threshold) => {
    let bezierReordered = bezierPoints;
    for (let i = 0; i < bezierReordered.length; i++) {
      let result = this.isDirectionInvariant(bezierReordered, points, threshold);
      if (result === true) return true;
      let first = bezierReordered.shift();
      bezierReordered.push(first);
    }
    return false;
  }

  isDirectionInvariant = (bezierPoints, points, threshold) => {
    let normalResult = this.isLine(bezierPoints, points, threshold);
    if (normalResult === true) return true;
    let reverseBezierPoints = []
    for (let i = 0; i < bezierPoints.length; i++) {
      reverseBezierPoints[bezierPoints.length - i - 1] = bezierPoints[i].reverse();
    }
    return this.isLine(reverseBezierPoints, points, threshold);
  }

  isLine = (bezierPoints, points, threshold) => {
    // find the arc length of the input arc
    let inputArcLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      inputArcLength += this.distance(points[i], points[i + 1]);
    }
    // for point in points: 
    // find the arc length of the ground truth arc:
    let segmentLengths = []
    let ts = []
    const num_ts = 25;
    for (let i = 0; i < num_ts + 1; i++) {
      ts.push(i / num_ts);
    }
    let groundTruthArcLength = 0;
    for (let i = 0; i < bezierPoints.length; i++) {
      let tempSegObj = {lowerBound: groundTruthArcLength}
      let segmentPoints = bezierPoints[i];
      let current = this.bezier(0, ...segmentPoints);
      let segmentLength = 0;
      for (let ii = 1; ii < ts.length; ii++) {
        let next = this.bezier(ts[ii], ...segmentPoints);
        let dist = this.distance(current, next);
        segmentLength += dist;
        groundTruthArcLength += dist;
        current = next;
      }
      tempSegObj.length = segmentLength;
      tempSegObj.upperBound = groundTruthArcLength;
      segmentLengths.push(tempSegObj);
    }
    let avgDotProduct = 0;
    
    // time w.r.t. entire arclength
    let time1 = 0;
    for (let i = 0; i < points.length - 1; i++) {
      let time2 = time1 + this.distance(points[i], points[i + 1]) / inputArcLength;
      // find the right segment
      let point1InArcLength = time1 * groundTruthArcLength;
      let point2InArcLength = time2 * groundTruthArcLength;
      time1 = time2;

      let point1SegmentIndex = 0;
      for (let ii = 0; ii < segmentLengths.length; ii++) {
        let lower = segmentLengths[ii].lowerBound;
        let upper = segmentLengths[ii].upperBound;
        if (point1InArcLength >= lower && point1InArcLength <= upper) {
          point1SegmentIndex = ii;
          break;
        }
      }
      let point2SegmentIndex = 0;
      for (let ii = 0; ii < segmentLengths.length; ii++) {
        let lower = segmentLengths[ii].lowerBound;
        let upper = segmentLengths[ii].upperBound;
        if (point2InArcLength >= lower && point2InArcLength <= upper) {
          point2SegmentIndex = ii;
          break;
        }
      }

      // getting the time proportional to the individual segment
      let t1 = (point1InArcLength - segmentLengths[point1SegmentIndex].lowerBound) / segmentLengths[point1SegmentIndex].length;
      let t2 = (point2InArcLength - segmentLengths[point2SegmentIndex].lowerBound) / segmentLengths[point2SegmentIndex].length;

      let groundTruthPoint1 = this.bezier(t1, ...bezierPoints[point1SegmentIndex]);
      let groundTruthPoint2 = this.bezier(t2, ...bezierPoints[point2SegmentIndex]);

      let inputPoint1 = points[i];
      let inputPoint2 = points[i + 1];

      let slope1 = this.slope(groundTruthPoint1, groundTruthPoint2);
      let slope2 = this.slope(inputPoint1, inputPoint2);
      // normalize the vectors 
      let slope1Norm = Math.sqrt((slope1[0])**2 + (slope1[1])**2)
      let slope2Norm = Math.sqrt((slope2[0])**2 + (slope2[1])**2)
      slope1[0] /= slope1Norm;
      slope1[1] /= slope1Norm;
      slope2[0] /= slope2Norm;
      slope2[1] /= slope2Norm;

      let dotProduct = slope1[0] * slope2[0] + slope1[1] * slope2[1];
      avgDotProduct += dotProduct; 
    }
    avgDotProduct /= points.length;
    if (avgDotProduct > threshold) return true;
    return false;
  }

  inBounds = (points, segmentIndex) => {
    let threshold = 0.65;
    if (segmentIndex === 0) {
      // check rotations
      return this.isOrderInvariantLine(this.line1Points, points, threshold);
    } else if (segmentIndex === 1) {
      // check rotations
      return this.isOrderInvariantLine(this.line2Points, points, threshold);
    }
    return false;
  }

  shape = (color, maxSegmentIndex, reveal) => {
    color = reveal ? 'red' : color;
    // color = color;

    return (
      <>
        {(maxSegmentIndex > 0 || reveal) ? 
        <>
          <Path d={`M ${(95 / 400 * this.length)} ${(110 / 400 * this.length)} C ${(95 / 400 * this.length)} ${(115.5 / 400 * this.length)}, ${(85.5 / 400 * this.length)} ${(120 / 400 * this.length)}, ${(80 / 400 * this.length)} ${(120 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(80 / 400 * this.length)} ${(120 / 400 * this.length)} C ${(74.5 / 400 * this.length)} ${(120 / 400 * this.length)}, ${(65 / 400 * this.length)} ${(115.5 / 400 * this.length)}, ${(65 / 400 * this.length)} ${(110 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(65 / 400 * this.length)} ${(110 / 400 * this.length)} C ${(65 / 400 * this.length)} ${(104.5 / 400 * this.length)}, ${(74.5 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(80 / 400 * this.length)} ${(100 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(80 / 400 * this.length)} ${(100 / 400 * this.length)} C ${(85.5 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(95 / 400 * this.length)} ${(104.5 / 400 * this.length)}, ${(95 / 400 * this.length)} ${(110 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(95 / 400 * this.length)} ${(110 / 400 * this.length)} C ${(95 / 400 * this.length)} ${(110 / 400 * this.length)}, ${(88 / 400 * this.length)} ${(136 / 400 * this.length)}, ${(87 / 400 * this.length)} ${(138 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(87 / 400 * this.length)} ${(138 / 400 * this.length)} C ${(85 / 400 * this.length)} ${(143 / 400 * this.length)}, ${(81 / 400 * this.length)} ${(155 / 400 * this.length)}, ${(82 / 400 * this.length)} ${(158 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(82 / 400 * this.length)} ${(158 / 400 * this.length)} C ${(83 / 400 * this.length)} ${(165 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(165 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(165 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(87 / 400 * this.length)} ${(165 / 400 * this.length)} C ${(87 / 400 * this.length)} ${(165 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(160 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(160 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(230 / 400 * this.length)} ${(160 / 400 * this.length)} C ${(270 / 400 * this.length)} ${(160 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(210 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(270 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
          <Path d={`M ${(280 / 400 * this.length)} ${(270 / 400 * this.length)} C ${(280 / 400 * this.length)} ${(300 / 400 * this.length)}, ${(300 / 400 * this.length)} ${(355 / 400 * this.length)}, ${(305 / 400 * this.length)} ${(360 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
        </>
        : <></>}
        {(maxSegmentIndex > 1 || reveal) ? 
        <>
          <Path d={`M ${(82 / 400 * this.length)} ${(158 / 400 * this.length)} C ${(83 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(175 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(87 / 400 * this.length)} ${(175 / 400 * this.length)} C ${(87 / 400 * this.length)} ${(175 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(180 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(180 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(230 / 400 * this.length)} ${(180 / 400 * this.length)} C ${(270 / 400 * this.length)} ${(185 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(210 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(270 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
        </>
        : <></>}
      </>
    )

  }
}