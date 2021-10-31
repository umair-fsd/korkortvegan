import * as React from 'react';
import {StyleSheet, Platform, View} from 'react-native';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const  MyStatusBar=(props)=> {
  const isFocused = useIsFocused();

  return isFocused ? 
    Platform.OS==='ios' ?
      <View style={styles.statusbar}>
        <StatusBar {...props} /> 
      </View>
    :  
    <StatusBar {...props} /> 
    : 
    null;
}
export default MyStatusBar;

const styles=StyleSheet.create({
  statusbar:{
  }
})