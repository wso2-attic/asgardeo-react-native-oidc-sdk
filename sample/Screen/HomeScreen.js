/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com).
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

import {
  SignOut,
  getSignOutURL,
  refreshAccessToken,
  getDecodedIDToken,
} from '@asgardeo/auth-react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Linking, Text, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import url from 'url';
import { ButtonContainer, Button } from '../components';
import { styles } from '../components/styles';
import { LoginContext, initialState } from '../context/LoginContext';

const HomeScreen = (props) => {

  const loginContext = useContext(LoginContext);
  [loading, setLoading] = useState(false);

  /**
   * This hook will registers the url listener.
   */
  useEffect(() => {
    Linking.addEventListener('url', handleopenUrl);
    return () => {
      Linking.removeEventListener('url', handleopenUrl);
    }
  }, []);

  /**
   * This function will handle the refresh button click.
   */
  const handleRefreshtoken = async () => {

    setLoading(true);

    refreshAccessToken()
      .then((reftoken) => {
        getDecodedIDToken().then((decodeID) => {
          loginContext.setLoginState({ ...loginContext.loginState, ...reftoken, ...decodeID });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  /**
   * This function will handle the sign out button click.
   */
  const handleSignOut = async () => {

    const signOutUrl = await getSignOutURL();
    Linking.openURL(signOutUrl);
  };

  /**
   * This function will listen for browser redirections and proceed with the signout.
   * 
   * @param {*} Url - Redirect url object.
   */
  const handleopenUrl = async (Url) => {

    if (url.parse(Url.url).query.indexOf("state=sign_out") > -1) {
      setLoading(true);
      const _signOut = SignOut(Url);

      if (_signOut === true) {
        loginContext.setLoginState(initialState)
        setLoading(false);
        props.navigation.navigate('LoginScreen');
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <View style = { styles.flexContainer }>
      <View style = { styles.flex }>
        <View>
          <Text style = { styles.flexheading }>
            Hi { loginContext.loginState.username } !
          </Text>
          <Text style = { styles.flexbody }>
            AllowedScopes : { loginContext.loginState.allowedScopes }
          </Text>
          <Text style = { styles.flexbody }>SessionState : </Text>
          <Text style = { styles.flexdetails }>
            { loginContext.loginState.sessionState }
          </Text>
        </View>
      </View>

      <View style = { styles.flex }>
        <View>
          <Text style = { styles.flexheading }>Refresh token</Text>
          <Text style = { styles.reftoke }>{ loginContext.loginState.refreshToken }</Text>
        </View>
        <View>
          <Text style = { styles.flexheading }>Access token</Text>
          <Text style = { styles.reftoke }>{ loginContext.loginState.accessToken }</Text>
        </View>
      </View>

      <View style = { styles.flex }>
        <View>
          <Text style = { styles.flexheading }>Decoded ID token</Text>
          <Text style = { styles.body }>amr : { loginContext.loginState.amr }, { '\n' }at_hash : 
            { loginContext.loginState.at_hash }, { '\n' }aud: { loginContext.loginState.aud }, {'\n'}azp : 
            { loginContext.loginState.azp }, {'\n'}c_hash : { loginContext.loginState.c_hash }, {'\n'}exp : 
            { loginContext.loginState.exp }, {'\n'}iat : { loginContext.loginState.iat }, {'\n'}iss : 
            { loginContext.loginState.iss }, {'\n'}nbf :  {loginContext.loginState.nbf }, {'\n'}sub : 
            { loginContext.loginState.sub }</Text>
        </View>
      </View>

      <ScrollView>
        <View style = { styles.flex }>
          <View>
            <Text style = { styles.flexheading }>ID token</Text>
            <Text style = { styles.body }>{ loginContext.loginState.idToken }</Text>
          </View>
        </View>
      </ScrollView>

      {
        loading ? 
        <View style={ styles.loading } pointerEvents="none">
          <ActivityIndicator size="large" color="#FF8000" />
        </View> : null
      }

      <ButtonContainer>
        <Button onPress = { handleSignOut } text = "SignOut" color = "#FF8000" />
        <Button onPress = { handleRefreshtoken } text = "Refresh" color = "#FF3333" />
      </ButtonContainer>
    </View>
  );
};

export default HomeScreen;
