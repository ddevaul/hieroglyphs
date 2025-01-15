import {
  Dimensions, 
  PanResponder,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Svg, { Polyline, Line, Circle, Path } from 'react-native-svg';

export default class Quail {
  constructor(length) {
    this.length = length;
    this.name = 'Quail';
    this.tolerance = 15;
    this.strokeWidth = 5;
    this.numSegments = 6;
    this.line1Points = [
      [{"x": 100, "y": 100},{"x": 100, "y": 100},{"x": 110, "y": 85},{"x": 130, "y": 72},],
      [{"x": 130, "y": 72},{"x": 130, "y": 72},{"x": 137, "y": 66},{"x": 140, "y": 66},],
      [{"x": 139, "y": 66},{"x": 140, "y": 65},{"x": 165, "y": 66},{"x": 177, "y": 71},],
      [{"x": 177, "y": 71},{"x": 177, "y": 71},{"x": 180, "y": 73},{"x": 181, "y": 78},],
      [{"x": 181, "y": 78},{"x": 181, "y": 78},{"x": 186, "y": 94},{"x": 187, "y": 103},],
  ]
    this.line2Points = [
      [{"x": 88, "y": 100},{"x": 90, "y": 100},{"x": 97, "y": 100},{"x": 110, "y": 100},],
      [{"x": 110, "y": 100},{"x": 110, "y": 100},{"x": 115, "y": 100},{"x": 115, "y": 105},],
      [{"x": 115, "y": 105},{"x": 115, "y": 105},{"x": 115, "y": 165},{"x": 115, "y": 172},],
      [{"x": 115, "y": 172},{"x": 115, "y": 172},{"x": 115, "y": 176},{"x": 117, "y": 180},],
      [{"x": 117, "y": 180},{"x": 117, "y": 180},{"x": 200, "y": 300},{"x": 200, "y": 300},],
      [{"x": 200, "y": 300},{"x": 200, "y": 300},{"x": 210, "y": 310},{"x": 210, "y": 315},],
      [{"x": 210, "y": 315},{"x": 210, "y": 315},{"x": 210, "y": 380},{"x": 210, "y": 380},],
    ]
    this.line3Points = [
      [{"x": 188, "y": 283},{"x": 188, "y": 283},{"x": 130, "y": 380},{"x": 130, "y": 380},],
    ]
    this.line4Points = [
      [{"x": 187, "y": 103},{"x": 187, "y": 103},{"x": 190, "y": 110},{"x": 195, "y": 110},],
      [{"x": 195, "y": 110},{"x": 195, "y": 110},{"x": 222, "y": 125},{"x": 230, "y": 140},],
      [{"x": 230, "y": 140},{"x": 230, "y": 140},{"x": 280, "y": 186},{"x": 320, "y": 270},],
      [{"x": 320, "y": 270},{"x": 320, "y": 270},{"x": 198, "y": 295},{"x": 198, "y": 295},],
    ]
    this.line5Points = [
      [{"x": 210, "y": 380},{"x": 210, "y": 380},{"x": 90, "y": 380},{"x": 90, "y": 380},],
    ]
    this.line6Points = [
      [{"x": 185, "y": 170},{"x": 185, "y": 170},{"x": 170, "y": 196},{"x": 174, "y": 201},],
      [{"x": 174, "y": 201},{"x": 174, "y": 201},{"x": 204, "y": 230},{"x": 204, "y": 230},],
      [{"x": 204, "y": 232},{"x": 204, "y": 232},{"x": 210, "y": 180},{"x": 210, "y": 180},],
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
    console.log(avgDotProduct);
    if (avgDotProduct > threshold) return true;
    return false;
  }

  inBounds = (points, segmentIndex) => {
    let threshold = 0.8;
    if (segmentIndex === 0) {
      return this.isLine(this.line1Points, points, threshold);
    }
    if (segmentIndex === 1) {
      return this.isLine(this.line2Points, points, threshold);
    }
    if (segmentIndex === 2) {
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
        {(maxSegmentIndex > 0 || reveal) ? 
        <>
          {/* head */}
          <Path d={`M ${(100 / 400 * this.length)} ${(100 / 400 * this.length)} C ${(100 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(110 / 400 * this.length)} ${(85 / 400 * this.length)}, ${(130 / 400 * this.length)} ${(72 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(130 / 400 * this.length)} ${(72 / 400 * this.length)} C ${(130 / 400 * this.length)} ${(72 / 400 * this.length)}, ${(137 / 400 * this.length)} ${(66 / 400 * this.length)}, ${(140 / 400 * this.length)} ${(66 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(139 / 400 * this.length)} ${(66 / 400 * this.length)} C ${(140 / 400 * this.length)} ${(65 / 400 * this.length)}, ${(165 / 400 * this.length)} ${(66 / 400 * this.length)}, ${(177 / 400 * this.length)} ${(71 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(177 / 400 * this.length)} ${(71 / 400 * this.length)} C ${(177 / 400 * this.length)} ${(71 / 400 * this.length)}, ${(180 / 400 * this.length)} ${(73 / 400 * this.length)}, ${(181 / 400 * this.length)} ${(78 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(181 / 400 * this.length)} ${(78 / 400 * this.length)} C ${(181 / 400 * this.length)} ${(78 / 400 * this.length)}, ${(186 / 400 * this.length)} ${(94 / 400 * this.length)}, ${(187 / 400 * this.length)} ${(103 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
        </>
          : <></>}
        
        {(maxSegmentIndex > 1 || reveal) ? 
        <>
          <Path d={`M ${(88 / 400 * this.length)} ${(100 / 400 * this.length)} C ${(90 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(97 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(110 / 400 * this.length)} ${(100 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(110 / 400 * this.length)} ${(100 / 400 * this.length)} C ${(110 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(115 / 400 * this.length)} ${(100 / 400 * this.length)}, ${(115 / 400 * this.length)} ${(105 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(115 / 400 * this.length)} ${(105 / 400 * this.length)} C ${(115 / 400 * this.length)} ${(105 / 400 * this.length)}, ${(115 / 400 * this.length)} ${(165 / 400 * this.length)}, ${(115 / 400 * this.length)} ${(172 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(115 / 400 * this.length)} ${(172 / 400 * this.length)} C ${(115 / 400 * this.length)} ${(172 / 400 * this.length)}, ${(115 / 400 * this.length)} ${(176 / 400 * this.length)}, ${(117 / 400 * this.length)} ${(180 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(117 / 400 * this.length)} ${(180 / 400 * this.length)} C ${(117 / 400 * this.length)} ${(180 / 400 * this.length)}, ${(200 / 400 * this.length)} ${(300 / 400 * this.length)}, ${(200 / 400 * this.length)} ${(300 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(200 / 400 * this.length)} ${(300 / 400 * this.length)} C ${(200 / 400 * this.length)} ${(300 / 400 * this.length)}, ${(210 / 400 * this.length)} ${(310 / 400 * this.length)}, ${(210 / 400 * this.length)} ${(315 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(210 / 400 * this.length)} ${(315 / 400 * this.length)} C ${(210 / 400 * this.length)} ${(315 / 400 * this.length)}, ${(210 / 400 * this.length)} ${(380 / 400 * this.length)}, ${(210 / 400 * this.length)} ${(380 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
        </>
        : <></>
        }

{(maxSegmentIndex > 2 || reveal) ? 
        <>
          <Path d={`M ${(188 / 400 * this.length)} ${(283 / 400 * this.length)} C ${(188 / 400 * this.length)} ${(283 / 400 * this.length)}, ${(130 / 400 * this.length)} ${(380 / 400 * this.length)}, ${(130 / 400 * this.length)} ${(380 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
        </>
        : <></>
        }

{(maxSegmentIndex > 3 || reveal) ? 
        <>
          <Path d={`M ${(187 / 400 * this.length)} ${(103 / 400 * this.length)} C ${(187 / 400 * this.length)} ${(103 / 400 * this.length)}, ${(190 / 400 * this.length)} ${(110 / 400 * this.length)}, ${(195 / 400 * this.length)} ${(110 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(195 / 400 * this.length)} ${(110 / 400 * this.length)} C ${(195 / 400 * this.length)} ${(110 / 400 * this.length)}, ${(222 / 400 * this.length)} ${(125 / 400 * this.length)}, ${(230 / 400 * this.length)} ${(140 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(230 / 400 * this.length)} ${(140 / 400 * this.length)} C ${(230 / 400 * this.length)} ${(140 / 400 * this.length)}, ${(280 / 400 * this.length)} ${(186 / 400 * this.length)}, ${(320 / 400 * this.length)} ${(270 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(320 / 400 * this.length)} ${(270 / 400 * this.length)} C ${(320 / 400 * this.length)} ${(270 / 400 * this.length)}, ${(198 / 400 * this.length)} ${(295 / 400 * this.length)}, ${(198 / 400 * this.length)} ${(295 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 

        </>
        : <></>
}

{(maxSegmentIndex > 4 || reveal) ? 
        <>
          <Path d={`M ${(210 / 400 * this.length)} ${(380 / 400 * this.length)} C ${(210 / 400 * this.length)} ${(380 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(380 / 400 * this.length)}, ${(90 / 400 * this.length)} ${(380 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
        </>
        : <></>
}

{(maxSegmentIndex > 5 || reveal) ? 
        <>
          <Path d={`M ${(185 / 400 * this.length)} ${(170 / 400 * this.length)} C ${(185 / 400 * this.length)} ${(170 / 400 * this.length)}, ${(170 / 400 * this.length)} ${(196 / 400 * this.length)}, ${(174 / 400 * this.length)} ${(201 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(174 / 400 * this.length)} ${(201 / 400 * this.length)} C ${(174 / 400 * this.length)} ${(201 / 400 * this.length)}, ${(204 / 400 * this.length)} ${(230 / 400 * this.length)}, ${(204 / 400 * this.length)} ${(230 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
          <Path d={`M ${(204 / 400 * this.length)} ${(232 / 400 * this.length)} C ${(204 / 400 * this.length)} ${(232 / 400 * this.length)}, ${(210 / 400 * this.length)} ${(180 / 400 * this.length)}, ${(210 / 400 * this.length)} ${(180 / 400 * this.length)}`} fill="none" stroke={color} strokeWidth="5"/> 
        </>
        : <></>
}
      </>
    )

  }
}