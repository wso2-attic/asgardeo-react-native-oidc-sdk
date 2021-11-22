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

import React, { useState } from 'react';

const initialState = {
    accessToken: '',
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
    sub: ''
};

const LoginContext = React.createContext();

const LoginContextProvider = (props) => {
    const [loginState, setLoginState] = useState(initialState);

    return (
        <LoginContext.Provider
            value = {{
                loginState,
                setLoginState
            }}
        >
            {props.children}
        </LoginContext.Provider>
    )
}

export { initialState, LoginContext, LoginContextProvider };
