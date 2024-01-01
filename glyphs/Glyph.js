import {
  Dimensions, 
  PanResponder,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Svg, { Polyline, Line, Circle, Path } from 'react-native-svg';

export default class Glyph {
  constructor(length) {
    this.name = ''
    this.tolerance = 15;
    this.strokeWidth = 5;
    this.numSegments = 2;
  }

  inBounds = (points, segmentIndex) => {
    return false;
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