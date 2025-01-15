import React, { Component, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';


export default Menu = ({ navigation }) => {
  return (
    <>
      <Button onPress={() => navigation.navigate('Home')
        }
        title="Home"
        >
          
      </Button>
      <Button onPress={() => navigation.navigate('SketchPad')
        }
        title="SketchPad"
        >
      </Button>
      <Button onPress={() => navigation.navigate('Glyphs')
        }
        title="Glyphs"
        >
      </Button>
    </>
  )


}