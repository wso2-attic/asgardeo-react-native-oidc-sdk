# [WIP] Asgardeo React Native OIDC SDK & Samples

Repository containing the source of Asgardeo React Native OIDC SDK & Samples.

[![Stackoverflow](https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange)](https://stackoverflow.com/questions/tagged/wso2is)
[![Join the chat at https://join.slack.com/t/wso2is/shared_invite/enQtNzk0MTI1OTg5NjM1LTllODZiMTYzMmY0YzljYjdhZGExZWVkZDUxOWVjZDJkZGIzNTE1NDllYWFhM2MyOGFjMDlkYzJjODJhOWQ4YjE](https://img.shields.io/badge/Join%20us%20on-Slack-%23e01563.svg)](https://join.slack.com/t/wso2is/shared_invite/enQtNzk0MTI1OTg5NjM1LTllODZiMTYzMmY0YzljYjdhZGExZWVkZDUxOWVjZDJkZGIzNTE1NDllYWFhM2MyOGFjMDlkYzJjODJhOWQ4YjE)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/wso2/product-is/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/wso2.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=wso2)

---

:construction:&ensp;&ensp;This project is a work in progress. Please do not use this yet!

## Table of Contents

- [Introduction](#introduction)
- [Install](#install)
- [Getting Started](#getting-started)
- [Try Out the Sample Apps](#try-out-the-sample-apps)
- [APIs](#apis)
- [Develop](#develop)
  - [Prerequisites](#prerequisites)
  - [Installing Dependencies](#installing-dependencies)
- [Contribute](#contribute)
  - [Reporting Issues](#reporting-issues)
- [License](#license)

## Introduction

Asgardeo's OIDC SDK for React Native allows Mobile Applications to use OIDC or OAuth2 authentication in a simple and secure way. By using Asgardeo and the React Native OIDC SDK, Mobile application developers will be able to add identity management to their Mobile Applications with more ease.

## Install

Install the library from the npm registry.
```
npm install --save @asgardeo/auth-react-native
```

## Getting Started

You can experience the capabilities of Asgardeo React-native OIDC SDK by following this small guide which contains main
sections listed below.

- [Configuring the Identity Server](#configuring-the-identity-server)
- [Configuring the sample](#configuring-the-sample)
- [Running the sample](#running-the-sample)
  - [Running in an Android Emulator](#running-in-an-android-emulator)
  - [Running in an Android Device](#running-in-an-android-device)

### Configuring the Identity Server

1.  Start the WSO2 IS.
2.  Access WSO2 IS management console from https://localhost:9443/carbon/ and create a service provider.
    ![Management Console](https://user-images.githubusercontent.com/15249242/91068131-6fc2d380-e651-11ea-9d0a-d58c825bbb68.png)
    i. Navigate to the `Service Providers` tab listed under the `Identity` section in the management console and click `Add`.<br/>
    ii. Provide a name for the Service Provider (ex:- sampleRN-app) and click `Register`. Now you will be redirected to the
    `Edit Service Provider` page.<br/>
    iii. Expand the `Inbound Authentication Configuration` section and click `Configure` under the `OAuth/OpenID Connect Configuration` section.<br/>
    iv. Under Allowed `Grant Types` uncheck everything except `Code` and `Refresh Token`.
    v. Enter Callback URL(s) like as the following values. 

        Callback Url - http://{hostname}:{port}
        
       ##### Example (If Run Application using emulator)
       ```TypeScript
       Callback Url - http://10.0.2.2:8081
   
   vi. Check `Allow authentication without the client secret`.
   
   vii. Click `Update` to save.
   
3.  Once the service provider is saved, you will be redirected to the `Service Provider Details` page. Here, expand the
    `Inbound Authentication Configuration` section and click the `OAuth/OpenID Connect Configuration` section. Copy the
    value of `OAuth Client Key` shown here.
    ![OAuth Client Credentials](https://user-images.githubusercontent.com/15249242/91567068-27155e00-e962-11ea-8eab-b3bdd790bfd4.png)

### Configuring the sample

1. Clone/download this project from `https://github.com/asgardeo/asgardeo-react-native-oidc-sdk.git`.

2. Open the cloned project directory via code editors.

3. Add the relevant configs in LoginScreen file located in `Screen/LoginScreen` folder.

   - Replace the value of `client-id` with the value of `OAuth Client Key` property which you copied in the step 3 when
     [configuring the Identity Server](#configuring-the-identity-server).

   ```json
     const Config ={
      serverOrigin:"https://{hostname}:9443",
      signInRedirectURL:"http://{hostname}:{port}",
      clientID: "ClientID",
      SignOutURL: "http://{hostname}:{port}" (optional)
    };
   ```

   Example:

   ```json
    const Config ={
      serverOrigin:"https://10.0.2.2:9443",
      signInRedirectURL:"http://10.0.2.2:8081",
      clientID: "iMc7TiIaIFafkd5hA5xf7kGiAWUa",
      SignOutURL: "http://10.0.2.2:8081" (optional)
    };
   ```

## Try Out the Sample Apps

#### Running in an Android Emulator

1. Create a suitable Android Virtual Device by run `react-native run-android` command in project directory terminal.

2. If the WSO2 IS is hosted in the local machine, change the domain of the endpoints in the `Screen/LoginScreen - Config`
   file to “10.0.2.2”. Refer the documentation on [emulator-networking](https://developer.android.com/studio/run/emulator-networking)

3. By default IS uses a self-signed certificate. If you are using the default pack without
   changing to a CA signed certificate, follow this [guide](https://developer.android.com/training/articles/security-config) to get rid of SSL issues.

4. Change the hostname of IS as 10.0.2.2 in the <IS_HOME>/deployment.toml.<br/>
   i. Create a new keystore with CN as localhost and SAN as 10.0.2.2

   ```
   keytool -genkey -alias wso2carbon -keyalg RSA -keystore wso2carbon.jks -keysize 2048 -ext SAN=IP:10.0.2.2
   ```

   ii. Export the public certificate (name it as wso2carbon.pem)to add into the truststore.

   ```
   keytool -exportcert -alias wso2carbon -keystore wso2carbon.jks -rfc -file wso2carbon.pem
   ```

   iii. Import the certificate in the client-truststore.jks file located in `<IS_HOME>/repository/resources/security/`

   ```
   keytool -import -alias wso2is -file wso2carbon.pem -keystore client-truststore.jks -storepass wso2carbon
   ```

   iv. Now copy this public certificate (wso2carbon.pem) into the `app/src/main/res/raw` folder.

5. Select the Virtual Device to run the application.
6. Run the the module `sample` on the selected Virtual Device.

#### Running in an Android Device

1. Enable USB Debugging in the Developer Options in the Android Device. Refer documentation on
   [Run your App](https://reactnative.dev/docs/running-on-device).

2. If the WSO2 IS is hosted in the local machine, change the domain of the endpoints in the `Screen/LoginScreen - Config` file and the hostnames specified under `hostname` config in the `<IS_HOME>/repository/conf/deployment.toml` file to the IP Address of local machine.
   Make sure that both the Android Device and the local machine is connected to the same WIFI network.

3. By default IS uses a self-signed certificate. If you are using the default pack without
   changing to a CA signed certificate, follow this [guide](https://developer.android.com/training/articles/security-config) to get rid of SSL issues.

4. Change the hostname of IS as IP Address in the <IS_HOME>/deployment.toml.<br/>
   i. Create a new keystore with CN as localhost and SAN as IP Address

   ```
   keytool -genkey -alias wso2carbon -keyalg RSA -keystore wso2carbon.jks -keysize 2048 -ext SAN=IP:IP Address
   ```

   ii. Export the public certificate (name it as wso2carbon.pem)to add into the truststore.

   ```
   keytool -exportcert -alias wso2carbon -keystore wso2carbon.jks -rfc -file wso2carbon.pem
   ```

   iii. Import the certificate in the client-truststore.jks file located in `<IS_HOME>/repository/resources/security/`

   ```
   keytool -import -alias wso2is -file wso2carbon.pem -keystore client-truststore.jks -storepass wso2carbon
   ```

   iv. Now copy this public certificate (wso2carbon.pem) into the `app/src/main/res/raw` folder.

5. Connect the Android Device to the machine through a USB cable.

6. Select the Android Device as the Deployment Target.

7. Run the the module `sample` on the selected Android Device.

## APIs

The SDK provides some APIs necessary methods to implement an authentication.
  - [initialize](#initialize)
  - [getDataLayer](#getdatalayer)
  - [getAuthorizationURL](#getauthorizationurl)
  - [requestAccessTokenDetails](#requestaccesstokendetails)
  - [getSignOutUrl](#getsignouturl)
  - [SignOut](#signout)
  - [getOIDCServiceEndpoints](#getoidcserviceendpoints)
  - [getDecodedIDToken](#getdecodedidtoken)
  - [userInformation](#userinformation)
  - [revokeAccessToken](#revokeaccesstoken)
  - [refreshAccessToken](#refreshaccesstoken)
  - [getAccessToken](#getaccesstoken)
  - [isAuthenticated](#isauthenticated)
  - [getPKCECode](#getpkcecode)
  - [setPKCECode](#setpkcecode)

### initialize

```TypeScript
initialize=async(config):Promise<void> ;
```

#### Arguments

1. config:
   This config contains the ClientID, server Origin, SigINRedirectURL, SighOutRedirectUrl,and etc. This information needed to umplement the authentication.

#### Description

This method initializes the config data instance.

#### Example

```TypeScript
const Config ={
      serverOrigin:"https://10.0.2.2:9443",
      signInRedirectURL:"http://10.0.2.2:8081",
      clientID: "Client ID",
      SignOutURL: "http://10.0.2.2:8081/Login"
    };


await initialize(Config)
```

---

### getDataLayer

```TypeScript
getDataLayer= async ()
```

#### Description

This method returns DataLayer objects used by the SDK to store authentication data.

#### Example

```TypeScript
const _dataLayer = await getDataLayer();
```

---

### getAuthorizationURL

```TypeScript
getAuthorizationURL= async(config): Promise<String>
```

#### Arguments

1. config:
   This config contains the ClientID, server Origin, SigINRedirectURL, SighOutRedirectUrl,and etc. This information needed to umplement the authentication.

#### Description

This method returns a Promise resolve with the authorization URL.
Then the user can redirect to this URL to authenticate themselves and athorize the client.

#### Example

```TypeScript
getAuthorizationURL(Config).then((url) => {
     Linking.openURL(url)
}).catch((error) => {
     console.error(error);
});
```

---

### requestAccessTokenDetails

```TypeScript
requestAccessTokenDetails = (AuthUrl)
```

#### Arguments

1. AuthUrl
   This is a url. After the user signs in with using Identity server can get this url. It contains sessionState and authorizationCode these are obtained from identity server.
#### Description

This method uses the authorization code and session state to send a request to the token endpoint to obtain the acess token and the id token. The sign-in functionality can be implemented by calling the getAuthorizationURL method followed by this method.

#### Example

```TypeScript
requestAccessTokenDetails(AuthUrl).then((token)=>{
    console.log(token)
}).catch((error)=>{
    console.log(error)
});
```

---

### getSignOutUrl

```
getSignOutURL = async ()
```

#### Description

This method returns the sign-out URL to which the user should be redirected to be signed out from the server.
The user should be redirect to this URL in order to sign out from the server.

#### Example

```TypeScript
const signOutUrl = await getSignOutURL()
Linking.openURL(signOutUrl)
```

---

### SignOut

```
SignOut= (Url)
```

#### Arugument

1. Url
   This url contains state details obtainted from Identity server after the user redirect SigOutURL with Identityserver.

#### Description

This method return boolean value. This method clear the authentication data from the store and sign out from the Identity server when state is sign_out_sucess and returns true. Otherwise It returns false without any changes in store or Identity server.

#### Example

```TypeScript
_signOut = SignOut(Url)
```

---

### getOIDCServiceEndpoints

```TypeScript
getOIDCServiceEndpoints= async()
```

#### Description

This method returns the OIDC service endpoints obtained from the `.well-known` endpoint.

#### Example

```TypeScript
// This should be within an async function.
const endpoints = await getOIDCServiceEndpoints();
```

---

### getDecodedIDToken

```TypeScript
getDecodedIDToken = async()
```

#### Description

This method decodes the payload of the id token and returns the decoded values.

#### Example

```TypeScript
// This should be within an async function.
const decodedIdToken = await getDecodedIDToken();
```

---

### userInformation

```TypeScript
userInformation = async ()
```

#### Description

This method returns the basic user information obtained from the id token.

#### Example

```TypeScript
// This should be within an async function.
const UserInfo =  await userInformation();
```

---

### revokeAccessToken

```TypeScript
revokeAccessToken= async()
```

#### Description

This method clears the authentication data and sends a request to revoke the access token. You can use this method if you want to sign the user out of your application but not from the server.

#### Example

```TypeScript
revokeAccessToken().then((response)=>{
    console.log(response);
}).catch((error)=>{
    console.error(error);
})
```

---

### refreshAccessToken

```TypeScript
 refreshAccessToken = async (): Promise<TokenResponse>
```

#### Description

This method sends a refresh-token request and returns a promise that resolves with the token response that contains the token information.

#### Example

```TypeScript
refreshAccessToken().then((response)=>{
    console.log(response);
}).catch((error)=>{
    console.error(error);
})
```

---

### getAccessToken

```TypeScript
getAccessToken = async()
```

#### Description

This method returns the access token stored in the store.

#### Example

```TypeScript
// This should be used within an async function.
const accessToken = await getAccessToken();
```

---

### isAuthenticated

```TypeScript
isAuthenticated = async ()
```

#### Description

This method returns a boolean value indicating if the user is authenticated or not.

#### Example

```TypeScript
// This should be within an async function.
const isAuth = await isAuthenticated();
```

---

### getPKCECode

```TypeScript
getPKCECode = async ()
```

#### Description

This code returns the PKCE code generated when the authorization URL is generated by the [`getAuthorizationURL`](#getAuthorizationURL) method.

#### Example

```TypeScript
const pkce = getPKCECode();
```

---

### setPKCECode

```TypeScript
setPKCECode= async(pkce:string)
```

#### Arguments

1. pkce: `string`

The PKCE code generated by the [`getAuthorizationURL`](#getAuthorizationURL) method.

#### Description

This method sets the PKCE code to the store.

#### Example

```TypeScript
setPKCECode("pkce");
```

---

## Develop
### Prerequisites
-    [React Native Environment setup](https://reactnative.dev/docs/environment-setup)

## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting Issues

We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/asgardeo-react-native-oidc-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
