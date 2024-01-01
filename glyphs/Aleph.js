import {
  Dimensions, 
  PanResponder,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Svg, { Polyline, Line, Circle, Path } from 'react-native-svg';

export default class Aleph {
  constructor(length) {
    this.length = length;
    this.name = 'Aleph';
    this.tolerance = 15;
    this.strokeWidth = 5;
    this.line1Points = [[{"x": 100, "y": 110}, {"x": 110, "y": 97}, {"x": 130, "y": 88}, {"x": 200, "y": 88}]] // all the points for all the bezier curves
    this.line2Points = [[{"x": 100, "y": 110}, {"x": 140, "y": 70}, {"x": 150, "y": 108}, {"x": 150, "y": 200}], [{"x": 150, "y": 200}, {"x": 150, "y": 260}, {"x": 220, "y": 260}, {"x": 220, "y": 360}]] // all the points for all the bezier curves
    this.line3Points = [[{"x": 180, "y": 260}, {"x": 180, "y": 290}, {"x": 170, "y": 320}, {"x": 160, "y": 360}]]
    this.line4Points = [[{"x": 200, "y": 88}, {"x": 200, "y": 130}, {"x": 200, "y": 140}, {"x": 205, "y": 145}], [{"x": 205, "y": 145}, {"x": 230, "y": 180}, {"x": 300, "y": 240}, {"x": 340, "y": 360}]]
    this.line5Points = [[{"x": 170, "y": 310}, {"x": 171, "y": 312}, {"x": 172, "y": 314}, {"x": 240, "y": 325}], [{"x": 240, "y": 325}, {"x": 245, "y": 300}, {"x": 245, "y": 300}, {"x": 245, "y": 300}], [{"x": 245, "y": 300}, {"x": 260, "y": 305}, {"x": 280, "y": 330}, {"x": 290, "y": 345}], [{"x": 290, "y": 345}, {"x": 330, "y": 360}, {"x": 330, "y": 360}, {"x": 330, "y": 360}], [{"x": 330, "y": 360}, {"x": 335, "y": 350}, {"x": 335, "y": 350}, {"x": 335, "y": 350}]]
    this.line6Points = [[{"x": 250, "y": 360}, {"x": 110, "y": 360}, {"x": 110, "y": 360}, {"x": 110, "y": 360}]]
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
    // console.log(avgDotProduct);
    if (avgDotProduct > threshold) return true;
    return false;
  }

  inBounds = (points, segmentIndex) => {
    let threshold = 0.8;
    if (segmentIndex === 0) {
      threshold = 0.8;
      return this.isLine(this.line1Points, points, threshold);
    }
    if (segmentIndex === 1) {
      return this.isLine(this.line2Points, points, threshold);
    }
    if (segmentIndex === 2) {
      threshold = 0.8;
      return this.isLine(this.line3Points, points, threshold);
    }
    if (segmentIndex === 3) {
      return this.isLine(this.line4Points, points, threshold);
    }
    if (segmentIndex === 4) {
      return this.isLine(this.line5Points, points, threshold);
    }
    if (segmentIndex === 5) {
      return this.isLine(this.line6Points, points, threshold);
    }
    return false;
  }

  shape = (color, maxSegmentIndex, reveal) => {
    color = reveal ? 'red' : color;

    return (
      <>
       {/* falcons head */}
        {(maxSegmentIndex > 0 || reveal) ? <Path d={`M ${(100 / 400 * this.length)} ${(110 / 400 * this.length)} C ${(110 / 400 * this.length)} ${(97  / 400 * this.length)}, ${(130 / 400 * this.length)} ${(88  / 400 * this.length)}, ${(200 / 400 * this.length)} ${(88  / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> : <></>}
        
        {(maxSegmentIndex > 1 || reveal) ? 
        <>
          <Path d={`M ${(100 / 400 * this.length)} ${(110 / 400 * this.length)} C ${(140 / 400 * this.length)} ${(70  / 400 * this.length)}, ${(150 / 400 * this.length)} ${(108 / 400 * this.length)}, ${(150 / 400 * this.length)} ${(200 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
          <Path d={`M ${(150 / 400 * this.length)} ${(200 / 400 * this.length)} C ${(150 / 400 * this.length)} ${(260 / 400 * this.length)}, ${(220 / 400 * this.length)} ${(260 / 400 * this.length)}, ${(220 / 400 * this.length)} ${(360 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
        </>
        : <></>
        }
        
        {(maxSegmentIndex > 2 || reveal) ? <Path d={`M ${(180 / 400 * this.length)} ${(260 / 400 * this.length)} C ${(180 / 400 * this.length)} ${(290 / 400 * this.length)}, ${(170 / 400 * this.length)} ${(320 / 400 * this.length)}, ${(160 / 400 * this.length)} ${(360 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> : <></> }
        {(maxSegmentIndex > 3 || reveal) ? 
        <> 
          <Path d={`M ${(200 / 400 * this.length)} ${(88  / 400 * this.length)} C ${(200 / 400 * this.length)} ${(130 / 400 * this.length)}, ${(200 / 400 * this.length)} ${(140 / 400 * this.length)}, ${(205 / 400 * this.length)} ${(145 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
          <Path d={`M ${(205 / 400 * this.length)} ${(145 / 400 * this.length)} C ${(230 / 400 * this.length)} ${(180 / 400 * this.length)}, ${(300 / 400 * this.length)} ${(240 / 400 * this.length)}, ${(340 / 400 * this.length)} ${(360 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
        </>
        : <></>
        }
        {(maxSegmentIndex > 4 || reveal) ? 
        <>
          <Path d={`M ${(170 / 400 * this.length)} ${(310 / 400 * this.length)} C ${(171 / 400 * this.length)} ${(312 / 400 * this.length)}, ${(172 / 400 * this.length)} ${(314 / 400 * this.length)}, ${(240 / 400 * this.length)} ${(325 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
          <Path d={`M ${(240 / 400 * this.length)} ${(325 / 400 * this.length)} C ${(245 / 400 * this.length)} ${(300 / 400 * this.length)}, ${(245 / 400 * this.length)} ${(300 / 400 * this.length)}, ${(245 / 400 * this.length)} ${(300 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
          <Path d={`M ${(245 / 400 * this.length)} ${(300 / 400 * this.length)} C ${(260 / 400 * this.length)} ${(305 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(330 / 400 * this.length)}, ${(290 / 400 * this.length)} ${(345 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
          <Path d={`M ${(290 / 400 * this.length)} ${(345 / 400 * this.length)} C ${(330 / 400 * this.length)} ${(360 / 400 * this.length)}, ${(330 / 400 * this.length)} ${(360 / 400 * this.length)}, ${(330 / 400 * this.length)} ${(360 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
          <Path d={`M ${(330 / 400 * this.length)} ${(360 / 400 * this.length)} C ${(335 / 400 * this.length)} ${(350 / 400 * this.length)}, ${(335 / 400 * this.length)} ${(350 / 400 * this.length)}, ${(335 / 400 * this.length)} ${(350 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/>
        </>
        : <></>}
        {(maxSegmentIndex > 5 || reveal) ? <Path d={`M ${(250 / 400 * this.length)} ${(360 / 400 * this.length)} C ${(110 / 400 * this.length)} ${(360 / 400 * this.length)}, ${(110 / 400 * this.length)} ${(360 / 400 * this.length)}, ${(110 / 400 * this.length)} ${(360 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> : <></>}
      </>
    )

  }
}