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
import Foot from '../glyphs/Foot';
import Stool from '../glyphs/Stool';
import Snake from '../glyphs/Snake';
import Owl from '../glyphs/Owl';
import Water from '../glyphs/Water';
import Mouth from '../glyphs/Mouth';
import Courtyard from '../glyphs/Courtyard';
import Wick from '../glyphs/Wick';
import Placenta from '../glyphs/Placenta';
import Belly from '../glyphs/Belly';
import Bolt from '../glyphs/Bolt';
import Cloth from '../glyphs/Cloth';
import Pool from '../glyphs/Pool';
import Hill from '../glyphs/Hill';
import Basket from '../glyphs/Basket';
import Ringstand from '../glyphs/Ringstand';
import TetheringRope from '../glyphs/TetheringRope';
import Hand from '../glyphs/Hand';

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
  const [glyph, setGlyph] = useState(new Hand(length));
  const [paths, setPaths] = useState([[]]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [reveal, setReveal] = useState(true);


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

  const clearPaths = () => {
    // console.log(paths)
    setPaths([[]]);
    setSegmentIndex(0);
  };

  const selectGlyph = (name) => {
    clearPaths();
    switch (name) {
      case 'Bread':
        setGlyph(new T(length));
        break;
      case 'Aleph':
        setGlyph(new Aleph(length));
        break;
      case 'Reed':
        setGlyph(new Reed(length));
        break;
      case 'Arm':
        setGlyph(new Arm(length));
        break;
      case 'Quail':
        setGlyph(new Quail(length));
        break;
      case 'Foot':
        setGlyph(new Foot(length));
        break;
      case 'Stool': 
        setGlyph(new Stool(length));
        break;
      case 'Snake':
        setGlyph(new Snake(length));
        break;
      case 'Owl':
        setGlyph(new Owl(length));
        break;
      case 'Water':
        setGlyph(new Water(length));
        break;
      case 'Mouth':
        setGlyph(new Mouth(length));
        break;
      case 'Courtyard':
        setGlyph(new Courtyard(length));
        break;
      case 'Wick':
          setGlyph(new Wick(length));
          break;
      case 'Placenta':
        setGlyph(new Placenta(length));
        break;
      case 'Belly':
        setGlyph(new Belly(length));
        break;
      case 'Bolt':
        setGlyph(new Bolt(length));
        break;
      case 'Cloth':
        setGlyph(new Cloth(length));
        break;
      case 'Pool':
        setGlyph(new Pool(length));
        break;
      case 'Hill':
        setGlyph(new Hill(length));
        break;
      case 'Basket':
        setGlyph(new Basket(length));
        break;
      case 'Ringstand':
        setGlyph(new Ringstand(length));
        break;
      case 'TetheringRope':
        setGlyph(new TetheringRope(length));
        break;
      case 'Hand':
        setGlyph(new Hand(length));
        break;
      default: 
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
        <Button title="Arm (')" onPress={() => selectGlyph('Arm')}></Button>
        {/* <Button title="Aleph" onPress={() => selectGlyph('Aleph')}></Button> */}
        {/* <Button title="Bread (T)" onPress={() => selectGlyph('Bread')}></Button> */}
        <Button title="Reed (M)" onPress={() => selectGlyph('Reed')}></Button>
        <Button title="Quail (W)" onPress={() => selectGlyph('Quail')}></Button>
        <Button title="Foot (b)" onPress={() => selectGlyph('Foot')}></Button>
        <Button title="Stool (p)" onPress={() => selectGlyph('Stool')}></Button>
        {/* <Button title="Snake (f)" onPress={() => selectGlyph('Snake')}></Button>
        <Button title="Owl (m)" onPress={() => selectGlyph('Owl')}></Button>
        <Button title="Water (n)" onPress={() => selectGlyph('Water')}></Button>
        <Button title="Mouth (r)" onPress={() => selectGlyph('Mouth')}></Button>
        <Button title="Courtyard (h)" onPress={() => selectGlyph('Courtyard')}></Button>
        <Button title="Wick" onPress={() => selectGlyph('Wick')}></Button>
        <Button title="Placenta" onPress={() => selectGlyph('Placenta')}></Button>
         */}
        {/* <Button title="Belly" onPress={() => selectGlyph('Belly')}></Button> */}
        {/* <Button title="Bolt" onPress={() => selectGlyph('Bolt')}></Button> */}
        {/* <Button title="Cloth" onPress={() => selectGlyph('Cloth')}></Button> */}
        {/* <Button title="Pool" onPress={() => selectGlyph('Pool')}></Button> */}
        {/* <Button title="Hill" onPress={() => selectGlyph('Hill')}></Button> */}
        {/* <Button title="Basket" onPress={() => selectGlyph('Basket')}></Button> */}
        {/* <Button title="Ringstand" onPress={() => selectGlyph('Ringstand')}></Button> */}
        {/* <Button title="Tethering Rope" onPress={() => selectGlyph('TetheringRope')}></Button> */}
        <Button title="Hand" onPress={() => selectGlyph('Hand')}></Button>








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
    display: "flex",
    flexDirection: "row",
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