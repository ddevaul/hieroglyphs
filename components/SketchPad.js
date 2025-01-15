import React, { Component, useState, useRef, useCallback} from 'react';
import {
  Dimensions, 
  PanResponder,
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Svg, { Polyline, Line, Circle, Path, G } from 'react-native-svg';

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
      <Line x1={(length / 4).toString()} y1="0" x2={(length / 4).toString()} y2={length} stroke="gray" strokeDasharray={[8]}/>
      <Line x1={(length / 2).toString()} y1="0" x2={(length / 2).toString()} y2={length} stroke="gray" strokeDasharray={[8]}/>
      <Line x1={(length / 2 + length / 4).toString()} y1="0" x2={(length / 2 + length / 4).toString()} y2={length} stroke="gray" strokeDasharray={[8]}/>
      <Line x1="0" y1={(length / 4).toString()} x2={length} y2={(length / 4).toString()} stroke="gray" strokeDasharray={[8]}/>
      <Line x1="0" y1={(length / 2).toString()} x2={length} y2={(length / 2).toString()} stroke="gray" strokeDasharray={[8]}/>
      <Line x1="0" y1={(length / 2 + length / 4).toString()} x2={length} y2={(length / 2 + length/ 4).toString()} stroke="gray" strokeDasharray={[8]}/>
      {glyph.shape('gray', segmentIndex, reveal)}
      

                        {/* 30 50 0 0 1 162.55 162.45 */}
      {/* <Polyline strokeWidth="5"  fill="none" stroke={color} points={}></Polyline> */}

        {points.map((p, idx) => {
          return (
          <Polyline
            key={idx} 
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

export default SketchPad = ({glyphs, setCompleted, setShuffle}) => {
  const SCALE_FACTOR = 0.95;
  const { width, height } = Dimensions.get('window');
  const length = width * SCALE_FACTOR;
  // const [glyph, setGlyph] = useState(new Cobra(length));
  const [paths, setPaths] = useState([[]]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [currentGlyphIndex, setCurrentGlyphIndex] = useState(0);
  const [glyph, setGlyph] = useState(new glyphs[currentGlyphIndex](length));
  const [showCompleted, setShowCompleted] = useState(false);

  const clearPaths = () => {
    // console.log(paths)
    setPaths([[]]);
    setSegmentIndex(0);
  };

  const nextGlyph = () => {
    if (currentGlyphIndex === glyphs.length - 1) {
      setCompleted(true);
      clearPaths();
    } else{
      setGlyph(new glyphs[currentGlyphIndex+1](length))
      setCurrentGlyphIndex(e => e+1);
      clearPaths();
    }
  }

  const showMessage = () => {
    setTimeout(() => {
      // Hide the component
      setShowCompleted(false);
      nextGlyph();
    }, 2000); // Adjust the time as needed
  }

  const updatePath = (coords, finished) => {
    if (finished) {
      const newPaths = [...paths];
      newPaths[newPaths.length - 1].push(coords);
      let finishedSegmentCoords = newPaths[newPaths.length - 1];
      // console.log(segmentIndex, newPaths[0].length);
      let inBounds = glyph.inBounds(finishedSegmentCoords, segmentIndex);
      if (inBounds) {
        if (segmentIndex + 1 === glyph.numSegments) {
          setShowCompleted(true);
          showMessage();
          setSegmentIndex(si => si + 1);
        } else {
          setSegmentIndex(si => si + 1);
        }
      }
      setPaths(ppaths => {
        const newPaths = [...ppaths];
        newPaths.push([])
        // return newPaths; // uncomment for testing
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


  return (
    <View style={styles.container}>
      {showCompleted && <Text style={styles.bigText}>Good job!!!</Text>}
      <View><Text style={styles.bigText}>{glyph.name}</Text></View>
       <View style={styles.canvas}>
        <GesturePath length={length} paths={paths} color="black" glyph={glyph} segmentIndex={segmentIndex} reveal={reveal}/>
        <GestureRecorder paths={paths} onPathChanged={updatePath} segmentIndex={segmentIndex} />
      </View>
      <View style={styles.footer}>
        <Button title="Reveal" onPress={() => setReveal(r => !r)}></Button>
        <Button onPress={() => nextGlyph()} title="Move On"></Button>
        {/* <Button onPress={() => setShuffle()} title="Shuffle"></Button> */}

      </View>
      {/* <View style={styles.footer}>
        {/* <Button title="Length" onPress={() => console.log(paths.length)}></Button> */}
        {/* <Button title="Clear" onPress={clearPaths}></Button> */}

        {/* <Button title="Paths" style={styles.button} onPress={() => console.log(paths)}></Button> */}
        {/* <Button title="test" onPress={() => distanceBetweenSemicircle(95, 250)}></Button> */}
      {/* </View>  */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', alignItems: 'center',
    height: "100%", width: "100%", display: 'flex', justifyContent: 'space-between',
    paddingBottom: "5%",
  },
  canvas: {
    // backgroundColor: "orange",
    borderWidth: 5,
    borderColor: 'black'
  },
  footer: {
    // backgroundColor: "red", 
    display: "flex",
    flexDirection: "row",
    marginBottom: "40%",
  },
  button: {
    paddingBottom: "5px",
  },
  bigText: {
    fontSize: 20,
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