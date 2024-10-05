import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import axios, { AxiosError } from 'axios'
import * as React from 'react'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import Config from 'react-native-config'
import EncryptedStorage from 'react-native-encrypted-storage'
import { Provider, useSelector } from 'react-redux'
import useSocket from './src/hooks/useSocket'
import Delivery from './src/pages/Delivery'
import Orders from './src/pages/Orders'
import Settings from './src/pages/Settings'
import SignIn from './src/pages/SignIn'
import SignUp from './src/pages/SignUp'
import userSlice from './src/slices/user'
import store, { useAppDispatch } from './src/store'
import { RootState } from './src/store/reducer'

export type LoggedInParamList = {
  Orders: undefined
  Settings: undefined
  Delivery: undefined
  Complete: { orderId: string }
}

export type RootStackParamList = {
  SignIn: undefined
  SignUp: undefined
}

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email)
  const [socket, disconnect] = useSocket()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const callback = (data: any) => {
      console.log(data)
    }

    if (socket && isLoggedIn) {
      // emit은 서버에 데이터를 보낼때
      socket.emit('acceptOrder', 'hello')
      // on은 서버에서 데이터를 받을때
      socket.on('order', callback)
    }

    return () => {
      if (socket) {
        socket.off('order', callback)
      }
    }
  }, [isLoggedIn, socket])

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn)
      disconnect()
    }
  }, [isLoggedIn, disconnect])

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken')
        if (!token) {
          return
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        )
      } catch (error) {
        console.error(error)
        if (error instanceof AxiosError && error.response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.')
        }
      } finally {
        // TODO: 스플래시 스크린 없애기
      }
    }
    getTokenAndRefresh()
  }, [dispatch])

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="Orders" component={Orders} options={{ title: '오더 목록' }} />
          <Tab.Screen name="Delivery" component={Delivery} options={{ headerShown: false }} />
          <Tab.Screen name="Settings" component={Settings} options={{ title: '내 정보' }} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignIn} options={{ title: '로그인' }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ title: '회원가입' }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}
function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  )
}

export default App
