    
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import {
    FontAwesome5,
  } from "@expo/vector-icons";
import {COLORS} from '../constants/theme';

const AppHeader = ({title, onPress}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
                    <FontAwesome5 
                        name="chevron-left"
                        color={COLORS.black}
                        size={20}
                    />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    {title}
                </Text>
            </View>
        </View>
    )
}

export default AppHeader

const styles = StyleSheet.create({
    container:{
        height:Platform.OS==='ios' ? 81 : 71,
        width:'100%',
        paddingHorizontal:20,
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        elevation:3,
        backgroundColor:COLORS.white,
        paddingTop:Platform.OS==='ios' ? 20 : 10,
    },
    titleContainer:{
        flex:1,
        alignItems:'center',
    },
    title:{
        fontSize:18,
        fontWeight:Platform.OS==='ios' ? '700' : 'bold'
    }
})
