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
import {
  SignOut,
  getSignOutURL,
  refreshAccessToken,
  getDecodedIDToken,
} from '@asgardeo/auth-react-native';
import React, {useEffect, useState} from 'react';
import {Linking, Text, View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ButtonContainer, Button} from '../components';

const defaultAuthState = {
  refreshToken: '',
  idToken: '',
  haslogin: false,
};

const defaultDecodeID = {
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

const SignIn = ({route, navigation}) => {
  const [authState, setAuthState] = useState(defaultAuthState);
  const [authID, setAuthID] = useState(defaultDecodeID);

  const handleRefreshtoken = async () => {
    // refreshtoken
    refreshAccessToken()
      .then((reftoken) => {
        setAuthState({...reftoken, haslogin: true});
      })
      .catch((error) => {
        console.log(error);
      });
    const decodeID = await getDecodedIDToken();
    setAuthID({...decodeID, c_hash: route.params.token.c_hash});
  };

  const handleSignOut = async () => {
    // signout
    const signOutUrl = await getSignOutURL();
    Linking.openURL(signOutUrl);
  };

  useEffect(() => {
    Linking.addEventListener('url', handleopenUrl);
  }, []);

  const handleopenUrl = async (Url) => {
    const _signOut = SignOut(Url);

    if (_signOut === true) {
      navigation.navigate('LoginScreen');
    } else {
      authState;
    }
  };

  return (
    <View style={styles.flexContainer}>
      <View style={styles.flex}>
        {route.params.token.sessionState ? (
          <View>
            <Text style={styles.flexheading}>
              Hi {route.params.token.username} !
            </Text>
            <Text style={styles.flexbody}>
              AllowedScopes : {route.params.token.allowedScopes}
            </Text>
            <Text style={styles.flexbody}>SessionState : </Text>
            <Text style={styles.flexdetails}>
              {route.params.token.sessionState}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.flex}>
        {authState.refreshToken ? (
          <View>
            <Text style={styles.flexheading}>Refresh token</Text>
            <Text style={styles.reftoke}>{authState.refreshToken}</Text>
          </View>
        ) : (
          <>
            <View>
              <Text style={styles.flexheading}>Refresh token</Text>
              <Text style={styles.refbody}>
                {' '}
                {route.params.token.refreshToken}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.flex}>
        {authState.idToken ? (
          <View>
            <Text style={styles.flexheading}>Decoded ID token</Text>
            <Text style={styles.body}>
              amr : {authID.amr},{'\n'}at_hash : {authID.at_hash},{'\n'}aud:{' '}
              {authID.aud},{'\n'}azp : {authID.azp},{'\n'}c_hash :{' '}
              {authID.c_hash},{'\n'}exp : {authID.exp},{'\n'}iat : {authID.iat},
              {'\n'}iss : {authID.iss},{'\n'}nbf : {authID.nbf},{'\n'}sub :{' '}
              {authID.sub}
            </Text>
          </View>
        ) : (
          <>
            <View>
              <Text style={styles.deco}>Decoded ID token</Text>
              <Text style={styles.body}>
                amr : {route.params.token.amr},{'\n'}at_hash :{' '}
                {route.params.token.at_hash},{'\n'}aud: {route.params.token.aud}
                ,{'\n'}azp : {route.params.token.azp},{'\n'}c_hash :{' '}
                {route.params.token.c_hash},{'\n'}exp : {route.params.token.exp}
                ,{'\n'}iat : {route.params.token.iat},{'\n'}iss :{' '}
                {route.params.token.iss},{'\n'}nbf : {route.params.token.nbf},
                {'\n'}sub : {route.params.token.sub}
              </Text>
            </View>
          </>
        )}
      </View>

      <ScrollView>
        <View style={styles.flex}>
          {authState.idToken ? (
            <View>
              <Text style={styles.flexheading}>ID token</Text>
              <Text style={styles.body}>{authState.idToken}</Text>
            </View>
          ) : (
            <>
              <View>
                <Text style={styles.flexheading}>ID token</Text>
                <Text style={styles.body}>{route.params.token.idToken}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <ButtonContainer>
        {route.params.token.sessionState ? (
          <>
            <Button onPress={handleSignOut} text="SignOut" color="#FF8000" />
          </>
        ) : null}

        {route.params.token.sessionState ? (
          <Button onPress={handleRefreshtoken} text="Refresh" color="#FF3333" />
        ) : null}
      </ButtonContainer>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 70,
  },

  flex: {
    backgroundColor: '#e2e2e2',
    borderColor: '#c5c5c5',
    borderWidth: 1,
  },

  flexheading: {
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  flexbody: {
    fontWeight: 'bold',
    marginLeft: 10,
  },

  flexdetails: {
    marginLeft: 10,
    marginBottom: 10,
  },

  body: {
    margin: 10,
  },

  reftoke: {
    textAlign: 'center',
    marginBottom: 10,
  },

  deco: {
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },

  refbody: {
    textAlign: 'center',
  },
});
