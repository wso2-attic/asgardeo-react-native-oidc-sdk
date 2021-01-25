import React, {useEffect} from 'react';
import { Linking,Button,View,Text} from 'react-native';
import url from 'url';
import {requestAccessToken, getSignOutURL,userInformation,refreshAccessToken,SignOut, getDataLayer} from '../src/authenticate'

const SignIn =({route,navigation}) =>{
    
      useEffect(() => {
           Linking.addEventListener("url", this.handleUrl);   
       }, []);
       
       Linking.openURL(route.params.url)

       handleUrl=async (Authurl)=>{
          let urlObject = url.parse(Authurl.url);
          const data_list =urlObject.query.split('&')
          const code =data_list[0].split('=')[1]
          const session_state =data_list[1].split('=')[1]
          
          

          requestAccessToken(code,session_state,route.params.config).then((token )=>{
            console.log("requestAccesstoken", token);
            const _refreshAccessToken = refreshAccessToken(route.params.config).then(reftoken =>{
                console.log(reftoken)
                
              })

            
          }).catch((error)=>{
            console.log(error)
          });

          const _dataLayer =await getDataLayer()
            console.log("dataLayer",_dataLayer.getSessionData())

          const SignOutURL = await getSignOutURL()
            console.log("SignOutURL",SignOutURL)

          const UserInfo = await userInformation()
            console.log("UserInfo",UserInfo)
          
         // const _refreshAccessToken = await refreshAccessToken(route.params.config)
          //console.log("refreshtoken",_refreshAccessToken)

          const signOut = await SignOut()
          Linking.openURL(signOut)

          console.log("dataLayerFin",_dataLayer.getSessionData())
      };
 
   

   
    

    return null;
};  
        
export default SignIn;
