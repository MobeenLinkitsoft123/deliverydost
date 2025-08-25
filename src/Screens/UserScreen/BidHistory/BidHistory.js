import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import styles from './Styles';
import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth'
import { GetBidHistory } from '../../../Store/Action/HistoryData';
import ItemList from './ItemList';
import Loader from '../../../Components/Modals/Modals/Loader';
import EmptyList from '../../../Components/EmptyList/EmptyList';
import AnimatedModal from '../../../Components/Modals/AnimatedModal';
import { verticalScale } from '../../../styles/responsiveSize';
import { returnUserDetailData } from '../../../utils/helperFunctions';

function OrderHistory() {

    const dispatch = useDispatch();
    const focus = useIsFocused()
    const BidHistoryData = useSelector(state => state?.AppReducer?.BidHistoryData);
    const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);

    const [loading, Setloading] = useState(true);
    const [loading2, Setloading2] = useState(false);

    const userDetailDecrypted = returnUserDetailData(UserDetail);

    useEffect(() => {
        if (focus == true) {
            Setloading(true)
            GetBidHistory(dispatch, Setloading, userDetailDecrypted, TokenId)
        }
    }, [focus])

    return (
        <>
            <View style={styles.container}>
                <HeaderAuth label={'Bid History'} />


                <FlatList
                    data={BidHistoryData}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading2}
                            onRefresh={() => GetBidHistory(dispatch, Setloading2, userDetailDecrypted, TokenId)}
                        />
                    }
                    horizontal={false}
                    keyExtractor={(item, index) => index.toString()}
                    listKey={(item, index) => "D" + index.toString()}
                    contentContainerStyle={{
                        paddingBottom:verticalScale(20)
                      }}
                    renderItem={({ item }) => <ItemList data={item} />}
                    ListEmptyComponent={() => <EmptyList msg={loading ? '' : 'Place bids to see here'} marginTop={100} />}
                />

            </View>

            {loading && (
                <AnimatedModal visible={loading} onClose={() => { Setloading(false) }} >
                    <Loader />
                </AnimatedModal>
            )}

        </>
    )
}

export default OrderHistory
