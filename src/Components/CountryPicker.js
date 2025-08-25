import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import { TextInput } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import { FlatList } from 'react-native'
import { CountryData } from '../utils/CountryData'
import close from '../assets/images/close3.png'
import { ResponsiveFonts } from '../constants/ResponsiveFonts'
import colors from '../styles/colors'
import { moderateScale, verticalScale } from '../styles/responsiveSize'

const CountryPicker = ({ onClose, setCountry }) => {
    const [Data, setData] = useState(CountryData)
    const [filterData, setFilterData] = useState(Data)
    const filterdataFunction = (searchValue) => {
        const lowerCaseInput = searchValue.toLowerCase();

        let temp = Data.filter((val) => {
            return val?.name.toLowerCase().startsWith(lowerCaseInput) || val?.phone.some((phoneNumber) => phoneNumber.includes(lowerCaseInput))
        });
        setFilterData([...temp]);
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.headerBackBtn}>
                    <Image source={close} style={styles.img} resizeMode='contain' />
                </TouchableOpacity>
                <TextInput
                    style={[ResponsiveFonts.textualStyles.small, { color: colors.black, width: '88%' }]}
                    placeholder='Enter country name'
                    placeholderTextColor={colors.gray}
                    onChangeText={(e) => filterdataFunction(e)}
                />
            </View>
            <FlatList
                contentContainerStyle={styles.cont}
                data={filterData}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => {
                        setCountry(item)
                        onClose()
                    }} key={index} style={styles.listItem}>
                        <View style={{
                            height: moderateScale(25),
                            width: moderateScale(25),
                            marginRight: moderateScale(10)
                        }}>
                            <SvgUri
                                width="100%"
                                height="100%"
                                source={{ uri: item.image }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text
                            style={[ResponsiveFonts.textualStyles.small, { color: colors.black }]}
                        >{`${item?.name} (${item?.phone})`}</Text>
                    </TouchableOpacity>
                )}
            />
            {/* <ScrollView contentContainerStyle={styles.cont}>
                {filterData?.map((val, i) => (
                    

                ))}
            </ScrollView> */}
        </View>
    )
}

export default CountryPicker

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: colors.white,
        paddingTop: verticalScale(35)
    },
    header: {
        width: '95%',
        alignSelf: 'center',
        marginVertical: verticalScale(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerBackBtn: {
        height: moderateScale(30),
        width: moderateScale(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        height: '60%',
        width: '60%',
        tintColor: colors.black
    },
    cont: {
        flexGrow: 1,
        paddingVertical: verticalScale(5)
    },
    listItem: {
        width: '100%',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        paddingBottom: verticalScale(10),
        marginBottom: verticalScale(10),
        paddingHorizontal: moderateScale(10),
        flexDirection: 'row',
        alignItems: 'center'
    }
})