import React from 'react'
import { StyleSheet, Animated, View, useWindowDimensions } from 'react-native'

const Indicator = ({ data, scrollX }) => {
    const { width }=useWindowDimensions()
    return (
        <View style={styles.row}>
            {
                data.map((_,i)=>{
                    const inputRange=[(i-1)*width, i*width, (i+1)*width];
                    const dotWidth=scrollX.interpolate({
                        inputRange,
                        outputRange:[10, 20, 10],
                        extrapolate:'clamp'
                    })
                    return <Animated.View 
                                style={[styles.dot, { width: dotWidth}]} 
                                key={i.toString()} 
                            />
                })
            }
        </View>
    )
}

export default Indicator

const styles = StyleSheet.create({
    row:{
        flexDirection:'row',
        height:64,
        alignSelf:'center'

    },
    dot:{
        height:10,
        borderRadius:5,
        backgroundColor:'#00B761',
        alignSelf:'center',
        marginHorizontal:10
    }
})
