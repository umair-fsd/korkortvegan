import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native'
import { COLORS } from '../../../constants'

const MyButton = ({
    onPress,
    title
}) => {
    return (
        <TouchableOpacity onPress={onPress} 
            style={styles.btnContainer}>
            <Text style={styles.txtTitle}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default MyButton

const styles = StyleSheet.create({
    btnContainer:{
        height:50,
        width:'40%',
        borderRadius:30,
        backgroundColor:COLORS.green,
        marginVertical:15,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        elevation:3,
    },
    txtTitle:{
        fontSize:18,
        color:COLORS.white,
        fontWeight:Platform.OS==='ios' ? '600' : 'bold'
    }
})
