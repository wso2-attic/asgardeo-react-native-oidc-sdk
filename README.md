# [WIP] Asgardeo React Native OIDC SDK & Samples

Repository containing the source of Asgardeo React Native OIDC SDK & Samples.

[![Stackoverflow](https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange)](https://stackoverflow.com/questions/tagged/wso2is)
[![Discord](https://img.shields.io/badge/Join%20us%20on-Discord-%23e01563.svg)](https://discord.com/invite/Xa5VubmThw)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/wso2/product-is/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/wso2.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=wso2)

---

:construction:&ensp;&ensp;This project is a work in progress. Please do not use this yet!

## Table of Contents

- [Introduction](#introduction)
- [Install](#install)
- [Getting Started](#getting-started)
  - [Configuring the Identity Server](#configuring-the-identity-server)
  - [Configuring the Sample](#configuring-the-sample)
  - [Running the Sample App](#running-the-sample-app)
    - [Running in an Android Emulator](#running-in-an-android-emulator)
    - [Running in an Android Device](#running-in-an-android-device)
- [APIs](#apis)
  - [AuthProvider](#authprovider)
  - [useAuthContext](#useauthcontext)
  - [initialize](#initialize)
  - [getDataLayer](#getdatalayer)
  - [getAuthorizationURL](#getauthorizationurl)
  - [signIn](#signin)
  - [getAccessToken](#getaccesstoken)
  - [getBasicUserInfo](#getbasicuserinfo)
  - [getDecodedIDToken](#getdecodedidtoken)
  - [getIDToken](#getidtoken)
  - [getOIDCServiceEndpoints](#getoidcserviceendpoints)
  - [getSignOutUrl](#getsignouturl)
  - [signOut](#signout)
  - [revokeAccessToken](#revokeaccesstoken)
  - [refreshAccessToken](#refreshaccesstoken)
  - [isAuthenticated](#isauthenticated)
  - [isSignOutSuccessful](#issignoutsuccessful)
  - [requestCustomGrant](#requestcustomgrant)
  - [updateConfig](#updateconfig)
- [Develop](#develop)
  - [Prerequisites](#prerequisites)
  - [Installing Dependencies](#installing-dependencies)
- [Contribute](#contribute)
  - [Reporting Issues](#reporting-issues)
- [License](#license)

## Introduction

Asgardeo's OIDC SDK for React Native allows mobile applications to use OIDC or OAuth2 authentication in a simple and secure way. By using Asgardeo and the React Native OIDC SDK, mobile application developers will be able to add identity management to their mobile applications with more ease.

## Install

Install the library from the npm registry.
```
npm install --save @asgardeo/auth-react-native
```

## Getting Started

You can experience the capabilities of Asgardeo React-native OIDC SDK by following this small guide which contains main
sections listed below.

- [Configuring the Identity Server](#configuring-the-identity-server)
- [Configuring the Sample](#configuring-the-sample)
- [Running the Sample App](#running-the-sample-app)
  - [Running in an Android Emulator](#running-in-an-android-emulator)
  - [Running in an Android Device](#running-in-an-android-device)

### Configuring the Identity Server

1.  Start the WSO2 Identity server. If you haven't downloaded yet, please visit https://wso2.com/identity-server/ and download the latest version of the Identity server.

2. Create a service provider/ application in WSO2 IS and configure it following one of the procedures mentioned below.

#### Approach 1

1.  Login to WSO2 IS management console from https://localhost:9443/carbon/ and navigate to the **Service Providers** tab listed under the **Identity** section.

      ![Management Console](https://user-images.githubusercontent.com/15249242/91068131-6fc2d380-e651-11ea-9d0a-d58c825bbb68.png)

2. Click **Add** to add a new service provider.

3. Provide a name for the Service Provider (ex:- sampleRN-app) and click **Register**. Now you will be redirected to the **Edit Service Provider** page.

4. Expand the **Inbound Authentication Configuration** section and click **Configure** under the **OAuth/OpenID Connect Configuration** section.

5. Under Allowed **Grant Types** uncheck everything except `Code` and `Refresh Token`.

6. Enter Callback URL(s) as for the following values.

   Callback Url: `wso2sample://oauth2`

> Alternatively if you're running in an emulator, you can use `http://10.0.2.2:8081` as the callback url.

7. Check **Allow authentication without the client secret**.

8. Click **Add** button to add the OAuth configurations.

9.  Once the configurations are added, you will be redirected to the **Service Provider Details** page. Here, expand the **Inbound Authentication Configuration** section and click on the **OAuth/OpenID Connect Configuration**. Copy the value of `OAuth Client Key` shown here.

    ![OAuth Client Credentials](https://user-images.githubusercontent.com/15249242/91567068-27155e00-e962-11ea-8eab-b3bdd790bfd4.png)

10. Make sure to click the `Update` button to save the changes.

#### Approach 2

Alternatively, you can create a **Custom Application** directly from the Identity Server Console.

1. Login to WSO2 IS console from https://localhost:9443/console/login and visit **Applications** section.

2. Click on **New Application** button and select the **Custom Application** template.

3. Provide a unique name to identify your application and click **Register** to complete the registration.

4. Go to the **Access** tab and click on **New Protocol** to start adding an authentication protocol.

5. Select **OpenID Connect** from the **Quick Setup** and click on **Next**.

6. Enter the Callback URL(s) as mentioned above and click **Next**.

7. Click **Finish** to save the configurations.

8. Under **Allowed grant type** check `Code` and `Refresh Token`.

9. Check **Public client** to allow the client to authenticate without a client secret.

10. Copy the value of `Client ID`. Make sure to click `Update` button to save the configurations.

### Configuring the Sample

1. Clone/download this project from `https://github.com/asgardeo/asgardeo-react-native-oidc-sdk.git`.

2. Install the dependencies and generate the tar file by running the following command inside the `lib/` directory.

   ```
   npm pack
   ```

3. Add the relevant configuratons to the **LoginScreen** file located at `sample/screen/LoginScreen` folder.

   - Replace the value of `clientID` with the value of `OAuth Client Key` or `Client ID` which you copied in the previous section of the documentation ([configuring the Identity Server](#configuring-the-identity-server)).

      ```TypeScript
      const config = {
         serverOrigin: 'https://{hostname}:9443',
         signInRedirectURL: 'http://{hostname}:{port}',
         clientID: 'ClientID',
         SignOutURL: "http://{hostname}:{port}"  // (Optional)
      };
      ```

      Example:

      ```TypeScript
      const config = {
         serverOrigin: 'https://10.0.2.2:9443',
         signInRedirectURL: 'wso2sample://oauth2',
         clientID: 'iMc7TiIaIFafkd5hA5xf7kGiAWUa',
         SignOutURL: "http://10.0.2.2:8081"  // (Optional)
      };
      ```

4. Install the required dependencies by running the following command inside the `sample/` directory.

   ```
   npm install
   ```

## Running the Sample App

This application can be run either in an emulator or an actual device. Some configurations may differ depending on the OS.

### Android Setup

1. If the WSO2 IS is hosted in the local machine, you have to change the domain of the endpoints defined in `config` object at `screen/LoginScreen` file to `10.0.2.2`. Refer the documentation on [emulator-networking](https://developer.android.com/studio/run/emulator-networking). Next change the hostname of Identity server as `10.0.2.2` in the `<IS_HOME>/repository/conf/deployment.toml` file.

2. By default IS uses a self-signed certificate. If you ended up in SSL issues and are using the default pack without changing to a CA signed certificate, follow this [guide](https://developer.android.com/training/articles/security-config) to get rid of SSL issues.

3. Sometimes you may get `SSLHandshakeException` in android application since WSO2 IS is using a self-signed certificate. To fix this exception, you need to add the public certificate of IS to the sample application.

   i. Create a new keystore with CN as localhost and SAN as `10.0.2.2`.

   ```
   keytool -genkey -alias wso2carbon -keyalg RSA -keystore wso2carbon.jks -keysize 2048 -ext SAN=IP:10.0.2.2
   ```

   ii. Export the public certificate (ex: `wso2carbon.pem`) to add into the truststore.

   ```
   keytool -exportcert -alias wso2carbon -keystore wso2carbon.jks -rfc -file wso2carbon.pem
   ```

   iii. Import the certificate in the client-truststore.jks file located in `<IS_HOME>/repository/resources/security/`.

   ```
   keytool -import -alias wso2is -file wso2carbon.pem -keystore client-truststore.jks -storepass wso2carbon
   ```

   iv. Now copy this public certificate (`wso2carbon.pem`) to the `app/src/main/res/raw` folder.

   v. Create a new file named `network_security_config.xml` in `sample/android/app/src/main/res/xml` folder and copy the below content to it. Make sure to replace `wso2carbon` with the certificate name you added.
   
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
      <network-security-config>
         <domain-config cleartextTrafficPermitted="true">
            <domain includeSubdomains="true">localhost</domain>
            <domain includeSubdomains="true">10.0.2.2</domain>
               <trust-anchors>
                     <certificates src="@raw/wso2carbon"/>
               </trust-anchors>
            <domain includeSubdomains="true">192.168.43.29</domain>
            <base-config cleartextTrafficPermitted="true"/>
         </domain-config>
      </network-security-config>
   ```

   vi. Then add the following config to the `sample/android/app/src/main/AndroidManifest.xml` file under `application` section.

   ```xml
   android:networkSecurityConfig="@xml/network_security_config"
   ```

   Now the `AndroidManifest.xml` file should look like below.
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
      <manifest ... >
         <application
           android:networkSecurityConfig="@xml/network_security_config"
           ...
         >
            ...
         </application>
      </manifest>
   ```

#### Running in an Android Emulator

1. Create a suitable Android virtual device using the **Android virtual device manager (AVD Manager)** and launch it.

2. Build and deploy the apps by running the following command at the root directory.

   ```bash
   react-native run-android
   ```

#### Running in an Android Device

1. Enable **Debugging over USB** and plug in your device via USB.

2. Build and deploy the apps by running the following command at the root directory.

   ```bash
   react-native run-android
   ```

> If you're running in a development or debugging mode, start the Metro by running the following command.

```bash
react-native start
```

## APIs

### AuthProvider

This is a React Context Provider that provides the session state that contains information such as the authenticated user's display name, email address, etc., and the methods that are required to implement authentication in the React native app.
Like every other provider, the `AuthProvider` also encapsulates the components that would need the data provided by the provider.

---

### useAuthContext

This is a React hook that returns the session state that contains information such as the email address of the authenticated user and the methods that are required for implementing authentication.

#### Example

```typescript
const { state, initialize, signIn } = useAuthContext();
```

The object returned by the `useAuthContext` has a `state` attribute the value of which is an object of type [`AuthStateInterface`](#AuthStateInterface). You can refer the link to know more about what data is contained by the `state` object.

In addition to the `state` object, the hook also returns the following methods.

---

### initialize

```TypeScript
initialize: (config: AuthClientConfig) => Promise<void>;
```

#### Arguments

1. config: [`AuthClientConfig`](https://github.com/asgardeo/asgardeo-auth-js-sdk#authclientconfigt) The config object containing the attributes that can be used to configure the SDK. To learn more about the available attributes, refer to [`AuthClientConfig`](https://github.com/asgardeo/asgardeo-auth-js-sdk#authclientconfigt) model.

#### Description

This method initializes the auth client with the config data.

#### Example

```TypeScript
const config = {
    clientID: 'iMc7TiIaIFafkd5hA5xf7kGiAWUa',
    serverOrigin: 'https://10.0.2.2:9443',
    signInRedirectURL: 'wso2sample://oauth2'
};

await initialize(config);
```

---

### getDataLayer

```TypeScript
getDataLayer: () => Promise<DataLayer<any>>;
```

#### Returns

dataLayer: [`DataLayer`](https://github.com/asgardeo/asgardeo-auth-js-sdk#data-layer)

A `DataLayer` object which wraps the `Store` object passed during object instantiation and provides access to various types of data used by the SDK. To learn more about the various types of interfaces provide by the `DataLayer`, refer to the [Data layer](https://github.com/asgardeo/asgardeo-auth-js-sdk#data-layer).

#### Description

This method returns DataLayer objects used by the SDK to store authentication data.

#### Example

```TypeScript
const _dataLayer = await getDataLayer();
```

---

### getAuthorizationURL

```TypeScript
getAuthorizationURL: (config?: GetAuthURLConfig) => Promise<string>;
```

#### Arguments

1. config: [`GetAuthURLConfig`](https://github.com/asgardeo/asgardeo-auth-js-sdk#getauthurlconfig) (optional) Config object that has the necessary attributes to configure this method. The `forceInit` attribute can be set to `true` to trigger a request to the `.well-known` endpoint and obtain the OIDC endpoints. By default, a request to the `.well-known` endpoint will be sent only if a request to it had not been sent before. If you wish to force a request to the endpoint, you can use this attribute.

   The object can only contain key-value pairs that you wish to append as path parameters to the authorization URL. For example, to set the `fidp` parameter, you can insert `fidp` as a key and its value to this object.

#### Description

This method returns a Promise that resolves with the authorization URL. The user can be redirected to this URL to authenticate themselves and authorize the client.

#### Example

```TypeScript
getAuthorizationURL(config).then((url) => {
     Linking.openURL(url);
}).catch((error) => {
     console.error(error);
});
```

---

### signIn

```TypeScript
signIn: () => Promise<void>;
```

#### Description

As the name implies, this method is used to sign-in users. This method will work in two phases. The first phase generates the authorization url and takes the user to the single-sign-on page of the identity server, while second phase triggers the token request to complete the authentication process. So, this method should be called when the user clicks on the **Sign in** button and should listen for the authentication state for state update inorder to proceed with the signin.

#### Example

```TypeScript
signIn()
    .catch((error: any) => {
        console.log(error);
    });


useEffect(() => {
    // Steps after the authentication should come here.
    ...
}, [ state.isAuthenticated ]);
```

---

### getAccessToken

```TypeScript
getAccessToken: () => Promise<string>;
```

### Returns

accessToken: `Promise<string>` A Promise that resolves with the access token.

#### Description

This method returns the access token stored in the store.

#### Example

```TypeScript
const accessToken = await getAccessToken();
```

---

### getBasicUserInfo

```TypeScript
getBasicUserInfo: () => Promise<BasicUserInfo>;
```

#### Returns

basicUserInfo: Promise<[`BasicUserInfo`](https://github.com/asgardeo/asgardeo-auth-js-sdk#basicuserinfo)> An object containing basic user information obtained from the id token.

#### Description

This method returns the basic user information obtained from the payload. To learn more about what information is returned, checkout the [`BasicUserInfo`](https://github.com/asgardeo/asgardeo-auth-js-sdk#basicuserinfo) model.

#### Example

```TypeScript
const userInfo = await getBasicUserInfo();
```

---

### getDecodedIDToken

```TypeScript
getDecodedIDToken: () => Promise<DecodedIDTokenPayload>;
```

#### Returns

decodedIDTokenPayload: Promise<[`DecodedIDTokenPayload`](https://github.com/asgardeo/asgardeo-auth-js-sdk#decodedidtokenpayload)> The decoded ID token payload.

#### Description

This method decodes the payload of the id token and returns the decoded values.

#### Example

```TypeScript
const decodedIdToken = await getDecodedIDToken();
```

---

### getIDToken

```TypeScript
getIDToken: () => Promise<string>;
```

#### Returns

idToken: `Promise<string>` The id token.

#### Description

This method returns the id token.

#### Example

```TypeScript
const idToken = await getIDToken();
```

---

### getOIDCServiceEndpoints

```TypeScript
getOIDCServiceEndpoints: () => Promise<OIDCEndpoints>;
```

#### Returns

oidcEndpoints: Promise<[`OIDCEndpoints`](https://github.com/asgardeo/asgardeo-auth-js-sdk#oidcendpoints)>

#### Description

This method returns the OIDC service endpoints obtained from the `.well-known` endpoint.

#### Example

```TypeScript
const oidcEndpoints = await getOIDCServiceEndpoints();
```

---

### getSignOutUrl

```TypeScript
getSignOutURL: () => Promise<string>;
```

#### Returns

signOutURL: `Promise<string>` Signout url

#### Description

This method returns the sign-out URL to which the user should be redirected to be signed out from the server.
The user should be redirect to this URL in order to sign out from the server.

#### Example

```TypeScript
const signOutUrl = await getSignOutURL();
Linking.openURL(signOutUrl);
```

---

### signOut

```TypeScript
signOut: () => Promise<void>;
```

#### Description

As the name implies, this method is used to sign-out users. This method will work in two phases. The first phase obtains the signout url and takes the user to the signout page of the identity server, while second phase clears the authentication data from the store upon successful sign out redirection. So, this method should be called when the user clicks on the **Sign out** button and should listen for the authentication state for state update inorder to proceed with the signout.

#### Example

```TypeScript
signOut()
    .catch((error) => {
        console.log(error);
    });
```

---

### revokeAccessToken

```TypeScript
revokeAccessToken: () => Promise<any>;
```

#### Returns

A Promise that resolves with the response returned by the server.

#### Description

This method clears the authentication data and sends a request to revoke the access token. You can use this method if you want to sign the user out of your application but not from the server.

#### Example

```TypeScript
revokeAccessToken().then((response) => {
    console.log(response);
}).catch((error) => {
    console.error(error);
})
```

---

### refreshAccessToken

```TypeScript
refreshAccessToken: () => Promise<TokenResponse>;
```

#### Returns

A Promise that resolves with the token response that contains the token information.

#### Description

This method sends a refresh-token request and returns a promise that resolves with the token response that contains the token information. To learn more about what information is returned, checkout the [`TokenResponse`](https://github.com/asgardeo/asgardeo-auth-js-sdk#tokenresponse) model. You could listen for the authentication state for state update inorder to proceed.

#### Example

```TypeScript
refreshAccessToken()
    .catch((error) => {
        console.log(error);
    });
```

---

### isAuthenticated

```TypeScript
isAuthenticated: () => Promise<boolean>;
```

#### Returns

isAuthenticated: `Promise<boolean>` A boolean value that indicates if the user is authenticated or not.

#### Description

This method returns a boolean value indicating if the user is authenticated or not.

#### Example

```TypeScript
const isAuth = await isAuthenticated();
```

---

### isSignOutSuccessful

```TypeScript
isSignOutSuccessful: (signOutRedirectURL: string) => boolean;
```

#### Arguments

1. signOutRedirectURL: `string` The URL to which the user is redirected to after signing out from the server.

#### Description

This method returns if the user has been successfully signed out or not. When a user signs out from the server, the user is redirected to the URL specified by the `signOutRedirectURL` in the config object passed into the `initialize` function. The server appends path parameters indicating if the sign-out is successful. This method reads the URL and returns if the sign-out is successful or not. So, make sure you pass as the argument, the URL to which the user has been redirected to after signing out from the server.

#### Example

```TypeScript
const hasSignOut = isSignOutSuccessful("signOutRedirectURL");
```

---

### requestCustomGrant

```TypeScript
requestCustomGrant: (config: CustomGrantConfig) => Promise<any>;
```

#### Arguments

1. config: [`CustomGrantConfig`](https://github.com/asgardeo/asgardeo-auth-js-sdk#customgrantconfig) The config object contains attributes that would be used to configure the custom grant request. To learn more about the different configurations available, checkout the [`CustomGrantConfig`](https://github.com/asgardeo/asgardeo-auth-js-sdk#customgrantconfig) model.

#### Returns

A Promise that resolves with the token information or the response returned by the server depending on the configuration passed.

#### Description

This method can be used to send custom-grant requests to Asgardeo.

#### Example

```TypeScript
requestCustomGrant(config).then((response) => {
    console.log(response);
}).catch((error) => {
    console.error(error);
});
```

---

### updateConfig

```TypeScript
updateConfig: (config: Partial<AuthClientConfig>) => Promise<void>;
```

#### Arguments

1. config: [`AuthClientConfig`](https://github.com/asgardeo/asgardeo-auth-js-sdk#authclientconfigt) The config object containing the attributes that can be used to configure the SDK. To learn more about the available attributes, refer to [`AuthClientConfig`](https://github.com/asgardeo/asgardeo-auth-js-sdk#authclientconfigt) model.

#### Description

This method can be used to update the configurations passed into the `initialize` function. Please note that every attribute in the config object passed as the argument here is optional. Use this method if you want to update certain attributes after instantiation.

#### Example

```TypeScript
await updateConfig({
    signOutRedirectURL: "signOutRedirectURL"
});
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
