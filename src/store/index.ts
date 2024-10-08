import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rootReducer from './reducer'

const store = configureStore({
  reducer: rootReducer,
  // flipper 적용할때 참고
  // middleware: getDefaultMiddleware => {
  //   if (__DEV__) {
  //     const createDebugger = require('redux-flipper').default
  //     return getDefaultMiddleware().concat(createDebugger())
  //   }
  //   return getDefaultMiddleware()
  // },
})
export default store

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
