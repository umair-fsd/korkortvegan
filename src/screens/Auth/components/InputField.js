import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import {COLORS} from '../../../constants/theme';

const InputField = ({
    placeholder,
    placeholderTextColor,
    style, 
    value, 
    inputContainer, 
    onChangeText,
    secureTextEntry,
    autoCapitalize,
    keyboardType
}) => {
    return (
        <View style={[styles.input, style]}>
            <TextInput 
                autoCapitalize={'none'}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                style={[styles.textStyle, inputContainer]} 
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}

export default InputField

const styles = StyleSheet.create({
    input:{
        height:45,
        width:'90%',
        borderRadius:30,
        alignSelf:'center',
        alignItems: 'center',
        justifyContent:'center',
        paddingHorizontal: 12,
        backgroundColor:COLORS.white,
        marginVertical:15,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        elevation:3,
    },
    textStyle:{
        color: COLORS.black,
        width:"100%",
        fontSize:18
    }
})
