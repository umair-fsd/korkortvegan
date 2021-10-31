import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants/theme';

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    mainContainer:{
        flex:1, 
        backgroundColor:COLORS.white
    },
    scroll:{
      flex:3  
    },
    image:{
        alignSelf:'center',
    },
    title:{
        fontSize:20,
        marginBottom:10,
        color: COLORS.black,
        textAlign:'center',
        marginTop:50
    },
    description:{
        color: COLORS.black,
        textAlign:'center',
        paddingHorizontal:30,
        marginTop:20
    }
})

export default styles
