import React, {useEffect,useState} from 'react';
import {Linking} from 'react-native';
import {Page,Form,FormLabel,FormValue,Heading,ButtonContainer,Button} from '../components'
import {getSignOutURL,userInformation,refreshAccessToken, getDataLayer} from '../src/authenticate'
import {SignInHandleUrl,SignOutHandleUrl} from '../src/handleUrl'

const defaultAuthState = {
  accessToken: '',
  expiresIn:'',
  refreshToken: '',
  idToken:"",
  scope:"",
  haslogin:false
};
const SignIn =({route,navigation}) =>{    

  const [authState, setAuthState] = useState(defaultAuthState);
    console.log(authState)
      if (authState.haslogin==false){
      Linking.openURL(route.params.url)
      }

      useEffect(() => {
        Linking.addEventListener("url", this.handleUrl);   
       }, []);

        handleUrl=async (Authurl)=>{
          SignInHandleUrl(Authurl,route.params.config).then((token )=>{
           
            setAuthState({...token})
        
          }).catch((error)=>{
              console.log(error)
          });


            
          const UserInfo =  await userInformation()
            console.log("UserInfo",UserInfo)

          const _dataLayer =await getDataLayer()
            // console.log("dataLayer",_dataLayer.getSessionData())

          const SignOutURL = await getSignOutURL()
            // console.log("SignOutURL",SignOutURL) 

      }
      
      handleRefreshtoken =async () =>{
        refreshAccessToken(route.params.config).then(reftoken =>{
            setAuthState({...reftoken,haslogin:true})
  
        }).catch((error)=>{
            console.log(error)
        });
      }


      handlesignOut =async ()=>{
        const signOut = await getSignOutURL()
        Linking.openURL(signOut)
      }
      
      useEffect(() => {
        Linking.addEventListener("url", this.handleopenUrl);   
       }, []);

      handleopenUrl=async (Authu)=>{
        _nav = SignOutHandleUrl(Authu)
        
          if (_nav==true){
           
            navigation.navigate("LoginScreen");
          }else{
            authState
          }
        
      }

      return (
          <Page>
          {!!authState.accessToken ? (
             <Form>
             <FormLabel>accessToken</FormLabel>
                <FormValue>{authState.accessToken}</FormValue>
             <FormLabel>accessTokenExpirationDate</FormLabel>
                <FormValue>{authState.expiresIn}</FormValue>
             <FormLabel>refreshToken</FormLabel>
                <FormValue>{authState.refreshToken}</FormValue>
             <FormLabel>scopes</FormLabel>
                <FormValue>{authState.scope}</FormValue>
             <FormLabel>ID token</FormLabel>
                <FormValue>{authState.idToken}</FormValue>
           </Form>
           ) : (
             <Heading>'Goodbye.' : 'Hello, stranger.'</Heading>
           )}
       <ButtonContainer>
        {!!authState.accessToken ? (
          <>
            <Button
              onPress={handlesignOut}
              text="SignOut"
              color="#DA2536"
            />
            
          </>
        ) : null}
        {!!authState.refreshToken ? (
          <Button onPress={handleRefreshtoken} text="Refresh" color="#24C2CB" />
        ) : null}
        
      </ButtonContainer>

       </Page>
         );
                  
 }; 
        
export default SignIn;
