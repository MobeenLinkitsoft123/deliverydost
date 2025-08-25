import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import styles from './Styles';
import HeaderAuth from '../../../Components/HeaderAuth/HeaderAuth'
import { GetCompleteOrders } from '../../../Store/Action/HistoryData';
import ItemList from './ItemList';
import Loader from '../../../Components/Modals/Modals/Loader';
import EmptyList from '../../../Components/EmptyList/EmptyList';
import AnimatedModal from '../../../Components/Modals/AnimatedModal';
import { height, verticalScale, width } from '../../../styles/responsiveSize';
import { returnUserDetailData } from '../../../utils/helperFunctions';
import CompleteOrderDetailModal from '../../../Components/Modals/Modals/CompleteOrderDetailModal'
function OrderHistory() {

  const dispatch = useDispatch();
  const focus = useIsFocused()
  const { TokenId, UserDetail } = useSelector((state) => state?.AuthReducer);
  const CompleteOrders = useSelector(state => state?.AppReducer?.CompleteOrders);
  const userDetailDecrypted = returnUserDetailData(UserDetail);

  const [loading, Setloading] = useState();
  const [loading2, Setloading2] = useState(false);
  const [orderDetailModalView, setOrderDetailModalView] = useState(false);
  const [orderDetailModalData, setOrderDetailModalData] = useState({});

  const openOrderDetailModal = (data) => {
    setOrderDetailModalView(true)
    setOrderDetailModalData(data)
  }

  useEffect(() => {
    if (focus == true) {
      GetCompleteOrders(dispatch, Setloading, userDetailDecrypted, TokenId)
    }
  }, [focus]);

  return (
    <>
      <View style={styles.container}>
        <HeaderAuth label={'Orders History'} />
        <FlatList
          data={CompleteOrders}
          refreshControl={
            <RefreshControl
              refreshing={loading2}
              onRefresh={() => GetCompleteOrders(dispatch, Setloading2, userDetailDecrypted, TokenId)}
            />
          }
          horizontal={false}
          keyExtractor={(item, index) => index.toString()}
          listKey={(item, index) => "D" + index.toString()}
          contentContainerStyle={{
            paddingBottom: verticalScale(20)
          }}
          renderItem={({ item }) => <ItemList data={item} openOrderDetailModal={openOrderDetailModal} />}
          ListEmptyComponent={() => <EmptyList msg={loading ? '' : 'Complete your first order to see here'} marginTop={100} />}
        />



      </View>
      {loading && (
        <AnimatedModal visible={loading} onClose={() => { Setloading(false) }} >
          <Loader />
        </AnimatedModal>
      )}

      {orderDetailModalView && (
        <View style={{ width: width, height: height, position: 'absolute', zIndex: 8888888 }}>
          <AnimatedModal visible={orderDetailModalView} onClose={() => setOrderDetailModalView(false)} >
            <CompleteOrderDetailModal setValue={() => setOrderDetailModalView(false)} orderDetails={orderDetailModalData} RiderNote={orderDetailModalData?.riderNote} />
          </AnimatedModal>
        </View>
      )
      }
    </>
  )
}

export default OrderHistory
