import React, {useEffect,useState} from 'react';
import {Linking,Alert} from 'react-native';
import {Page,Form,FormLabel,FormValue,Heading,ButtonContainer,Button} from '../components'
import {isAuthenticated,getSignOutURL,userInformation,refreshAccessToken,getAccessToken,requestAccessTokenDetails,SignOut, getOIDCServiceEndpoints,getDecodedIDToken,revokeAccessToken}from '../src/authenticate'


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
   
      if (authState.haslogin==false){
      Linking.openURL(route.params.url)
      }

      useEffect(() => {
        
        Linking.addEventListener("url", handleUrl);   
       }, []);
       let unmounded= false;
        handleUrl=async (Authurl)=>{
          
         
         if (!unmounded){
          requestAccessTokenDetails(Authurl,route.params.config).then((token )=>{ // get param of authorization url and return token details
            console.log("ReAccessToken", token)
            setAuthState({...token})
        
          }).catch((error)=>{
              console.log(error)
          });
         
          unmounded = true;
      }

      

    const endpoints = await getOIDCServiceEndpoints();
    //console.log("endpoints", endpoints)
    const decodedIdToken = await getDecodedIDToken();
    //console.log("decodedIdToken", decodedIdToken)
    const accessToken = await getAccessToken();
    //console.log("accesstoken", accessToken)
    console.log(await isAuthenticated())
    
    }
      
      handleRefreshtoken =async () =>{
        refreshAccessToken(route.params.config).then(reftoken =>{
            setAuthState({...reftoken,haslogin:true})
  
        }).catch((error)=>{
            console.log(error)
        });
      }


      handlesignOut =async ()=>{
        const signOutUrl = await getSignOutURL()
        console.log("signOutUrl",signOutUrl)
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

      UserInfoAlert = async() =>{
        const UserInfo =  await userInformation()
        Alert.alert(
          'User Info',
          "User Name : "+ UserInfo.username+"\n"+"User Email : "+ UserInfo.email,
          
          console.log("User Name :",UserInfo),
          // revokeAccessToken(route.params.config).then((response)=>{
          //    console.log("revokeAccess",response);
          //  }).catch((error)=>{
          //     console.error(error);
          // })
          
        );
            
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
            <Button  onPress={handlesignOut} text="SignOut"  color="#FF8000"   />
            
          </>
        ) : null}

        {!!authState.refreshToken ? (
          <Button onPress={UserInfoAlert} text="UserInfo" color="#000066" />
        ) : null}

        {!!authState.refreshToken ? (
          <Button onPress={handleRefreshtoken} text="Refresh" color="#FF3333" />
        ) : null}

        
        
      </ButtonContainer>

       </Page>
         );
                  
 }; 
        
export default SignIn;
