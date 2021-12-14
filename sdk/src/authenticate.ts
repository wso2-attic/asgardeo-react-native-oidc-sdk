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

import { auth } from './wrapper';
import {
    TokenResponse,
  } from '@asgardeo/auth-js';
import url from 'url';

/**
 *
 * This method initializes the SDK with the config data.
 *
 * @example
 * const Config ={
 *     serverOrigin:"https://10.0.2.2:9443",
 *     signInRedirectURL:"http://10.0.2.2:8081",
 *     clientID: "ClientID",
 *     SignOutURL: "http://10.0.2.2:8081"
 * };
 *
 * initialize(config);
 */
export const initialize = async(config):Promise<void> => {

    await auth.initialize(config);
}

/**
 * This method returns the `DataLayer` object that allows you to access authentication data.
 *
 * @return {DataLayer} - The `DataLayer` object.
 *
 * @example
 * ```
 * const data = await getDataLayer();
 * ```
 */
export const getDataLayer = async () => {

    return await auth.getDataLayer();
}

/**
 * This is an async method that returns a Promise that resolves with the authorization URL.
 *
 * @return {Promise<string>} - A promise that resolves with the authorization URL.
 *
 * @example
 * ```
 * auth.getAuthorizationURL(Config).then((url) => {
 *     this.props.navigation.navigate("SignIn",{url:url,config:Config}) // navigate it to SignIn page
 * }).catch((error) => {
 *     console.error(error);
 * });
 * ```
 */ 
export const getAuthorizationURL = async (config):Promise<String> => { 

    return await auth.getAuthorizationURL(config);
}

/**
 * This is an method that sends a request to obtain the access token and returns a Promise
 * that resolves with the token and other relevant data.
 *
 * @param Authurl - The authorization url.
 *
 * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
 *
 * @example
 * ```
 * requestAccessTokenDetails(Authurl).then((token) => { // get param of authorization url and return token details
 *     console.log("ReAccessToken", token);
 *     setAuthState({...token});
 * }).catch((error) => {
 *     console.log(error);
 * });
 * ```
 */
export const requestAccessTokenDetails = async (Authurl) => {

    const urlObject = url.parse(Authurl.url);
    const data_list = urlObject.query.split('&');
    const code = data_list[0].split('=')[1];
    const session_state = data_list[1].split('=')[1];

    return await auth.requestAccessToken(code, session_state);
}

/**
 * This method refreshes the access token and returns a Promise that resolves with the new access
 * token and other relevant data.
 *
 * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
 *
 * @example
 * ```
 * refreshAccessToken().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 * ```
 */
export const refreshAccessToken = async (): Promise<TokenResponse> => {

    return await auth.refreshAccessToken();
}

/**
 * This method returns the sign-out URL.
 *
 * **This doesn't clear the authentication data.**
 *
 * @return {Promise<string>} - A Promise that resolves with the sign-out URL.
 *
 * @example
 * ```
 * const signOutUrl = await getSignOutURL();
 * ```
 */
export const getSignOutURL = async () => {

    return await auth.getSignOutURL();
}

/**
 * This method clears all authentication data and returns the sign-out URL.
 *
 * @param Url - The Signout Url it get from getSignoutUrl method.
 * @return {Promise<string>} - A Promise that resolves with the sign-out URL.
 *
 * @example
 * ```
 * _signOut = SignOut(url);
 * ```
 */
export const SignOut = (Url) => {

    const data_list = url.parse(Url.url).query.split('&')
    const state =data_list[0].split('=')[1]

    if ( state == "sign_out_success" ) {
        auth.getDataLayer().removeOIDCProviderMetaData();
        auth.getDataLayer().removeTemporaryData();
        auth.getDataLayer().removeSessionData();
        return true;
    } else {
        return false;
    }
}

/**
 * This method returns OIDC service endpoints that are fetched from the `.well-known` endpoint.
 *
 * @return {Promise<OIDCEndpoints>} - A Promise that resolves with an object containing the OIDC service endpoints.
 *
 * @example
 * ```
 * const endpoints = await getOIDCServiceEndpoints();
 * ```
 */
export const getOIDCServiceEndpoints = async() => {

    return await auth.getOIDCServiceEndpoints();
}

/**
 * This method decodes the payload of the ID token and returns it.
 *
 * @return {Promise<DecodedIDTokenPayload>} - A Promise that resolves with the decoded ID token payload.
 *
 * @example
 * ```
 * const decodedIdToken = await getDecodedIDToken();
 * ```
 *
 */
export const getDecodedIDToken = async() => {

    return await auth.getDecodedIDToken();
}

/**
 * This method returns the basic user information obtained from the ID token.
 *
 * @return {Promise<BasicUserInfo>} - A Promise that resolves with an object containing the basic user information.
 *
 * @example
 * ```
 * const userInfo = await userInfomation();
 * ```
 */
export const userInformation = async () => {

    return await auth.getBasicUserInfo();
}

/**
 * This method revokes the access token.
 *
 * **This method also clears the authentication data.**
 *
 * @return {response}- A Promise that returns the response of the revoke-access-token request.
 *
 * @example
 * ```
 * revokeAccessToken().then((response)=>{
 *     console.log(response);
 * }).catch((error)=>{
 *     console.error(error);
 * });
 * ```
 */
export const revokeAccessToken = async () => {

    return await auth.revokeAccessToken();
}

/**
 * This method returns the access token.
 *
 * @return {Promise<string>} - A Promise that resolves with the access token.
 *
 * @example
 * ```
 * const accessToken = await getAccessToken();
 * ```
 */
export const getAccessToken = async () => {

    return await auth.getAccessToken();
}

/**
 * This method returns if the user is authenticated or not.
 *
 * @return {Promise<boolean>} - A Promise that resolves with `true` if the user is authenticated, `false` otherwise.
 *
 * @example
 * ```
 * await isAuthenticated();
 * ```
 */
export const isAuthenticated = async () => {

    return await auth.isAuthenticated();
}

/**
 * This method returns the PKCE code generated during the generation of the authentication URL.
 *
 * @return {Promise<string>} - A Promise that resolves with the PKCE code.
 *
 * @example
 * ```
 * const pkce = await getPKCECode();
 * ```
 */
export const getPKCECode = async () => {

    return await auth.getPKCECode();
}

/**
 * This method sets the PKCE code to the data store.
 *
 * @param {string} pkce - The PKCE code.
 *
 * @example
 * ```
 * await setPKCECode("pkce_code")
 * ```
 */
export const setPKCECode = async (pkce:string) => {

    return await auth.setPKCECode(pkce);
}
