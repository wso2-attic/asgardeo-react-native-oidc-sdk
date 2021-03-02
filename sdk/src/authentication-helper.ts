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

import { KeyLike } from "crypto";
import {fetch} from 'react-native-ssl-pinning';
import { SERVICE_RESOURCES} from "./oidc-endpoints";
import { AsgardeoAuthException, AsgardeoAuthNetworkException } from "./exception";
import { DataLayer,AuthClientConfig, OIDCProviderMetaData, TokenResponse,OIDC_SCOPE,TOKEN_TAG,USERNAME_TAG,SCOPE_TAG,CLIENT_ID_TAG,CLIENT_SECRET_TAG } from "@asgardeo/auth-js";
import { AuthenticationUtils, CryptoUtils } from "./utils";
import { auth } from "./store";

export class AuthenticationHelper<T> {
    
    private _config: () => Promise<AuthClientConfig>;
    private _oidcProviderMetaData: () => Promise<OIDCProviderMetaData>;

    public constructor(dataLayer: DataLayer<T>) {
       
        this._config = async () => await auth.getDataLayer().getConfigData();
        this._oidcProviderMetaData = async () => await auth.getDataLayer().getOIDCProviderMetaData();
    }

    public async resolveWellKnownEndpoint(): Promise<string> {
        const configData = await this._config();
        if (configData.wellKnownEndpoint) {
            return configData.serverOrigin + configData.wellKnownEndpoint;
        }

        return configData.serverOrigin + SERVICE_RESOURCES.wellKnownEndpoint;
    }

    public async resolveEndpoints(response: OIDCProviderMetaData): Promise<OIDCProviderMetaData> {
        const oidcProviderMetaData = {};
        const configData = await this._config();

        configData.endpoints &&
            Object.keys(configData.endpoints).forEach((endpointName: string) => {
                const camelCasedName = endpointName
                    .split("_")
                    .map((name: string, index: number) => {
                        if (index !== 0) {
                            return name[0].toUpperCase() + name.substring(1);
                        }

                        return name;
                    })
                    .join("");

                if (configData.overrideWellEndpointConfig && configData.endpoints[camelCasedName]) {
                    oidcProviderMetaData[camelCasedName] = configData.endpoints[camelCasedName];
                }
            });

        return { ...response, ...oidcProviderMetaData };
    }



    public async validateIdToken(idToken: string): Promise<boolean> {
        const jwksEndpoint = (await auth.getDataLayer().getOIDCProviderMetaData()).jwks_uri;
        
        if (!jwksEndpoint || jwksEndpoint.trim().length === 0) {
            return Promise.reject(
                new AsgardeoAuthException(
                    "AUTH_HELPER-VIT-NF01",
                    "authentication-helper",
                    "validateIdToken",
                    "JWKS endpoint not found.",
                    "No JWKS endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                        "or the JWKS endpoint passed to the SDK is empty."
                )
            );
        }

        return fetch (jwksEndpoint,{
            method: "GET",
            disableAllSecurity: true,
            sslPinning: {
                certs: ["wso2carbon"], // TODO: make the certificate name configurable
              },
              headers: {
                Accept: `application/json`,
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
            .then(async (response) => {  
                if (response.status !== 200) {
                    return Promise.reject(
                        new AsgardeoAuthException(
                            "AUTH_HELPER-VIT-NR02",
                            "authentication-helper",
                            "validateIdToken",
                            "Invalid response status received for jwks request.",
                            "The request sent to get the jwks returned " + response.status + " , which is invalid."
                        )
                    );
                }

                const issuer = (await this._oidcProviderMetaData()).issuer;
                
                const issuerFromURL = (await this.resolveWellKnownEndpoint()).split("/.well-known")[0];
                
                // Return false if the issuer in the open id config doesn't match
                // the issuer in the well known endpoint URL.
                if (!issuer || issuer == issuerFromURL) {
                    
                    return Promise.resolve(false);
                }
                
                const data =JSON.parse(response.bodyString);
                
                return CryptoUtils.getJWKForTheIdToken(idToken.split(".")[0], data.keys)
                    .then(async (jwk: KeyLike) => {
                        return CryptoUtils.isValidIdToken(
                            idToken,
                            jwk,
                            (await this._config()).clientID,
                            issuer,
                            AuthenticationUtils.getAuthenticatedUserInfo(idToken).username,
                            (await this._config()).clockTolerance
                        )
                            .then(response => response)
                            
                            .catch((error) => {
                                return Promise.reject(
                                    new AsgardeoAuthException(
                                        "AUTH_HELPER-VIT-ES03",
                                        "authentication-helper",
                                        "validateIdToken",
                                        null,
                                        null,
                                        error
                                    )
                                );
                            });
                    })
                    .catch((error) => {
                        return Promise.reject(
                            new AsgardeoAuthException(
                                "AUTH_HELPER-VIT-ES04",
                                "authentication-helper",
                                "validateIdToken",
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
                        "AUTH_HELPER-VIT-NR05",
                        "authentication-helper",
                        "validateIdToken",
                        "Request to jwks endpoint failed.",
                        "The request sent to get the jwks from the server failed.",
                        error?.code,
                        error?.message,
                        error?.response?.status,
                        error?.response?.data
                    )
                );
            });
    }


    public async clearUserSessionData(): Promise<void> {
        
        await auth.getDataLayer().removeOIDCProviderMetaData();
        await auth.getDataLayer().removeTemporaryData();
        await auth.getDataLayer().removeSessionData();
    }

    public async replaceCustomGrantTemplateTags(text: string): Promise<string> {
        let scope = OIDC_SCOPE;
        const configData = await this._config();
        const sessionData = await auth.getDataLayer().getSessionData();

        if (configData.scope && configData.scope.length > 0) {
            if (!configData.scope.includes(OIDC_SCOPE)) {
                configData.scope.push(OIDC_SCOPE);
            }
            scope = configData.scope.join(" ");
        }

        return text
            .replace(TOKEN_TAG, sessionData.access_token)
            .replace(USERNAME_TAG, AuthenticationUtils.getAuthenticatedUserInfo(sessionData.id_token).username)
            .replace(SCOPE_TAG, scope)
            .replace(CLIENT_ID_TAG, configData.clientID)
            .replace(CLIENT_SECRET_TAG, configData.clientSecret);
    }

    public async handleTokenResponse(response): Promise<TokenResponse> {
        
        if (response.status !== 200) {
            return Promise.reject(
                new AsgardeoAuthException(
                    "AUTH_HELPER-HTR-NR01",
                    "authentication-helper",
                    "handleTokenResponse",
                    "Invalid response status received for token request.",
                    "The request sent to get the token returned " + response.status + " , which is invalid."
                )
            );
        }
        
        if ((await this._config()).validateIDToken) {
            const data =JSON.parse(response.bodyString);
            return this.validateIdToken(data.id_token)
                .then(async (valid) => {
                    if (valid) {
                        await auth.getDataLayer().setSessionData(data);
                        const tokenResponse: TokenResponse = {
                            accessToken: data.access_token,
                            expiresIn: data.expires_in,
                            idToken: data.id_token,
                            refreshToken: data.refresh_token,
                            scope: data.scope,
                            tokenType: data.token_type
                        };
                        
                        return Promise.resolve(tokenResponse);
                    }

                    return Promise.reject(
                        new AsgardeoAuthException(
                            "AUTH_HELPER-HTR-IV02",
                            "authentication-helper",
                            "handleTokenResponse",
                            "The id token returned is not valid.",
                            "The id token returned has failed the validation check."
                        )
                    );
                })
                .catch((error) => {
                    return Promise.reject(
                        new AsgardeoAuthException(
                            "AUTH_HELPER-HAT-ES03",
                            "authentication-helper",
                            "handleTokenResponse",
                            null,
                            null,
                            error
                        )
                    );
                });
        } else {
            
            const data =JSON.parse(response.bodyString);
            const tokenResponse: TokenResponse = {
                accessToken: data.access_token,
                expiresIn: data.expires_in,
                idToken: data.id_token,
                refreshToken: data.refresh_token,
                scope: data.scope,
                tokenType: data.token_type
            };
            
            await auth.getDataLayer().setSessionData(data)
            //await auth.getDataLayer().setSessionData((data))
            return Promise.resolve(tokenResponse);
        }
    }
}
