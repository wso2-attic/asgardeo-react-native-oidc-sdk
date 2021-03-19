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

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainBody: {
    backgroundColor: '#0000',
  },

  imageAlign: {
    alignItems: 'center',
  },

  image: {
    width: '85%',
    height: '60%',
    resizeMode: 'contain',
    borderRadius: 30,
  },

  button: {
    width: '30%',
    marginLeft: '35%',
  },

  text: {
    backgroundColor: '#f47421',
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 30,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 2,
  },

  textpara: {
    justifyContent: 'center',
    textAlign: 'justify',
    color: '#2A2A2A',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: '#282c34',
  },

  TextStyle: {
    color: 'blue',
    textDecorationLine: 'underline',
  },

  footer: {
    alignItems: 'center',
    paddingTop: 45,
  },

  footerAlign: {
    width: 50,
    height: 20,
  },

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

export { styles };
