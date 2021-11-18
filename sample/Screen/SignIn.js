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

import {
  SignOut,
  getSignOutURL,
  refreshAccessToken,
  getDecodedIDToken,
} from '@asgardeo/auth-react-native';
import React from 'react';
import { Linking, Text, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import url from 'url';
import { ButtonContainer, Button } from '../components';
import { styles } from '../components/styles';
import { loginState, updateLoginState, clearLoginState } from '../data/state';

class SignIn extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      loading: false
    };
    Linking.addEventListener('url', this.handleopenUrl);
  }

  componentDidUpdate() {

    if (loginState.accessToken === '') {
      this.props.navigation.navigate('LoginScreen');
    }
  }

  componentWillUnmount() {

    Linking.removeEventListener('url', this.handleopenUrl);
  }

  handleRefreshtoken = async () => {

    this.setState({ loading: true });

    refreshAccessToken()
      .then((reftoken) => {
        updateLoginState(reftoken);
        this.setState({ loading: false });
        this.forceUpdate();
      })
      .catch((error) => {
        this.setState({ loading: true });
        console.log(error);
      });
    const decodeID = await getDecodedIDToken();
    updateLoginState(decodeID);
  };

  handleSignOut = async () => {

    const signOutUrl = await getSignOutURL();
    Linking.openURL(signOutUrl);
  };

  handleopenUrl = async (Url) => {

    if (url.parse(Url.url).query.indexOf("state=sign_out") > -1) {
      this.setState({ loading: true });
      const _signOut = SignOut(Url);

      if (_signOut === true) {
        clearLoginState();
        this.setState({ loading: false });
        this.props.navigation.navigate('LoginScreen');
      } else {
        this.setState({ loading: false });
      }
    }
  };

  render() {

    return (
      <View style = { styles.flexContainer }>
        <View style = { styles.flex }>
          <View>
            <Text style = { styles.flexheading }>
              Hi { loginState.username } !
            </Text>
            <Text style = { styles.flexbody }>
              AllowedScopes : { loginState.allowedScopes }
            </Text>
            <Text style = { styles.flexbody }>SessionState : </Text>
            <Text style = { styles.flexdetails }>
              { loginState.sessionState }
            </Text>
          </View>
        </View>

        <View style = { styles.flex }>
          <View>
            <Text style = { styles.flexheading }>Refresh token</Text>
            <Text style = { styles.reftoke }>{ loginState.refreshToken }</Text>
          </View>
          <View>
            <Text style = { styles.flexheading }>Access token (temp)</Text>
            <Text style = { styles.reftoke }>{ loginState.accessToken }</Text>
          </View>
        </View>

        <View style = { styles.flex }>
          <View>
            <Text style = { styles.flexheading }>Decoded ID token</Text>
            <Text style = { styles.body }>amr : { loginState.amr }, { '\n' }at_hash : { loginState.at_hash }, { '\n' }aud: { loginState.aud }, {'\n'}azp : { loginState.azp }, {'\n'}c_hash : { loginState.c_hash }, {'\n'}exp : { loginState.exp }, {'\n'}iat : { loginState.iat }, {'\n'}iss : { loginState.iss }, {'\n'}nbf :  {loginState.nbf }, {'\n'}sub : { loginState.sub }</Text>
          </View>
        </View>

        <ScrollView>
          <View style = { styles.flex }>
            <View>
              <Text style = { styles.flexheading }>ID token</Text>
              <Text style = { styles.body }>{ loginState.idToken }</Text>
            </View>
          </View>
        </ScrollView>

        {
          this.state.loading ? 
          <View style={ styles.loading } pointerEvents="none">
            <ActivityIndicator size="large" color="#FF8000" />
          </View> : null
        }

        <ButtonContainer>
          <Button onPress = { this.handleSignOut } text = "SignOut" color = "#FF8000" />
          <Button onPress = { this.handleRefreshtoken } text = "Refresh" color = "#FF3333" />
        </ButtonContainer>
      </View>
    );
  }
};

export default SignIn;
