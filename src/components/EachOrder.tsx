import { NavigationProp, useNavigation } from '@react-navigation/native'
import axios, { AxiosError } from 'axios'
import { useCallback, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Config from 'react-native-config'
import { useSelector } from 'react-redux'
import { LoggedInParamList } from '../../App'
import orderSlice, { Order } from '../slices/order'
import { useAppDispatch } from '../store'
import { RootState } from '../store/reducer'

const EachOrder = ({ item }: { item: Order }) => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>()
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(false)
  const accessToken = useSelector((state: RootState) => state.user.accessToken)

  const toggleDetail = useCallback(() => {
    setDetail(prev => !prev)
  }, [])

  const onAccept = useCallback(async () => {
    try {
      setLoading(true)
      await axios.post(
        `${Config.API_URL}/accept`,
        { orderId: item.orderId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      dispatch(orderSlice.actions.acceptOrder(item.orderId))
      navigation.navigate('Delivery')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        // 타인이 이미 수락한 경우
        Alert.alert('알림', error.response.data.message)
        dispatch(orderSlice.actions.rejectOrder(item.orderId))
      }
    } finally {
      setLoading(false)
    }
  }, [item, accessToken, navigation])

  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId))
  }, [item])

  return (
    <View key={item.orderId} style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text>출발동</Text>
        <Text>도착동</Text>
      </Pressable>
      {detail ? (
        <View>
          <View>
            <Text>네이버맵이 들어갈 장소</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onAccept} disabled={loading} style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable onPress={onReject} disabled={loading} style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eachInfo: {
    // flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default EachOrder
