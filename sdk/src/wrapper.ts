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

import "text-encoding-polyfill";
import { AsgardeoAuthClient, Store } from "@asgardeo/auth-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNativeCryptoUtils } from "./crypto-utils";

/**
 * Create a Store class to store the authentication data. 
 * The following implementation uses the async-storage.
 */
class LocalStorage implements Store {

    /**
     * Get the data from the store.
     * 
     * @param {string} key - key.
     *
     */
    async getData(key: string) {

        const _value = await AsyncStorage.getItem(key);

        return _value;
    }

    /**
     * Save the data into the store.
     * 
     * @param {string} key - key.
     * @param {string} value - value.
     * 
     * @return {Promise<void>}
     */
    async setData(key: string, value: string): Promise<void> {

        try {
            await AsyncStorage.setItem(key, value);
        }
        catch(error) {
            // eslint-disable-next-line no-console
            console.log("Error when setting item to the storage", error);
        }
    }

    /**
     * Remove the data from the store.
     * 
     * @param {string} key - key.
     * @return {Promise<void>}
     */
    async removeData(key: string): Promise<void> {

        try {
            await AsyncStorage.removeItem(key);
        }
        catch(error) {
            // eslint-disable-next-line no-console
            console.log("Error when removing item from the storage", error);
        }
    }
}

// Instantiate wrapper objects.
const store = new LocalStorage();
const cryptoUtils = new ReactNativeCryptoUtils();

export const auth = new AsgardeoAuthClient(store, cryptoUtils);
