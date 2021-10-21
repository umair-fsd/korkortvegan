import React,{useEffect, useRef} from 'react'
import { StyleSheet, Image, TouchableOpacity, View, Animated } from 'react-native';
import Svg,{ Circle } from 'react-native-svg';
import { forwardArrow } from '../../constants/icons';

const NextButton = ({ percentage, scrollTo }) => {
    const size=120;
    const strokeWidth=2;
    const center=size/2;
    const radius=size/2 - strokeWidth/2;
    const circumference=2*Math.PI*radius;
    
    const progressAnimation=useRef(new Animated.Value(0)).current;
    const progressRef=useRef(null);
    
    const animation=(toValue)=>{
        return Animated.timing(progressAnimation,{
            toValue,
            duratin:250,
            useNativeDriver:true
        }).start()
    }
    
    useEffect(()=>{
        animation(percentage);
    },[percentage])
    
    useEffect(()=>{
        progressAnimation.addListener((value)=>{
            const strokeDashoffset=circumference-(circumference*value.value)/100;
            if(progressRef?.current){
                progressRef.current.setNativeProps({
                    strokeDashoffset,
                })
            }   
        },[percentage])
        return () =>{
            progressAnimation.removeAllListeners()
        }
    },[])
    
    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <Circle 
                    stroke="#E5E5E5" 
                    cx={center} 
                    cy={center} 
                    r={radius} 
                    strokeWidth={strokeWidth} 
                />
                <Circle 
                    ref={progressRef}
                    stroke={"#00B761"}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                  />
            </Svg>
            <TouchableOpacity 
                onPress={scrollTo}
                style={styles.button} activeOpacity={0.5}>
                <Image source={forwardArrow} />
            </TouchableOpacity>
        </View>
    )
}

export default NextButton

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        elevation:5,
    },
    button:{
        position:'absolute',
        backgroundColor:'#ffffff',
        borderRadius:100,
        padding:20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        elevation:5,
    }
})
