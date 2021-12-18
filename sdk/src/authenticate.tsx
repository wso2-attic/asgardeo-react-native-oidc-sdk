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
  GetAuthURLConfig,
  OIDCEndpoints,
  TokenResponse,
} from "@asgardeo/auth-js";
import url from "url";
import { Linking } from "react-native";
import { AsgardeoAuthException } from "@asgardeo/auth-js/src/exception";
import React, { useContext, useEffect, useState } from "react";
import { AuthContextInterface, AuthStateInterface, AuthUrl } from "./models";

const initialState: AuthStateInterface = {
    accessToken: "",
    idToken: "",
    expiresIn: "",
    scope: "",
    refreshToken: "",
    tokenType: "",
    isAuthenticated: false
}

const AuthClient = auth;

/**
 * Authentication Context to hold global states in react components.
 */
const AuthContext = React.createContext<AuthContextInterface>(null);

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
     * @param {AuthClientConfig} config - Authentication config object.
     * @return {Promise<void>}
     *
     * @example
     * ```
     * initialize(config);
     * ```
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
     * This is an async method that returns a Promise which resolves with the authorization URL.
     *
     * @param {GetAuthURLConfig} config - Auth url config.
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
    const getAuthorizationURL = async (config: GetAuthURLConfig): Promise<string> => {

        return await auth.getAuthorizationURL(config);
    }

    /**
     * This function obtains the authorization url and perform the signin redirection.
     * 
     * @return {Promise<void>}
     * 
     * @example
     * ```
     * signIn()
     * ```
     */
    const signIn = async (): Promise<void> => {
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
     * @param {AuthUrl} authUrl - The authorization url.
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
    const requestAccessTokenDetails = async (authUrl: AuthUrl): Promise<TokenResponse> => {

        const urlObject = url.parse(authUrl.url);
        const dataList = urlObject.query.split("&");
        const code = dataList[0].split("=")[1];
        const sessionState = dataList[1].split("=")[1];

        const authState = await auth.requestAccessToken(code, sessionState);

        /**
         * TODO: Remove this waiting once https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/164 is fixed.
         */
        await getAccessToken();

        setState({ ...authState, isAuthenticated: true });
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

        setState({ ...state, isAuthenticated: false });
        const authState = await auth.refreshAccessToken();
        setState({ ...authState, isAuthenticated: true });
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
     * @return  {Promise<void>}
     * 
     * @example
     * ```
     * signOut();
     * ```
     */
    const signOut = async (): Promise<void> => {

        await auth.getSignOutURL()
            .then((signOutUrl) => {
                Linking.openURL(signOutUrl);
            })
            .catch((error) => {
                throw new AsgardeoAuthException(
                    "AUTHENTICATE-SO-IV01",
                    "authenticate",
                    "signOut",
                    "Failed to retrieve signout url",
                    error
                )
            })
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
     * @return {Promise<any>} - A Promise that returns the response of the revoke-access-token request.
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
     * This method returns the id token.
     *
     * @return {Promise<string>} - A Promise that resolves with the id token.
     *
     * @example
     * ```
     * const idToken = await getIDToken();
     * ```
     */
    const getIDToken = async (): Promise<string> => {

        return await auth.getIDToken();
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
     * @return  {Promise<void>}
     * 
     * @example
     * ```
     * await setPKCECode("pkce_code")
     * ```
     */
    const setPKCECode = async (pkce: string): Promise<void> => {

        return await auth.setPKCECode(pkce);
    }

    /**
     * This function will handle authentication/ signout redirections.
     * 
     * @param {AuthUrl} authUrl - redirection url.
     * @return  {Promise<void>}
     */
    const handleAuthRedirect = async (authUrl: AuthUrl): Promise<void> => {
        try {
            if (url.parse(authUrl?.url)?.query.indexOf("code=") > -1) {
                await requestAccessTokenDetails(authUrl);
            } else if (url.parse(authUrl?.url)?.query.indexOf("state=sign_out") > -1) {
                const dataList = url.parse(authUrl?.url)?.query.split("&");
                const authState = dataList[0].split("=")[1];
        
                if (authState === "sign_out_success") {
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
        } catch (error) {
            console.log("Error when handling url redirection.", error);
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
                getIDToken,
                isAuthenticated,
                getPKCECode,
                setPKCECode,
                state
            } }
        >
            {props.children}
        </AuthContext.Provider>
    )
};

const useAuthContext = (): AuthContextInterface => {
    return useContext(AuthContext);
};

export { AuthClient, AuthProvider, useAuthContext };
