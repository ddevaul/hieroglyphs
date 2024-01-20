import React, { Component, useState, useRef, useCallback} from 'react';
import {
  Dimensions, 
  PanResponder,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Svg, { Polyline, Line, Circle, Path } from 'react-native-svg';
import T from '../glyphs/T';
import Aleph from '../glyphs/Aleph';
import Reed from '../glyphs/Reed';
import Arm from '../glyphs/Arm';
import Quail from '../glyphs/Quail';

const GesturePath = ({ length, paths, color, glyph, segmentIndex, reveal }) => {
  if (paths[0] == []) {
    return <View></View>
  }
  let points = []
  paths.forEach(path => {
    tempPoints = path.map(p => `${p.x},${p.y}`).join(' ');
    points.push(tempPoints)
  })
  return (
    // viewBox={`0 0 ${width} ${height * 0.85}`}
    <Svg height={length} width={length}>
      {/* grid lines */}
      <Line x1={(length / 4).toString()} y1="0" x2={(length / 4).toString()} y2={length} stroke="#027aba" strokeDasharray={[8]}/>
      <Line x1={(length / 2).toString()} y1="0" x2={(length / 2).toString()} y2={length} stroke="#027aba" strokeDasharray={[8]}/>
      <Line x1={(length / 2 + length / 4).toString()} y1="0" x2={(length / 2 + length / 4).toString()} y2={length} stroke="#027aba" strokeDasharray={[8]}/>
      <Line x1="0" y1={(length / 4).toString()} x2={length} y2={(length / 4).toString()} stroke="#027aba" strokeDasharray={[8]}/>
      <Line x1="0" y1={(length / 2).toString()} x2={length} y2={(length / 2).toString()} stroke="#027aba" strokeDasharray={[8]}/>
      <Line x1="0" y1={(length / 2 + length / 4).toString()} x2={length} y2={(length / 2 + length/ 4).toString()} stroke="#027aba" strokeDasharray={[8]}/>
      {glyph.shape('gray', segmentIndex, reveal)}
      

                        {/* 30 50 0 0 1 162.55 162.45 */}
      {/* <Polyline strokeWidth="5"  fill="none" stroke={color} points={}></Polyline> */}

        {points.map(p => {
          return (
          <Polyline
            points={p}
            fill="none"
            stroke={color}
            strokeWidth="5"
          />  
          )
        })}
    </Svg>    
  );
};

const GestureRecorder = ({ onPathChanged, segmentIndex, paths }) => {

  const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderStart: (event) => {
        console.log(event.nativeEvent.locationX, event.nativeEvent.locationY,);
      },
      onPanResponderMove: (event) => {
        onPathChanged({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        }, false);
      },
      onPanResponderRelease: (event) => { 
        onPathChanged({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        }, true) 
      }
    });

  return (
      <View
        style={StyleSheet.absoluteFill}
        {...panResponder.panHandlers}
      />
  );
}

export default SketchPad = () => {
  const SCALE_FACTOR = 0.95;
  const { width, height } = Dimensions.get('window');
  const length = width * SCALE_FACTOR;
  const [glyph, setGlyph] = useState(new Quail(length));
  const [paths, setPaths] = useState([[]]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [reveal, setReveal] = useState(false);


  const updatePath = (coords, finished) => {
    if (finished) {
      const newPaths = [...paths];
      newPaths[newPaths.length - 1].push(coords);
      let finishedSegmentCoords = newPaths[newPaths.length - 1];
      // console.log(segmentIndex, newPaths[0].length);
      let inBounds = glyph.inBounds(finishedSegmentCoords, segmentIndex);
      if (inBounds) {
        setSegmentIndex(si => si + 1);
      }
      setPaths(ppaths => {
        const newPaths = [...ppaths];
        newPaths.push([])
        // return newPaths;
        newPaths[newPaths.length - 1] = []
        return [[]];
      })
    } else {
      setPaths(ppaths => {
        const newPaths = [...ppaths];
        newPaths[newPaths.length - 1].push(coords);
        return newPaths;
      })
    }
  };

  const clearPaths = () => {
    // console.log(paths)
    setPaths([[]]);
    setSegmentIndex(0);
  };

  const selectGlyph = (name) => {
    clearPaths();
    if (name === 'Bread') {
      setGlyph(new T(length));
    } else if (name === 'Aleph') {
      setGlyph(new Aleph(length));
    } else if (name === 'Reed') {
      setGlyph(new Reed(length));
    } else if (name === 'Arm') {
      setGlyph(new Arm(length));
    } else if (name === 'Quail') {
      setGlyph(new Quail(length));
    }
  }

  return (
    <View style={styles.container}>
      <View><Text>{glyph.name}</Text></View>
       <View style={styles.canvas}>
        <GesturePath length={length} paths={paths} color="black" glyph={glyph} segmentIndex={segmentIndex} reveal={reveal}/>
        <GestureRecorder paths={paths} onPathChanged={updatePath} segmentIndex={segmentIndex} />
      </View>
      <View>
        <Button title="Arm" onPress={() => selectGlyph('Arm')}></Button>
        <Button title="Aleph" onPress={() => selectGlyph('Aleph')}></Button>
        <Button title="Bread (T)" onPress={() => selectGlyph('Bread')}></Button>
        <Button title="Reed (M)" onPress={() => selectGlyph('Reed')}></Button>
        <Button title="Quail (W)" onPress={() => selectGlyph('Quail')}></Button>

        <Button title="Reveal" onPress={() => setReveal(r => !r)}></Button>
      </View>
      <View style={styles.footer}>
        {/* <Button title="Length" onPress={() => console.log(paths.length)}></Button> */}
        <Button title="Clear" onPress={clearPaths}></Button>

        <Button title="Paths" style={styles.button} onPress={() => console.log(paths)}></Button>
        {/* <Button title="test" onPress={() => distanceBetweenSemicircle(95, 250)}></Button> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey', 
    height: "100%", width: "100%", display: 'flex', justifyContent: 'space-between',
    paddingBottom: "5%",
  },
  canvas: {
    backgroundColor: "orange",
  },
  footer: {
    backgroundColor: "red", 
  },
  button: {
    paddingBottom: "5px",
  }
});


// could either represent the image as:
// array of many, many points
// function

/* 

************************
class Circle 

array[functions]

const distanceFromSemiCircle = (x, y) => {}

const distanceFromLine = (x,y) => {}
************************


const minDistanceBetweenPointAndShape = (x, y) => {
  let min = 10000000;
  for fucntion in circle.arrays();

  return min;
}

const sumMin = (x, y) => {
  for point in Points:
  find the whatever


  assess if it passes heuristic:

  return true or false;
}
*/