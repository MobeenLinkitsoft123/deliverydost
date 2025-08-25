import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message'
import { API_URL, GOOGLE_API } from "@env"

export const API = API_URL
export const GoogleApiKey = GOOGLE_API

console.log(API)
console.log(GoogleApiKey)
const InternetExcaption = async () => {
    const netInfo = await NetInfo?.fetch();

    if (netInfo?.isInternetReachable !== null) {
        if (netInfo?.isConnected == false || netInfo?.isInternetReachable == false) {
            Toast.show({
                type: 'error',
                text1: 'Check Your Internet Connection',
                position: 'bottom'
            });
        }
    }
}


const DefaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

const POST_METHOD = async (link, body, header) => {
    InternetExcaption()
    return fetch(API_URL + link, {
        method: 'POST',
        redirect: 'follow',
        headers: header ? header : DefaultHeaders,
        body: JSON.stringify(body),
    }).then(response => response.text());
};

const GET_METHOD = async (link) => {
    InternetExcaption()
    return fetch(API_URL + link, {
        method: "GET",
    }).then((res) => res.json());
};

const GETPHONE = async (link) => {
    InternetExcaption()
    return fetch(API_URL + link, {
        method: "GET",
    }).then((res) => res.text());
};

const PUT_METHOD = async (link) => {
    InternetExcaption()
    return fetch(API_URL + link, {
        method: "PUT",
    }).then((res) => res.json());
};

const GET_METHOD_AUTH = async (link, token) => {
    InternetExcaption()
    return fetch(API_URL + link, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    }).then((res) => res.json());
};

const POST_METHOD_AUTH = async (link, token, body, header) => {
    InternetExcaption()
    await fetch(API_URL + link, {
        method: "POST",
        headers: header ? header
            : {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        body: JSON.stringify(body),
    }).then((res) => res.json());
};

const POST_METHOD_AUTH2 = async (link, token, body, header) => {
    InternetExcaption()
    return fetch(API + link, {
        method: 'POST',
        headers: header
            ? header
            : {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        body: JSON.stringify(body),
    }).then(res => res.json());
};

const POST_METHOD_AUTH3 = async (link, body, header) => {
    InternetExcaption();
    return fetch(API + link, {
        method: "POST",
        redirect: "follow",
        headers: header ? header : DefaultHeaders,
        body: JSON.stringify(body),
    }).then((response) => response.text());
};

const PUT_METHOD_AUTH = async (link, token, body) => {
    InternetExcaption()
    return fetch(API_URL + link, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify(body),
    }).then((res) => res.json());
};

const DELETE_METHOD_AUTH = async (link, token) => {
    InternetExcaption()
    return fetch(API_URL + link, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    }).then((res) => res.json());
};


const FileUpload = async (link, path, header) => {
    InternetExcaption()
    const formdata = new FormData();
    formdata.append('file', {
        uri: Platform.OS === 'android' ? path.uri : path?.uri?.replace('file://', ''),
        type: path.type,
        name: path.fileName,
    });

    var requestOptions = {
        method: 'POST',
        headers: header,
        body: formdata,
        redirect: 'follow'
    };

    return fetch(API_URL + link, requestOptions)
        .then(response => response.text());
};


export {
    FileUpload,
    POST_METHOD,
    GET_METHOD,
    GETPHONE,
    PUT_METHOD,
    GET_METHOD_AUTH,
    POST_METHOD_AUTH,
    PUT_METHOD_AUTH,
    DELETE_METHOD_AUTH,
    InternetExcaption,
    POST_METHOD_AUTH2,
    POST_METHOD_AUTH3
};