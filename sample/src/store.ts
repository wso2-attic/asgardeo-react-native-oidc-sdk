import "text-encoding-polyfill"
import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AsgardeoAuthClient} from '@asgardeo/auth-js';



class LocalStorage {

  async getData(key:string){
    const _value = await AsyncStorage.getItem(key)
  //console.log(_value)
    return _value
  }
   
  async setData(key:string,value:string){
      try{
      await AsyncStorage.setItem(key, value);
    }
      catch(error){
          console.log(error)
    
      }
  }

   async removeData(key:string){
      try{
      await AsyncStorage.removeItem(key)
      }
      catch(error){
          console.log(error)
      }
  }

}
const store = new LocalStorage();
export const auth =new AsgardeoAuthClient(store);


