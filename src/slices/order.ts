import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Order = {
  orderId: string
  start: {
    latitude: number
    longitude: number
  }
  end: {
    latitude: number
    longitude: number
  }
  price: number
}

const initialState: { orders: Order[]; deliveries: Order[] } = {
  // 서버에서 받은 주문
  orders: [],
  // 수락한 주문
  deliveries: [],
}
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload)
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const orderIdx = state.orders.findIndex(order => order.orderId === action.payload)
      if (orderIdx > -1) {
        state.deliveries.push(state.orders[orderIdx])
        state.orders.splice(orderIdx, 1)
      }
    },
    rejectOrder(state, action: PayloadAction<string>) {
      const orderIdx = state.orders.findIndex(order => order.orderId === action.payload)
      if (orderIdx > -1) {
        state.orders.splice(orderIdx, 1)
      }
      const deliveryIdx = state.deliveries.findIndex(order => order.orderId === action.payload)
      if (deliveryIdx > -1) {
        state.deliveries.splice(deliveryIdx, 1)
      }
    },
  },
  // extraReducer는 비동기액션 (그냥 reducer는 동기액션이다)
  extraReducers: builder => {},
})

export default orderSlice
