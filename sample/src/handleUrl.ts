import url from 'url';
import {requestAccessToken,getDataLayer} from './authenticate'
import { auth } from './store';

export const SignInHandleUrl = (Authurl,config) =>{
    let urlObject = url.parse(Authurl.url);
    const data_list =urlObject.query.split('&')
    const code =data_list[0].split('=')[1]
    const session_state =data_list[1].split('=')[1]

    return requestAccessToken(code,session_state,config)

}

export const SignOutHandleUrl = (Authu) =>{

    const data_list = url.parse(Authu.url).query.split('&')
    const state =data_list[0].split('=')[1]
    if (state=="sign_out_success"){
        auth.getDataLayer().removeOIDCProviderMetaData();
        auth.getDataLayer().removeTemporaryData();
        auth.getDataLayer().removeSessionData();
        console.log(auth.getDataLayer().getSessionData())
       return true;
    }else{
        return false;
    }
    

}