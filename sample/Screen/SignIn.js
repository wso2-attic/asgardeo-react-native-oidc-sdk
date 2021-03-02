import React, {useEffect,useState} from 'react';
import {Linking,Text,View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {ButtonContainer,Button} from '../components'
import {SignOut,getSignOutURL,refreshAccessToken, getDecodedIDToken}from '@asgardeo/auth-react-native'


const defaultAuthState = {
  refreshToken: '',
  idToken:"",
  haslogin:false
};
const decodeID={
  amr:"",
  at_hash: "",
  aud: "", 
  azp: "",
  c_hash: "", 
  exp: "", 
  iat:"" ,
  iss: "", 
  nbf: "", 
  sub: ""
};

const SignIn = ({route,navigation}) =>{    
  const [authState, setAuthState] = useState(defaultAuthState);
  const [authID, setAuthID] = useState(decodeID);

      handleRefreshtoken =async () =>{                                 // refreshtoken
        refreshAccessToken().then(reftoken =>{ 
            setAuthState({...reftoken,haslogin:true})
            
        }).catch((error)=>{
            console.log(error)
        });
        var decodeID=await getDecodedIDToken();
        setAuthID({...decodeID,c_hash:route.params.token.c_hash})
      }


      handleSignOut = async ()=>{                                      // signout
        const signOutUrl = await getSignOutURL()
        Linking.openURL(signOutUrl)
        }
      
        useEffect(() => {
          Linking.addEventListener("url", handleopenUrl);   
        }, []);

        handleopenUrl=async (Url)=>{
          _signOut = SignOut(Url)
          
            if (_signOut==true){
            
              navigation.navigate("LoginScreen");
            }else{
              authState
            }
            unmounded = true;
          
      }

      return (
          <View style={{flex:1, flexDirection: 'column',paddingTop: 10,paddingHorizontal: 10,paddingBottom: 70,borderColor:"#e2e2e2",borderWidth:5,borderRadius:10}}>
          <View style={{backgroundColor:"#90bcef",borderColor:"#e2e2e2",borderWidth:2,borderRadius:10}}>
                {!!route.params.token.sessionState ? (
                <View>
                  <Text style={{fontWeight:"bold",marginTop: 10,textAlign:"center"}}>Hi {route.params.token.username} !</Text>
                  <Text style={{fontWeight:"bold",marginLeft:10}}>AllowedScopes : {route.params.token.allowedScopes}</Text>
                  <Text style={{fontWeight:"bold",marginLeft:10}}>SessionState : </Text>
                  <Text style={{marginLeft:10}}>{route.params.token.sessionState}</Text>
                </View>
                
                ) : null}
          </View>
         
          <View style={{backgroundColor:"#5e9ee7",borderColor:"#e2e2e2",borderWidth:2,borderRadius:10}}>
                {!!authState.refreshToken ? (
                        <View>
                          <Text style={{fontWeight:"bold",marginTop: 10,textAlign:"center"}}>Refresh token</Text>
                            <Text style={{textAlign:"center"}}>{authState.refreshToken}</Text>
                        </View>
                
                ) : <>
                <View>
                <Text style={{fontWeight:"bold",marginTop: 10,textAlign:"center"}}>Refresh token</Text>
                <Text style={{textAlign:"center"}}> {route.params.token.refreshToken}</Text>
                </View>
                </>}
          </View>

          <View style={{backgroundColor:"#2c7fe0",borderColor:"#e2e2e2",borderWidth:2,borderRadius:10}}>
                {!!authState.idToken ? (
                        <View>
                            <Text style={{fontWeight:"bold",textAlign:"center",marginTop:10}}>Decoded ID token</Text>
                            <Text style={{margin:10}}>amr : {authID.amr},{"\n"}at_hash : {authID.at_hash},{"\n"}aud: {authID.aud},{"\n"}azp : {authID.azp},{"\n"}c_hash : {authID.c_hash},{"\n"}exp : {authID.exp},{"\n"}iat : {authID.iat},{"\n"}iss : {authID.iss},{"\n"}nbf : {authID.nbf},{"\n"}sub : {authID.sub}</Text>
                        </View>
                          
                
                ) : 
                <>
                <View>
                  <Text style={{fontWeight:"bold",textAlign:"center",marginTop:10}}>Decoded ID token</Text>
                  <Text style={{margin:10}}>amr : {route.params.token.amr},{"\n"}at_hash : {route.params.token.at_hash},{"\n"}aud: {route.params.token.aud},{"\n"}azp : {route.params.token.azp},{"\n"}c_hash : {route.params.token.c_hash},{"\n"}exp : {route.params.token.exp},{"\n"}iat : {route.params.token.iat},{"\n"}iss : {route.params.token.iss},{"\n"}nbf : {route.params.token.nbf},{"\n"}sub : {route.params.token.sub}</Text>
                </View>

                </>
                }
          </View>
          
          <ScrollView >
          <View style={{backgroundColor:"#1e73d5",borderColor:"#e2e2e2",borderWidth:2,borderRadius:10}}>
            
                {!!authState.idToken ? (
                  
                        <View >
                          
                          <Text style={{fontWeight:"bold",marginTop: 10,textAlign:"center"}}>ID token</Text>
                            <Text style={{margin:10}}>{authState.idToken}</Text>
                            
                        </View>
                  
                ) :<>
                <View>
                <Text style={{fontWeight:"bold",marginTop: 10,textAlign:"center"}}>ID token</Text>
                <Text style={{margin:10}}>{route.params.token.idToken}</Text>
                </View>
                </>}
            
          </View>
          </ScrollView>
       <ButtonContainer>
        {!!route.params.token.sessionState ? (
          <>
            <Button  onPress={handleSignOut} text="SignOut"  color="#FF8000"   />
            
          </>
        ) : null}

        {!!route.params.token.sessionState ? (
          <Button onPress={handleRefreshtoken} text="Refresh" color="#FF3333" />
        ) : null}

        
        
      </ButtonContainer>

       </View>
         );
                  
 }; 
        
export default SignIn;
