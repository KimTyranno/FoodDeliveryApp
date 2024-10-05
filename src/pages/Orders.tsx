import { useCallback } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import EachOrder from '../components/EachOrder'
import { Order } from '../slices/order'
import { RootState } from '../store/reducer'

const Orders = () => {
  const orders = useSelector((state: RootState) => state.order.orders)

  // renderItem의 매개변수는 item이라는 이름으로 정해져있는듯
  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <EachOrder item={item} />
  }, [])
  return <FlatList data={orders} keyExtractor={order => order.orderId} renderItem={renderItem} />
}

export default Orders
