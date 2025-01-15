import React, { Component, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';
import Menu from './Menu';

export default HomePage = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.bigText}> Welcome!
      </Text>
      <Text style={styles.bigText}>This app was developed by Desi DeVaul with support from 
        Tom Hare to help students practice their hieroglyphics. 
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100vh", 
    width: "100vw", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    flex: 1,
  },
  bigText: {
    fontSize: 20,
    marginBottom: 20
  }
});

