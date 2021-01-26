import "text-encoding-polyfill"
import React from 'react';
import {StyleSheet,View,Image, Text,Button} from 'react-native';
import {initialize,getAuthorizationURL} from '../src/authenticate'


class LoginScreen extends React.Component {

  handleSubmitPress = () => {
    
    const Config ={
      serverOrigin:"https://10.0.2.2:9443",
      signInRedirectURL:"http://10.0.2.2:8081/Screen/LoginScreen",
      clientID: "iMc7TiIaIFafkd5hA5xf7kGiAWUa",
      SignOutURL: "http://10.0.2.2:8081"
    };


    initialize(Config)
      //console.log("init",initialize(Config))

    getAuthorizationURL(Config).then((url) => {

        this.props.navigation.navigate("SignIn",{url:url,config:Config})
    })
    .catch((error) => {
        console.error(error);
    });
    
    }
  
    render(){
    return (
      <View style={styles.mainBody}>
        <View>
            <View>
                <Text style={styles.text}>Sample App</Text>
              </View>
            <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../assets/login.jpg')}
                  style={{
                    width: '60%',
                    height: '65%',
                    resizeMode: 'contain',
                    borderRadius:30
                    
                  }}
                />
                <Text>
                  Mobile 
                </Text>
                <Text>
                  Authantication With WSO2 IS 
                </Text>
              </View>
            
              <View style={[{width:"30%"},{marginLeft:"35%"},{marginBottom:10}]}>
              <Button color='#FF5F1F' onPress={this.handleSubmitPress} title="Login"/>
              
              </View>
              <View style={styles.footer}>
              <Text></Text>
              <Text > {'\u00A9'}  WSO2 @ Asgardeo</Text>
              </View>
          </View>
        
      </View>
    );
};}
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0000',
    borderColor:'orange',
    alignContent: 'center',
    
  },
  text:{
    
    color:'#FF5F1F',
    fontWeight:'bold' ,
    textAlign:'center',
    fontSize:30,
    
   
    
  },
  footer:{
    alignItems:'center',
    
    
  }


});