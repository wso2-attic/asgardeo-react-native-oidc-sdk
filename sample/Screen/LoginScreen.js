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
import {
  initialize,
  getAuthorizationURL,
  requestAccessTokenDetails,
  userInformation,
  getDecodedIDToken,
  getAccessToken
} from '@asgardeo/auth-react-native';
import React from 'react';
import { View, Image, Text, Button, Linking, ActivityIndicator } from 'react-native';
import url from 'url';
import { styles } from '../components/styles';
import { loginState, updateLoginState } from '../data/state';

// Create a config object containing the necessary configurations.
// For emulator.
const Config = {
  serverOrigin: 'https://10.0.2.2:9443',
  signInRedirectURL: 'http://10.0.2.2:8081',
  clientID: 'iMc7TiIaIFafkd5hA5xf7kGiAWUa',
  //SignOutURL: "http://10.0.2.2:8081"       (Optional)
};

// For device.
//  const Config ={
//    serverOrigin:"https://192.168.43.29:9443",
//    signInRedirectURL:"http://192.168.43.29:8081",
//    clientID: "M1eM7_pf45m0fKJkfCDUTI6Demca",
//    SignOutURL: "http://192.168.43.29:8081"
//  };

class LoginScreen extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      loading: false
    };

    // Initializes the SDK with the config data.
    initialize(Config);
  }

  componentDidMount() {

    Linking.addEventListener('url', this.handleAuthUrl);
  }

  componentWillUnmount() {

    Linking.removeEventListener('url', this.handleAuthUrl);
  }

  handleAuthUrl = async (Url) => {

    if (url.parse(Url.url).query.indexOf("code=") > -1) {
      this.setState({ loading: true });

      // Get param of authorization url and return token details.
      requestAccessTokenDetails(Url)
        .then(async (token) => {
          /**
           * TODO: Remove this waiting once https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/164 is fixed.
           */
          await getAccessToken();

          updateLoginState({  ...token, haslogin: true });

          userInformation().then((user) => {
            updateLoginState(user);
            getDecodedIDToken().then((decodeID) => {
              updateLoginState(decodeID);
              this.setState({ loading: false });
              this.props.navigation.navigate('SignIn');
            })
            .catch((error) => {
              console.log(error);
            });
          })
          .catch((error) => {
            console.log(error);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleSubmitPress = async () => {

    // Authenticate with Identity server.
    getAuthorizationURL()
      .then((url) => {
        if (loginState.haslogin === false) {
          // Linking the AuthorizeUrl through the internet.
          Linking.openURL(url);
        } else {
          this.setState({ loading: true });
          
          userInformation().then((user) => {
            updateLoginState(user);
            getDecodedIDToken().then((decodeID) => {
              updateLoginState(decodeID);
              this.setState({ loading: false });
              this.props.navigation.navigate('SignIn');
            })
            .catch((error) => {
              this.setState({ loading: false });
              console.log(error);
            });
          })
          .catch((error) => {
            this.setState({ loading: false });
            console.log(error);
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };

  render() {

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
                onPress = { this.handleSubmitPress }
                title = "Login"
              />
            </View>
            {
              this.state.loading ? 
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
}

export default LoginScreen;
