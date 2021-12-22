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

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    body: {
        margin: 10
    },

    button: {
        marginLeft: "35%",
        width: "30%"
    },

    deco: {
        fontWeight: "bold",
        margin: 10,
        textAlign: "center"
    },

    flex: {
        backgroundColor: "#e2e2e2",
        borderColor: "#c5c5c5",
        borderWidth: 1
    },

    flexBody: {
        fontWeight: "bold",
        marginLeft: 10
    },

    flexContainer: {
        flex: 1,
        flexDirection: "column",
        paddingBottom: 70
    },

    flexDetails: {
        marginBottom: 10,
        marginLeft: 10
    },

    flexHeading: {
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center"
    },

    footer: {
        alignItems: "center",
        paddingTop: 45
    },

    footerAlign: {
        height: 20,
        width: 50
    },

    image: {
        borderRadius: 30,
        height: "60%",
        resizeMode: "contain",
        width: "85%"
    },

    imageAlign: {
        alignItems: "center"
    },

    loading: {
        alignItems: "center",
        backgroundColor: "#F5FCFF88",
        bottom: 0,
        justifyContent: "center",
        left: 0,
        position: "absolute",
        right: 0,
        top: 0
    },

    mainBody: {
        backgroundColor: "#0000"
    },

    refBody: {
        textAlign: "center"
    },

    refToken: {
        marginBottom: 10,
        textAlign: "center"
    },

    text: {
        backgroundColor: "#f47421",
        borderBottomColor: "#e2e2e2",
        borderBottomWidth: 2,
        color: "white",
        fontSize: 25,
        justifyContent: "center",
        textAlign: "center"
    },

    textStyle: {
        color: "blue",
        textDecorationLine: "underline"
    },

    textpara: {
        borderBottomColor: "#282c34",
        color: "#2A2A2A",
        fontSize: 18,
        justifyContent: "center",
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: "justify"
    }
});

export { styles };
