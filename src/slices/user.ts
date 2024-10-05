import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  money: 0,
  accessToken: '',
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email
      state.name = action.payload.name
      state.accessToken = action.payload.accessToken
    },
    setMoney(state, action) {
      state.money = action.payload
    },
  },
  // extraReducer는 비동기액션 (그냥 reducer는 동기액션이다)
  extraReducers: builder => {},
})

export default userSlice
