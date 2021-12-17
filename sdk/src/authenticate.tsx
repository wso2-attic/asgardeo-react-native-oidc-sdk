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

import { auth } from "./wrapper";
import {
  AuthClientConfig,
  BasicUserInfo,
  DataLayer,
  DecodedIDTokenPayload,
  OIDCEndpoints,
  TokenResponse,
} from "@asgardeo/auth-js";
import url from "url";
import { Linking } from "react-native";
import { AsgardeoAuthException } from "@asgardeo/auth-js/src/exception";
import React, { useContext, useEffect, useState } from "react";

const initialState: TokenResponse = {
    accessToken: "",
    idToken: "",
    expiresIn: "",
    scope: "",
    refreshToken: "",
    tokenType: ""
}

const AuthClient = auth;

/**
 * Authentication Context to hold global states in react components.
 */
const AuthContext = React.createContext(null);

const AuthProvider = (props) => {
    const [state, setState] = useState(initialState);
    
    /**
     * This hook will register the url listener.
     */
    useEffect(() => {
        Linking.addEventListener('url', handleAuthRedirect);

        return () => {
            Linking.removeEventListener('url', handleAuthRedirect);
        }
    }, []);

    /**
     *
     * This method initializes the SDK with the config data.
     *
     * @param config - Authentication config object.
     *
     * @example
     * const config = {
     *     serverOrigin:"https://10.0.2.2:9443",
     *     signInRedirectURL:"http://10.0.2.2:8081",
     *     clientID: "ClientID",
     *     SignOutURL: "http://10.0.2.2:8081"
     * };
     *
     * initialize(config);
     */
    const initialize = async (config: AuthClientConfig): Promise<void> => {

        await auth.initialize(config);
    }

    /**
     * This method returns the `DataLayer` object that allows you to access authentication data.
     *
     * @return {Promise<DataLayer<any>>} - The `DataLayer` object.
     *
     * @example
     * ```
     * const data = await getDataLayer();
     * ```
     */
    const getDataLayer = async (): Promise<DataLayer<any>> => {

        return await auth.getDataLayer();
    }

    /**
     * This is an async method that returns a Promise that resolves with the authorization URL.
     *
     * @return {Promise<string>} - A promise that resolves with the authorization URL.
     *
     * @example
     * ```
     * auth.getAuthorizationURL(config).then((url) => {
     *     this.props.navigation.navigate("SignIn", {url:url,config:Config})
     * }).catch((error) => {
     *     console.error(error);
     * });
     * ```
     */ 
    const getAuthorizationURL = async (config): Promise<string> => {

        return await auth.getAuthorizationURL(config);
    }

    /**
     * This function obtains the authorization url and perform the signin redirection.
     * 
     * @example
     * ```
     * auth.signIn()
     * ```
     */
    const signIn = async () => {
        await auth.getAuthorizationURL()
            .then((url) => {
                Linking.openURL(url);
            })
            .catch((error) => {
                throw new AsgardeoAuthException(
                    "AUTHENTICATE-SI-IV01",
                    "authenticate",
                    "signIn",
                    "Failed to retrieve authorization url",
                    error
                )
            })
    }

    /**
     * This is an method that sends a request to obtain the access token and returns a Promise
     * that resolves with the token and other relevant data.
     *
     * @param authUrl - The authorization url.
     *
     * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
     *
     * @example
     * ```
     * requestAccessTokenDetails(authUrl).then((token) => {
     *     console.log("ReAccessToken", token);
     *     setAuthState({...token});
     * }).catch((error) => {
     *     console.log(error);
     * });
     * ```
     */
    const requestAccessTokenDetails = async (authUrl): Promise<TokenResponse> => {

        const urlObject = url.parse(authUrl.url);
        const dataList = urlObject.query.split("&");
        const code = dataList[0].split("=")[1];
        const sessionState = dataList[1].split("=")[1];

        const authState = await auth.requestAccessToken(code, sessionState);
        setState({ ...authState });
        return authState;
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
    const refreshAccessToken = async (): Promise<TokenResponse> => {

        const authState = await auth.refreshAccessToken();
        setState({ ...authState });
        return authState;
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
    const getSignOutURL = async (): Promise<string> => {

        return await auth.getSignOutURL();
    }

    /**
     * This method clears all authentication data and returns the sign-out URL.
     *
     * @param signOutUrl - The Signout url it get from getSignoutUrl method.
     * @return {Promise<string>} - A Promise that resolves with the sign-out URL.
     *
     * @example
     * ```
     * _signOut = signOut(url);
     * ```
     */
    const signOut = async () => {

        const signOutUrl = await auth.getSignOutURL();
        Linking.openURL(signOutUrl);
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
    const getOIDCServiceEndpoints = async (): Promise<OIDCEndpoints> => {

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
    const getDecodedIDToken = async (): Promise<DecodedIDTokenPayload> => {

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
    const userInformation = async (): Promise<BasicUserInfo> => {

        return await auth.getBasicUserInfo();
    }

    /**
     * This method revokes the access token.
     *
     * **This method also clears the authentication data.**
     *
     * @return {response} - A Promise that returns the response of the revoke-access-token request.
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
    const revokeAccessToken = async (): Promise<any> => {

        await auth.revokeAccessToken()
            .then((response) => {
                setState(initialState);
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            })
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
    const getAccessToken = async (): Promise<string> => {

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
    const isAuthenticated = async (): Promise<boolean> => {

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
    const getPKCECode = async (): Promise<string> => {

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
    const setPKCECode = async (pkce: string): Promise<void> => {

        return await auth.setPKCECode(pkce);
    }

    const handleAuthRedirect = async (authUrl): Promise<void> => {

        if (url.parse(authUrl.url).query.indexOf("code=") > -1) {
            await requestAccessTokenDetails(authUrl);
        } else if (url.parse(authUrl.url).query.indexOf("state=sign_out") > -1) {
            const dataList = url.parse(authUrl.url).query.split("&");
            const state = dataList[0].split("=")[1];
    
            if (state === "sign_out_success") {
                try {
                    await auth.getDataLayer().removeOIDCProviderMetaData();
                    await auth.getDataLayer().removeTemporaryData();
                    await auth.getDataLayer().removeSessionData();
                    setState(initialState);
                } catch(error) {
                    throw new AsgardeoAuthException(
                        "AUTHENTICATE-HAR-IV01",
                        "authenticate",
                        "handleAuthRedirect",
                        "Error in signout",
                        error
                    )
                }
            }
        } else {
            console.log("Invalid redirection url");
        }
    }

    return (
        <AuthContext.Provider
            value={ {
                initialize,
                getDataLayer,
                getAuthorizationURL,
                signIn,
                refreshAccessToken,
                getSignOutURL,
                signOut,
                getOIDCServiceEndpoints,
                getDecodedIDToken,
                userInformation,
                revokeAccessToken,
                getAccessToken,
                isAuthenticated,
                getPKCECode,
                setPKCECode,
                state
            } }
        ></AuthContext.Provider>
    )
};

const useAuthContext = () => {
    return useContext(AuthContext);
};

export { AuthClient, AuthProvider, useAuthContext };
