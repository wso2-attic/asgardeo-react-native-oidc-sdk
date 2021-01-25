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


import React, { FunctionComponent, createContext, useContext, useEffect, useState, Component } from "react";

import {auth} from './store';
import {TokenResponse,SESSION_STATE,PKCE_CODE_VERIFIER} from '@asgardeo/auth-js';
import {AsgardeoAuthException, AsgardeoAuthNetworkException} from './exception'
import {AuthenticationHelper} from './authentication-helper';

import {fetch} from 'react-native-ssl-pinning';



  export const initialize=async(config):Promise<void>=>{
    return await auth.initialize(config);
  }

  export const getDataLayer=async ()=>{
    return auth.getDataLayer();
  }
  
  export const getAuthorizationURL=async(config): Promise<String>=>{
    return await auth.getAuthorizationURL(config);
  }

  
  export const requestAccessToken = async(authorizationCode, sessionState,config): Promise<TokenResponse>=>{
        
        const data = auth.getDataLayer();
        const  _authenticationHelper = new AuthenticationHelper(data);
        const tokenEndpoint = (await data.getOIDCProviderMetaData()).token_endpoint;
        const configData = await config;
        
        if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
            return Promise.reject(
                new AsgardeoAuthException(
                    "AUTH_CORE-RAT1-NF01",
                    "authentication-core",
                    "requestAccessToken",
                    "Token endpoint not found.",
                    "No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                        "or the token endpoint passed to the SDK is empty."
                )
            );
        }

        await data.setSessionDataParameter(SESSION_STATE, sessionState);
        

        var body = "";
        body += `client_id=${configData.clientID}`

        if (configData.clientSecret && configData.clientSecret.trim().length > 0) {
            body += `&client_secret=${configData.clientSecret}`
        }

        const code = authorizationCode;
        body += `&code=${code}`

        body += "&grant_type=authorization_code"
        body += `&redirect_uri=${configData.signInRedirectURL}`
        
        if (configData.enablePKCE) {
            body += `&code_verifier=${await data.getTemporaryDataParameter(PKCE_CODE_VERIFIER)}`
            await data.removeTemporaryDataParameter(PKCE_CODE_VERIFIER);
        }
        
        return fetch(tokenEndpoint+"?", {
          method: 'POST',
          disableAllSecurity: true,
          sslPinning: {
            certs: ["wso2carbon"], // TODO: make the certificate name configurable
          },
          headers: {
            Accept: `application/json`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: body
        })
        .then(response => {
                return _authenticationHelper
                    .handleTokenResponse(response)
                    .then((response: TokenResponse) => response)
                    .catch((error) => {
                        return Promise.reject(
                            new AsgardeoAuthException(
                                "AUTH_CORE-RAT1-ES02",
                                "authentication-core",
                                "requestAccessToken",
                                null,
                                null,
                                error
                            )
                        );
                    });
            })
            .catch((error) => {
                return Promise.reject(
                    new AsgardeoAuthNetworkException(
                        "AUTH_CORE-RAT1-NR03",
                        "authentication-core",
                        "requestAccessToken",
                        "Requesting access token failed",
                        "The request to get the access token from the server failed.",
                        error?.code,
                        error?.message,
                        error?.response?.status,
                        error?.response?.data
                    )
                );
            });
          }

   
    export const refreshAccessToken = async (config): Promise<TokenResponse> => {
            const data = auth.getDataLayer();
            const  _authenticationHelper = new AuthenticationHelper(data);
            const tokenEndpoint = (await data.getOIDCProviderMetaData()).token_endpoint;
            const configData = await config;
            const sessionData = await data.getSessionData();
            
            if (!sessionData.refresh_token) {
                return Promise.reject(
                    new AsgardeoAuthException(
                        "AUTH_CORE-RAT2-NF01",
                        "authentication-core",
                        "refreshAccessToken",
                        "No refresh token found.",
                        "There was no refresh token found. The identity server doesn't return a " +
                            "refresh token if the refresh token grant is not enabled."
                    )
                );
            }
            
            if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
                return Promise.reject(
                    new AsgardeoAuthException(
                        "AUTH_CORE-RAT2-NF02",
                        "authentication-core",
                        "refreshAccessToken",
                        "No refresh token endpoint found.",
                        "No refresh token endpoint was in the OIDC provider meta data returned by the well-known " +
                            "endpoint or the refresh token endpoint passed to the SDK is empty."
                    )
                );
            }
            
            var body = "";
            body += `client_id=${configData.clientID}`
            body +=`&refresh_token=${sessionData.refresh_token}`
            body += "&grant_type=refresh_token"
    
            if (configData.clientSecret && configData.clientSecret.trim().length > 0) {
                body +=` &client_secret=${configData.clientSecret}`
            }
            
            return fetch(tokenEndpoint+"?", {
              method: 'POST',
              disableAllSecurity: true,
              sslPinning: {
                certs: ["wso2carbon"], // TODO: make the certificate name configurable
              },
              headers: {
                Accept: `application/json`,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: body
            })
            .then((response) => { 
                    return _authenticationHelper
                        .handleTokenResponse(response)
                        .then((response: TokenResponse) => response)
                        .catch((error) => {
                            return Promise.reject(
                                new AsgardeoAuthException(
                                    "AUTH_CORE-RAT2-ES03",
                                    "authentication-core",
                                    "refreshAccessToken",
                                    null,
                                    null,
                                    error
                                )
                            );
                        });
                })
                .catch((error) => {
                    return Promise.reject(
                        new AsgardeoAuthNetworkException(
                            "AUTH_CORE-RAT2-NR03",
                            "authentication-core",
                            "refreshAccessToken",
                            "Refresh access token request failed.",
                            "The request to refresh the access token failed.",
                            error?.code,
                            error?.message,
                            error?.response?.status,
                            error?.response?.data
                        )
                    );
                });
        }

    export const revokeAccessToken= async(Config)=> {
          const data = auth.getDataLayer();
          const  _authenticationHelper = new AuthenticationHelper(data);
          const revokeTokenEndpoint = (await data.getOIDCProviderMetaData()).revocation_endpoint;
          const configData = await Config;
  
          if (!revokeTokenEndpoint || revokeTokenEndpoint.trim().length === 0) {
              return Promise.reject(
                  new AsgardeoAuthException(
                      "AUTH_CORE-RAT3-NF01",
                      "authentication-core",
                      "revokeAccessToken",
                      "No revoke access token endpoint found.",
                      "No revoke access token endpoint was found in the OIDC provider meta data returned by " +
                          "the well-known endpoint or the revoke access token endpoint passed to the SDK is empty."
                  )
              );
          }
  
          var body = ""
          body += `client_id=${configData.clientID}`
          body += `&token=${(await data.getSessionData()).access_token}`
          body += "&token_type_hint=access_token"

          return fetch(revokeTokenEndpoint+"?", {
            method: 'POST',
            disableAllSecurity: true,
            sslPinning: {
              certs: ["wso2carbon"], // TODO: make the certificate name configurable
            },
            headers: {
              Accept: `application/json`,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
          })
          .then((response) => {
                  if (response.status !== 200) {
                      return Promise.reject(
                          new AsgardeoAuthException(
                              "AUTH_CORE-RAT3-NR02",
                              "authentication-core",
                              "revokeAccessToken",
                              "Invalid response status received for revoke access token request.",
                              "The request sent to revoke the access token returned " +
                                  response.status +
                                  " , which is invalid."
                          )
                      );
                  }
  
                  _authenticationHelper.clearUserSessionData();
  
                  return Promise.resolve(response);
              })
              .catch((error) => {
                  return Promise.reject(
                      new AsgardeoAuthNetworkException(
                          "AUTH_CORE-RAT3-NR03",
                          "authentication-core",
                          "revokeAccessToken",
                          "The request to revoke access token failed.",
                          "The request sent to revoke the access token failed.",
                          error?.code,
                          error?.message,
                          error?.response?.status,
                          error?.response?.data
                      )
                  );
              });
      }


export const getSignOutURL = async () =>{ 
  return await auth.getSignOutURL();
}
   
export const userInformation = async () =>{
  return await auth.getBasicUserInfo();
}

// export const refreshAccessToken1 =async ()=>{
//   return await auth.refreshAccessToken();
// }

export const SignOut = async () =>{
  return await auth.signOut();
}




    //   export const requestCustomGrant= async (customGrantParams: CustomGrantConfig)=> {
    //     const dataLayer = auth.getDataLayer();
    //     const oidcProviderMetadata = await  dataLayer.getOIDCProviderMetaData();
    //     const  _authenticationHelper = new AuthenticationHelper(dataLayer);

    //     if (!oidcProviderMetadata.token_endpoint || oidcProviderMetadata.token_endpoint.trim().length === 0) {
    //         return Promise.reject(
    //             new AsgardeoAuthException(
    //                 "AUTH_CORE-RCG-NF01",
    //                 "authentication-core",
    //                 "requestCustomGrant",
    //                 "Token endpoint not found.",
    //                 "No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
    //                     "or the token endpoint passed to the SDK is empty."
    //             )
    //         );
    //     }

    //     let body: string = "";

    //     Object.entries(customGrantParams.data).map(([key, value], index: number) => {
    //         const newValue = _authenticationHelper.replaceCustomGrantTemplateTags(value as string);
    //         body += `${key}=${newValue}${index !== Object.entries(customGrantParams.data).length - 1 ? "&" : ""}`;
    //     });

    //     const requestConfig = {
    //         body: body,
    //         disableAllSecurity: true,
    //         headers: {
    //             ...AuthenticationUtils.getTokenRequestHeaders(),
    //         },
    //            sslPinning: {
    //              certs: ["wso2carbon"], // TODO: make the certificate name configurable
    //            },
            
    //     };

    //     if (customGrantParams.attachToken) {
    //         requestConfig.headers = {
    //             ...requestConfig.headers,
    //             Authorization: `Bearer ${(await dataLayer.getSessionData()).access_token}`
    //         };
    //     }
    //     // return fetch(oidcProviderMetadata.token_endpoint+"?", {
    //     //   method: 'POST',
    //     //   disableAllSecurity: true,
    //     //   sslPinning: {
    //     //     certs: ["wso2carbon"], // TODO: make the certificate name configurable
    //     //   },
    //     //   headers: {
    //     //     Accept: `application/json`,
    //     //     "Content-Type": "application/x-www-form-urlencoded"
    //     //   },
    //     //   body: body
    //     // })
    //     return fetch(oidcProviderMetadata.token_endpoint+"?",{method:'POST',...requestConfig})
        
    //         .then((response) => {
              
    //                 if (customGrantParams.returnsSession) {
    //                     return _authenticationHelper
    //                         .handleTokenResponse(response)
    //                         .then((response) => response)
    //                         .catch((error) => {
    //                             return Promise.reject(
    //                                 new AsgardeoAuthException(
    //                                     "AUTH_CORE-RCG-ES03",
    //                                     "authentication-core",
    //                                     "requestCustomGrant",
    //                                     null,
    //                                     null,
    //                                     error
    //                                 )
    //                             );
    //                         });
    //                 } else {
    //                     return Promise.resolve(response);
    //                 }
    //             }
    //         )
    //         .catch((error) => {
    //             return Promise.reject(
    //                 new AsgardeoAuthNetworkException(
    //                     "AUTH_CORE-RCG-NR04",
    //                     "authentication-core",
    //                     "requestCustomGrant",
    //                     "The custom grant request failed.",
    //                     "The request sent to get the custom grant failed.",
    //                     error?.code,
    //                     error?.message,
    //                     error?.response?.status,
    //                     error?.response?.data
    //                 )
    //             );
    //         });
    // }

    // public async getBasicUserInfo(): Promise<BasicUserInfo> {
    //     const sessionData = await this._dataLayer.getSessionData();
    //     const authenticatedUser = AuthenticationUtils.getAuthenticatedUserInfo(sessionData?.id_token);
    //     return {
    //         allowedScopes: sessionData.scope,
    //         displayName: authenticatedUser.displayName,
    //         email: authenticatedUser.email,
    //         sessionState: sessionData.session_state,
    //         tenantDomain: authenticatedUser.tenantDomain,
    //         username: authenticatedUser.username
    //     };
    // }

    // public async getDecodedIDToken(): Promise<DecodedIDTokenPayload> {
    //     const idToken = (await this._dataLayer.getSessionData()).id_token;
    //     const payload: DecodedIDTokenPayload = CryptoUtils.decodeIDToken(idToken);

    //     return payload;
    // }

    // public async getOIDCProviderMetaData(forceInit: boolean): Promise<boolean> {
    //     if (!forceInit && await this._dataLayer.getTemporaryDataParameter(OP_CONFIG_INITIATED)) {
    //         return Promise.resolve(true);
    //     }

    //     const wellKnownEndpoint = await this._authenticationHelper.resolveWellKnownEndpoint();

    //     return axios
    //         .get(wellKnownEndpoint)
    //         .then(async (response: { data: OIDCProviderMetaData; status: number }) => {
    //             if (response.status !== 200) {
    //                 return Promise.reject(
    //                     new AsgardeoAuthException(
    //                         "AUTH_CORE-GOPM-NR01",
    //                         "authentication-core",
    //                         "getOIDCProviderMetaData",
    //                         "Invalid response status received for OIDC provider meta data request.",
    //                         "The request sent to the well-known endpoint to get the OIDC provider meta data returned " +
    //                             response.status +
    //                             " , which is invalid."
    //                     )
    //                 );
    //             }

    //             await this._dataLayer.setOIDCProviderMetaData(
    //                 await this._authenticationHelper.resolveEndpoints(response.data)
    //             );
    //             await this._dataLayer.setTemporaryDataParameter(OP_CONFIG_INITIATED, true);

    //             return Promise.resolve(true);
    //         })
    //         .catch(async () => {
    //             await this._dataLayer.setOIDCProviderMetaData(
    //                 await this._authenticationHelper.resolveFallbackEndpoints()
    //             );
    //             await this._dataLayer.setTemporaryDataParameter(OP_CONFIG_INITIATED, true);

    //             return Promise.resolve(true);
    //         });
    // }

