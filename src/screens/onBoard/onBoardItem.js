import React from 'react'
import { View, Text, Image, useWindowDimensions, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/theme';

const OnBoardItem = ({ item }) => {    
    const { width, height } = useWindowDimensions();
    
    return (
        <View style={{height, width}}>
            <View style={{height: height/2.5,}}>
                <Image 
                    source={item.image}
                    style={[styles.image, {resizeMode: 'contain'}]}
                />
            </View>
            <View style={{height: height/3, marginVertical:40}}>
                <Text style={styles.title}>
                    {item.title}
                </Text>
                <Text style={styles.description}>
                    {item.description}
                </Text>
            </View>
        </View>
    )
}

export default OnBoardItem

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    image:{
        alignSelf:'center',
        height:'100%',
    },
    title:{
        fontSize:20,
        color: COLORS.black,
        textAlign:'center',
    },
    description:{
        color: COLORS.black,
        textAlign:'center',
        paddingHorizontal:30,
    }
})