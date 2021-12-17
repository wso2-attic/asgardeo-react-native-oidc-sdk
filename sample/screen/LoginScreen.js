/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import 'text-encoding-polyfill';
import { useAuthContext } from '@asgardeo/auth-react-native';
import React, { useEffect } from 'react';
import { View, Image, Text, Button, Linking, ActivityIndicator } from 'react-native';
import { styles } from '../components/styles';
import { initialState, useLoginContext } from '../context/LoginContext';

// Create a config object containing the necessary configurations.
const config = {
  serverOrigin: 'https://api.asgardeo.io/t/<your_org>',
  signInRedirectURL: 'wso2sample://oauth2',
  clientID: '<client_id>'
};

const LoginScreen = (props) => {

  const { loginState, setLoginState, loading, setLoading } = useLoginContext();
  const { state, initialize, signIn, userInformation, getIDToken, getDecodedIDToken } = useAuthContext();

  /**
   * This hook will initialize the auth provider with the config object.
   */
  useEffect(() => {
    initialize(config);
  }, []);

  /**
   * This hook will listen for auth state updates and proceed.
   */
  useEffect(() => {
    if (state?.isAuthenticated) {
      const getData = async () => {
        try {
          const basicUserInfo = await userInformation();
          const idToken = await getIDToken();
          const decodedIDToken = await getDecodedIDToken();
    
          setLoginState({
            ...loginState, ...state, ...basicUserInfo, idToken: idToken, ...decodedIDToken, haslogin: true
          });
          setLoading(false);
          props.navigation.navigate('HomeScreen');
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }
      getData();
    }else if (loginState.hasLogoutInitiated) {
      setLoginState(initialState);
      props.navigation.navigate('LoginScreen');
    }
  }, [state.isAuthenticated]);

  /**
   * This function will be triggered upon login button click.
   */
  const handleSubmitPress = async () => {

    setLoading(true);
    signIn()
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <View style = { styles.mainBody }>
      <View>
        <View style = { styles.container }>
          <View>
            <Text style = { styles.text }>
              React Native Authentication Sample{' '}
            </Text>
          </View>
          <View style = { styles.imageAlign }>
            <Image
              source = { require('../assets/login.jpg') }
              style = { styles.image }
            />
            <Text style = { styles.textpara }>
              Sample demo to showcase authentication for a React Native via
              the OpenID Connect Authorization Code flow, which is integrated
              using the{' '}
              <Text
                style = { styles.TextStyle }
                onPress = { () =>
                  Linking.openURL('https://github.com/asgardeo/asgardeo-react-native-oidc-sdk')
                }>
                Asgardeo Auth React Native SDK
              </Text>
              .
            </Text>
          </View>
          <View style = { styles.button }>
            <Button
              color = "#282c34"
              onPress = { handleSubmitPress }
              title = "Login"
            />
          </View>
          {
            loading ? 
            <View style={ styles.loading } pointerEvents="none">
              <ActivityIndicator size="large" color="#FF8000" />
            </View> : null
          }
        </View>

        <View style = { styles.footer }>
          <Image
            source = { require('../assets/footer.png') }
            style = { styles.footerAlign }
          />
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;
