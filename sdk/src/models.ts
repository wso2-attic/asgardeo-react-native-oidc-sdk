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

import {
    AuthClientConfig,
    BasicUserInfo,
    DataLayer,
    DecodedIDTokenPayload,
    GetAuthURLConfig,
    OIDCEndpoints,
    TokenResponse
} from "@asgardeo/auth-js";

export interface AuthStateInterface {
    accessToken: string;
    idToken: string;
    expiresIn: string;
    scope: string;
    refreshToken: string;
    tokenType: string;
    isAuthenticated: boolean;
}

export interface AuthContextInterface {
    state: AuthStateInterface;
    initialize: (config: AuthClientConfig) => Promise<void>;
    getDataLayer: () => Promise<DataLayer<any>>;
    getAuthorizationURL: (config: GetAuthURLConfig) => Promise<string>;
    signIn: () => Promise<void>;
    refreshAccessToken: () => Promise<TokenResponse>;
    getSignOutURL: () => Promise<string>;
    signOut: () => Promise<void>;
    getOIDCServiceEndpoints: () => Promise<OIDCEndpoints>;
    getDecodedIDToken: () => Promise<DecodedIDTokenPayload>;
    userInformation: () => Promise<BasicUserInfo>;
    revokeAccessToken: () => Promise<any>;
    getAccessToken: () => Promise<string>;
    getIDToken: () => Promise<string>;
    isAuthenticated: () => Promise<boolean>;
    getPKCECode: () => Promise<string>;
    setPKCECode: (pkce: string) => Promise<void>;
}

export type AuthUrl = {
    url: string
}
