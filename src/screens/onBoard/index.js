import React, {useState, useRef, useEffect} from 'react'
import { View, FlatList, Animated, ScrollView } from 'react-native'
import styles from './styles';
import MyStatusBar from '../../components/myStatusBar';
import data from './dummyData';
import OnBoardItem from './onBoardItem';
import Indicator from './indicator';
import NextButton from './nextButton';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants";

const OnBoardScreen = (props) => {
    const navigation=useNavigation();
    const scrollX=useRef(new Animated.Value(0)).current;
    const [currentIndex, setIndex]=useState(0);
    const slideRef=useRef(null)
    
    useEffect(()=>{
        checkToken()
    },[])

    const checkToken=async()=>{
        let token=await AsyncStorage.getItem("@token");
        if(token!==null){
            navigation.reset({
                routes: [
                { 
                    name: 'PreAuthCheck' },
                ],
            })
        }
    }

    const viewableItemsChanged=useRef(({viewableItems})=>{
        setIndex(viewableItems[0].index);
    }).current;
     
    const scrollTo=()=>{
        if(currentIndex<data.length-1){
            slideRef.current.scrollToIndex({ index: currentIndex+1 })
        }else{
            navigation.reset({
                routes: [
                { 
                    name: 'SignIn' },
                ],
            })
        }
     }
     
    const viewConfig=useRef({viewAreaCoveragePercentThreshold:50}).current; 
    return (
        <View style={styles.mainContainer}>
            <MyStatusBar 
                barStyle = "dark-content" 
                backgroundColor = {COLORS.white} 
            />
            <View style={styles.scroll}>
               <FlatList  
                    data={data}
                    renderItem={({ item })=> <OnBoardItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item)=>item.id}
                    onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollX}}}],{
                        useNativeDriver:false
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slideRef}
                />
            </View>
            <Indicator data={data} scrollX={scrollX} />
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100/data.length)} />
        </View>
    )
}

export default OnBoardScreen
