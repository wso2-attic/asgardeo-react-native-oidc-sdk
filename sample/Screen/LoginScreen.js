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
} from '@asgardeo/auth-react-native';
import React from 'react';
import { View, Image, Text, Button, Linking } from 'react-native';
import { styles } from '../components/styles';

// Create a config object containing the necessary configurations.
//for emulator
const Config = {
  serverOrigin: 'https://10.0.2.2:9443',
  signInRedirectURL: 'http://10.0.2.2:8081',
  clientID: 'iMc7TiIaIFafkd5hA5xf7kGiAWUa',
  //SignOutURL: "http://10.0.2.2:8081"       (Optional)
};

// for device
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
      refreshToken: '',
      idToken: '',
      haslogin: false,
      allowedScopes: '',
      username: '',
      sessionState: '',
      amr: '',
      at_hash: '',
      aud: '',
      azp: '',
      c_hash: '',
      exp: '',
      iat: '',
      iss: '',
      nbf: '',
      sub: '',
    };
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleAuthUrl);
  }

  handleAuthUrl = async (Url) => {
    requestAccessTokenDetails(Url)
      .then((token) => {
        // get param of authorization url and return token details
        this.setState({ ...token, haslogin: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmitPress = async () => {
    // initializes the SDK with the config data
    await initialize(Config);

    // authenticate with Identity server
    getAuthorizationURL(Config)
      .then((url) => {
        if (this.state.haslogin === false) {
          Linking.openURL(url); // Linking the AuthorizeUrl through the internet
        } else {
          userInformation().then((user) => {
            this.setState({ ...user });

            getDecodedIDToken().then((decodeID) => {
              this.setState({ ...decodeID });
              this.props.navigation.navigate('SignIn', { token: this.state });
              this.setState({ haslogin: false });
            });
          });
        }
      })
      .catch((error) => {
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
