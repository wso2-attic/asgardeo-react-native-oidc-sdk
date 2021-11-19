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

import "text-encoding-polyfill"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsgardeoAuthClient } from '@asgardeo/auth-js';

// Create a Store class to store the authentication data. The following implementation uses the async-storage.
class LocalStorage {

    // Get the data from the store.
    async getData(key:string) {

        const _value = await AsyncStorage.getItem(key);
        return _value;
    }

    // Save the data into the store.
    async setData(key:string,value:string) {

        try {
            await AsyncStorage.setItem(key, value);
        }
        catch(error) {
            console.log(error);
        }
    }

    // Remove the data from the store.
    async removeData(key:string) {

        try {
            await AsyncStorage.removeItem(key);
        }
        catch(error) {
            console.log(error);
        }
    }
}

// Instantiate the LocalStore class.
const store = new LocalStorage();

// Instantiate the AsgardeoAuthClient and pass the store object as an argument into the constructor of 
// the asgardeo-auth-js sdk.
export const auth = new AsgardeoAuthClient(store);
