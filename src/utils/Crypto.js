import CryptoJS from 'react-native-crypto-js';
import { EncryptionKey } from "@env"

var key = CryptoJS.enc.Utf8.parse(EncryptionKey);
var iv = CryptoJS.enc.Utf8.parse(EncryptionKey);
const encryptVal = (encryptedValue) => {
  return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(encryptedValue), key,
  {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
};

const decryptVale = (encryptedValue) => {

  try {
    return CryptoJS.AES.decrypt(encryptedValue, key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
    ).toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.log('decryptVale=====>', error);
  }

};

export {
  decryptVale,
  encryptVal,
}