import React, { Component, useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import Svg, { Polyline, Line, Circle, Path, G } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import Cobra from '../glyphs/Cobra';
import SketchPad from './SketchPad';

const shuffle = (arr) => {
  let j, x, index;
  for (index = arr.length - 1; index > 0; index--) {
      j = Math.floor(Math.random() * (index + 1));
      x = arr[index];
      arr[index] = arr[j];
      arr[j] = x;
  }
  return arr;
}

const storeData = async (favs, value, setFavorites) => {
  if (!favs.includes(value)){
    let jsonFavs = JSON.stringify([...favs, value])
    setFavorites(f => {
      return [...f, value]
    });
    await AsyncStorage.setItem('favorites', jsonFavs);
  }
};

const unFavorite = async (favs, value, setFavorites) => {
  if (favs.includes(value)){
    console.log("here1")
    const filtered = favs.filter(fav => fav !== value);
    let jsonFavs = JSON.stringify(filtered)
    setFavorites(f => {
      let filtered = f.filter(f => f !== value);
      return filtered
    });
    await AsyncStorage.setItem('favorites', jsonFavs);
  }
};


const clearData = async () => {
  // console.log(favs);
  setFavorites([]);
  try {
  await AsyncStorage.clear();
  } catch(e){
    console.log(e);
  }
  console.log("done");
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('favorites');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

const GesturePath = ({ length, glyph }) => {
  glyph = new glyph(length);
  // if (paths[0] == []) {
  //   return <View></View>
  // }
  // let points = []
  // paths.forEach(path => {
  //   tempPoints = path.map(p => `${p.x},${p.y}`).join(' ');
  //   points.push(tempPoints)
  // })
  return (
    // viewBox={`0 0 ${width} ${height * 0.85}`}
    <Svg height={length} width={length}>
      {/* grid lines */}
      {/* <Line x1={(length / 4).toString()} y1="0" x2={(length / 4).toString()} y2={length} stroke="#027aba" strokeDasharray={[8]}/> */}
      {/* <Line x1={(length / 2).toString()} y1="0" x2={(length / 2).toString()} y2={length} stroke="#027aba" strokeDasharray={[8]}/> */}
      {/* <Line x1={(length / 2 + length / 4).toString()} y1="0" x2={(length / 2 + length / 4).toString()} y2={length} stroke="#027aba" strokeDasharray={[8]}/> */}
      {/* <Line x1="0" y1={(length / 4).toString()} x2={length} y2={(length / 4).toString()} stroke="#027aba" strokeDasharray={[8]}/> */}
      {/* <Line x1="0" y1={(length / 2).toString()} x2={length} y2={(length / 2).toString()} stroke="#027aba" strokeDasharray={[8]}/> */}
      {/* <Line x1="0" y1={(length / 2 + length / 4).toString()} x2={length} y2={(length / 2 + length/ 4).toString()} stroke="#027aba" strokeDasharray={[8]}/> */}
      {glyph.shape('gray', (glyph.numSegments), false)}
      
        {/* {points.map(p => {
          return (
          <Polyline
            points={p}
            fill="none"
            stroke={color}
            strokeWidth="5"
          />  
          )
        })} */}
    </Svg>    
  );
};

export default Glyphs = ({navigation}) => {
  const SCALE_FACTOR = 0.95;
  const { width, height } = Dimensions.get('window');
  const length = width * SCALE_FACTOR;
  const [screen, setScreen] = useState('browse');
  const [glyphs, setGlyphs] = useState([T, Aleph, Reed, Arm, Quail, Foot, Stool, Snake, Owl, Water, Mouth, Courtyard, Wick, Placenta, Belly, Bolt, Cloth, Pool, Hill, Basket, Ringstand, TetheringRope, Hand, Cobra]);
  const [completed, setCompleted] = useState(false);
  const [shuffledGlyphs, setShuffledGlyphs] = useState([T, Aleph, Reed, Arm, Quail, Foot, Stool, Snake, Owl, Water, Mouth, Courtyard, Wick, Placenta, Belly, Bolt, Cloth, Pool, Hill, Basket, Ringstand, TetheringRope, Hand, Cobra]);
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    (async () => {
      const response = await getData();
      if (response.length > 0){
        setFavorites(response);
        console.log(response);
      }
    }
    )()
    // console.log(response)
  }, []);


    return (
      <View>
           {/* <SafeAreaView style={styles.scrollContainer}> */}
            <ScrollView style={styles.scrollView}>
              {glyphs.map(glyph => {
                return (
                  <View key={glyph.name} style={styles.canvas}>
                    <Text style={styles.textStyle}>{glyph.name}</Text>
                    {/* {favorites && favorites.includes(glyph.name) && <Text>favorite</Text>} */}
                    <GesturePath length={length} glyph={glyph} favorites={favorites} setFavorites={setFavorites}></GesturePath>
                    <View style={(favorites && favorites.includes(glyph.name)) ? styles.goldText : null}>
                      {(favorites && favorites.includes(glyph.name)) ? <Button style={styles.goldText} title="Favorite" onPress={() => unFavorite(favorites, glyph.name, setFavorites)}></Button>: <Button title="Favorite" onPress={() => storeData(favorites, glyph.name, setFavorites)}></Button>}
                    </View>
                 </View>
                )
              })}
            </ScrollView>
          {/* </SafeAreaView> */}
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
    // margin: "5%",
    // padding: "5%",
    // border: "2% solid black",
    borderWidth: 5,
    margin: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },
  footer: {
    backgroundColor: "red", 
    display: "flex",
    flexDirection: "row",
  },
  button: {
    paddingBottom: "5px",
  },
  scrollContainer: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  textStyle: {
    fontSize: 20,
  },
  goldText: {
    backgroundColor: "#FFD700",
    borderWidth: 5,
    borderColor: "#FFD700",
    borderBlockColor: "#FFD700"
  },
});

