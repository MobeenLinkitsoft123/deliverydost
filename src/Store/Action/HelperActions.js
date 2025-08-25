import Geolocation from 'react-native-geolocation-service';
import { locationPermission } from '../../utils/helperFunctions';
import { GoogleApiKey } from '../../utils/ApiCallingMachnisem';
import { StaticMethods } from '../../utils/StaticMethods';

const GetLocationAndAddress = async (setData, setLoading, OnSucces) => {
    setLoading && setLoading(true);
    await locationPermission(setLoading);

    Geolocation.getCurrentPosition(
        async (position) => {
            let country, state, city, address, address2, zipCode;
            let latlng = position.coords.latitude + "," + position.coords.longitude;
            var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${GoogleApiKey}`;

            await fetch(url, { method: "GET" })
                .then((res) => res.json())
                .then((res) => {
                    if (res.results.length > 0) {
                        let arr = res.results[0].address_components;
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].types.includes("country")) {
                                country = arr[i].long_name || country;
                            }
                            if (arr[i].types.includes("administrative_area_level_1")) {
                                state = arr[i].long_name || state;
                            }
                            if (arr[i].types.includes("locality")) {
                                city = arr[i].long_name || city;
                            }
                            if (arr[i].types.includes("postal_code")) {
                                zipCode = arr[i].long_name || zipCode;
                            }
                            if (arr[i].types.includes("sublocality_level_1")) {
                                address2 = arr[i].long_name || address2;
                            }
                            if (arr[i].types.includes("route")) {
                                address2 = arr[i].long_name || address2;
                            }
                        }

                        let fullAddress = res.results[0].formatted_address;
                        let shortAddress = fullAddress;
                        if (fullAddress.includes(city)) {
                            shortAddress = fullAddress.split(city)[0].trim().replace(/,\s*$/, '');
                        }

                        address = shortAddress;

                        setData({
                            country,
                            state,
                            city,
                            zipCode,   
                            address,
                            address2: '',
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });

                        if (OnSucces) {
                            OnSucces(
                                country, state, city, setLoading,
                                position.coords.latitude, position.coords.longitude,
                                address, "", zipCode
                            );
                        } else {
                            setLoading && setLoading(false);
                        }
                    }
                })
                .catch((error) => {
                    setLoading && setLoading(false);
                    console.log('GetLocationAndAddress2', error);
                });
        },
        (err) => {
            setLoading && setLoading(false);
            console.log('GetLocationAndAddress1', err);
        },
        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 20000
        }
    );
};

const GetLocationAndAddressWithOutPermission = async (setData, setLoading, OnSucces) => {

    setLoading && setLoading(true)



    Geolocation.getCurrentPosition(
        async (position) => {
            let country, state, city, address, address2;
            let latlng = position.coords.latitude + "," + position.coords.longitude;
            var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${GoogleApiKey}`;

            await fetch(url, { method: "GET" })
                .then((res) => res.json())
                .then((res) => {
                    if (res.results.length > 0) {
                        let arr = res.results[0].address_components;
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].types.includes("country")) {
                                country = arr[i].long_name || country;
                            }
                            if (arr[i].types.includes("administrative_area_level_1")) {
                                state = arr[i].long_name || state;
                            }
                            if (arr[i].types.includes("locality")) {
                                city = arr[i].long_name || city;
                            }
                            if (arr[i].types.includes("postal_code")) {
                                zipCode = arr[i].long_name || zipCode;
                            }
                            if (arr[i].types.includes("sublocality_level_1")) {
                                address2 = arr[i].long_name || address2;
                            }
                            if (arr[i].types.includes("route")) {
                                address2 = arr[i].long_name || address2;
                            }
                        }

                        let fullAddress = res.results[0].formatted_address;
                        let shortAddress = fullAddress;
                        if (fullAddress.includes(city)) {
                            shortAddress = fullAddress.split(city)[0].trim().replace(/,\s*$/, '');
                        }

                        address = shortAddress;

                        setData({
                            country,
                            state,
                            city,
                            zipCode, 
                            address,
                            address2: '',
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });

                        if (OnSucces) {
                            OnSucces(
                                country, state, city, setLoading,
                                position.coords.latitude, position.coords.longitude,
                                address, "", zipCode
                            );
                        } else {
                            setLoading && setLoading(false);
                        }
                    }
                })
                .catch((error) => {
                    setLoading && setLoading(false);
                    console.log('GetLocationAndAddress2', error);
                });
        },
        (err) => {
            setLoading && setLoading(false);
            console.log('GetLocationAndAddress1', err);
        },
        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 20000
        }
    );
};

const getNameUrl = (name) => {
    let n = name.split('_').pop()
    return n
}

const getTwoDecimalPlacesString = (number) => {
    const num = Number(number);
    if (isNaN(num)) {
        return 0;
    }

    const roundedNum = Math.round(num * 100) / 100;
    return roundedNum.toFixed(2);
};

const getComissionValue = (type, value, bidAmount, Isfalse) => {
    if (type == 1) {
        return '$ ' + getTwoDecimalPlacesString(value)
    } else if (type == null) {
        return '$ ' + getTwoDecimalPlacesString(value)
    } else {
        return Isfalse == false ? `${value} %` : StaticMethods.getTwoDecimalPlacesString(value / 100) * bidAmount + ' %';
    }
}

const getComissionValueBidHistory = (type, value, bidAmount) => {
    if (type == 1) {
        return {
            sign: "$",
            value: getTwoDecimalPlacesString(value),
            valueAfterMinus: getTwoDecimalPlacesString((bidAmount - value))
        };
    } else {
        return {
            sign: "%",
            value: getTwoDecimalPlacesString(value),
            valueAfterMinus: getTwoDecimalPlacesString(bidAmount - ((value / 100) * bidAmount))
        };
    }
}

export {
    GetLocationAndAddress,
    getNameUrl,
    GetLocationAndAddressWithOutPermission,
    getComissionValue,
    getComissionValueBidHistory,
    getTwoDecimalPlacesString
}