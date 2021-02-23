/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import "text-encoding-polyfill"
import React from 'react';
import {StyleSheet,View,Image, Text,Button,Linking} from 'react-native';
import {initialize,getAuthorizationURL} from '@asgardeo/auth-react-native'


class LoginScreen extends React.Component {

  handleSubmitPress = async () => {
    // Create a config object containing the necessary configurations.
     const Config ={
       serverOrigin:"https://10.0.2.2:9443",
       signInRedirectURL:"http://10.0.2.2:8081",
       clientID: "iMc7TiIaIFafkd5hA5xf7kGiAWUa",
       //SignOutURL: "http://10.0.2.2:8081"
     };

   // for device
    //  const Config ={
    //    serverOrigin:"https://192.168.43.29:9443",
    //    signInRedirectURL:"http://192.168.43.29:8081",
    //    clientID: "M1eM7_pf45m0fKJkfCDUTI6Demca",
    //    SignOutURL: "http://192.168.43.29:8081"
    //  };


    // initializes the SDK with the config data
    await initialize(Config) 

     //const _dataLayer = await getDataLayer()
     // console.log("dataLayer",_dataLayer)

    // authenticate with Identity server
    getAuthorizationURL(Config).then((url) => {

        this.props.navigation.navigate("SignIn",{url:url})
    })
    .catch((error) => {
        console.error(error);
    });

    }
  
    render(){
    return (
      <View style={styles.mainBody}>
        <View>
          <View style={styles.container}>
            <View>
                <Text style={styles.text}>React Native Authentication Sample</Text>
              </View>
                <View style={{alignItems: 'center'}}>
                <Image
                  source={require('../assets/login.jpg')}
                  style={styles.image}
                />
                <Text style={styles.textpara}>
                  Sample demo to showcase authentication for a React Native via the OpenID Connect Authorization Code flow, which is integrated using the <Text style={styles.TextStyle} onPress={ ()=> Linking.openURL('https://github.com/asgardeo/asgardeo-react-native-oidc-sdk') } >Asgardeo Auth React Native SDK</Text>.
                </Text>
              </View>
            
              <View style={styles.button}>
              <Button color='#282c34' onPress={this.handleSubmitPress} title="Login"/>
              
              </View>
              </View>
              <View style={styles.footer}>
              <Text></Text>
               <Image
                  source={require('../assets/footer.png')}
                  style={{width: 50, height:20,paddingTop:0}}
                />
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
    alignContent: 'center',
    paddingLeft:20,
    paddingRight:20,

  },
  container:{
    borderColor:"#e2e2e2",
    borderWidth:2,
    borderRadius:10
  },
  image:{ 
    width: '85%',
    height: '60%',
    resizeMode: 'contain',
    borderRadius:30
  },
  button:{
    width:"30%",
    marginLeft:"35%"
  },
  text:{
    backgroundColor:"#f47421",
    color:'white' ,
    textAlign:'center',
    justifyContent:"center",
    fontSize:25,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    borderBottomColor:"#e2e2e2",
    borderBottomWidth:2
   
    
  },
  textpara:{

    textAlign:"center",
    color:"#2A2A2A",
    fontSize:17,
    paddingLeft:20,
    paddingRight:20,
    borderBottomColor:"#282c34",
  },
  TextStyle:{
    color:"blue",
    textDecorationLine:"underline"
  },
  footer:{
    alignItems:'center',
    
    
  }


});