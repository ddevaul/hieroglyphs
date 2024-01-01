import {
  Dimensions, 
  PanResponder,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Svg, { Polyline, Line, Circle, Path } from 'react-native-svg';

export default class T {
  constructor(length) {
    this.name = "Bread 'T'"
    this.tolerance = 15;
    this.strokeWidth = 5;
    this.startX = parseInt(length / 4);
    this.startY = parseInt(0.625 * length);
    this.radius = parseInt(length/4);
    this.endX = this.startX + 2*this.radius;
    this.numSegments = 2;
  }

  #isSemiCircle = (points) => {
    // Calculate the centroid (center of mass)
    const ys = points.map(p => p.y)
    ys.sort((a, b) => b - a);
    let minAvgY = 0;
    let k = 10
    for (let i = 0; i < k; i++) {
      minAvgY += ys[i];
    }
    minAvgY /= k;
    const centroid = {"x": 0, "y": minAvgY}

    for (let i = 0; i < points.length; i++) {
      centroid.x += points[i]["x"]
    }
    centroid.x /= points.length;

    // Calculate the average distance from the centroid
    let avgdist = 0;
    let avgAboveCentroid = 0;
    for (let i = 0; i < points.length; i++) {
      let point = points[i]
      avgdist += Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2)
      if (point.y < centroid.y) avgAboveCentroid++;
    }
    avgdist /= points.length;
    avgAboveCentroid /= points.length;

    // error from radius 
    let MSE = 0;
    let maxError = 0;
    for (let i = 0; i < points.length; i++) {
      let point = points[i]
      let dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2)
      let diffsq = (dist - avgdist) ** 2
      if (Math.sqrt(diffsq) > maxError) maxError = Math.sqrt(diffsq);
      MSE += diffsq
    }
    MSE /= points.length;

    const maxMSE = 2 * this.length; // Adjust this threshold as needed
    if (MSE > maxMSE) return false;

    const minimumAvgAboveCentroid = 0.6;
    if (avgAboveCentroid < minimumAvgAboveCentroid) return false;

    if (maxError > 0.5 * this.radius) return false;

    return true;
  }

  #isLine = (points) => {
    // Extract either x-coordinates or y-coordinates based on isHorizontal flag
      const coordinates = points.map(point => point.y);

    // Calculate the range (difference between max and min)
    const range = Math.max(...coordinates) - Math.min(...coordinates);

    // Check if the range is within the tolerance
    const tolerance = 20;
    return range <= tolerance;
  }

  inBounds = (points, segmentIndex) => {
    if (segmentIndex === 0) {
      return this.#isSemiCircle(points);
    }
    if (segmentIndex === 1) {
      return this.#isLine(points);
    }
    return false;
  }

  #circle = (x) => {
    let sqr = - Math.sqrt((this.radius * this.radius) - (x - 2 * this.radius) * (x - 2 * this.radius));
    if (!isNaN(sqr)) {
      return sqr + this.startY;
    } 
    return sqr
  }

  shape = (color, maxSegmentIndex, reveal) => {
    if (reveal) {
      color = 'red'
      return (
        <>
          <Path d={`M ${this.startX} ${this.startY} A ${this.radius} ${this.radius} 0 0 1 ${this.endX} ${this.startY}`} fill="none" stroke={color} strokeWidth="5"/>
          <Line x1={`${this.startX-2}`} y1={`${this.startY}`} x2={`${this.endX + 2}`} y2={`${this.startY}`} stroke={color} strokeWidth="5"></Line>
        </>
      )
    }
    if (maxSegmentIndex === 0) {
      return <></>
    }

    if (maxSegmentIndex === 1) {
      return <Path d={`M ${this.startX} ${this.startY} A ${this.radius} ${this.radius} 0 0 1 ${this.endX} ${this.startY}`} fill="none" stroke={color} strokeWidth="5"/>
    } 
    return (
      <>
      <Path d={`M ${this.startX} ${this.startY} A ${this.radius} ${this.radius} 0 0 1 ${this.endX} ${this.startY}`} fill="none" stroke={color} strokeWidth="5"/>
      <Line x1={`${this.startX-2}`} y1={`${this.startY}`} x2={`${this.endX + 2}`} y2={`${this.startY}`} stroke={color} strokeWidth="5"></Line>
      </>
    )

  }
}