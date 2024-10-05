import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import useSocket from './src/hooks/useSocket'
import Delivery from './src/pages/Delivery'
import Orders from './src/pages/Orders'
import Settings from './src/pages/Settings'
import SignIn from './src/pages/SignIn'
import SignUp from './src/pages/SignUp'
import store from './src/store'
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
