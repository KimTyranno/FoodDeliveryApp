import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Complete from './Complete'
import Ing from './Ing'

const Stack = createNativeStackNavigator()

const Delivery = () => {
  return (
    <Stack.Navigator initialRouteName="Ing">
      {/* 지도는 로딩이 오래걸리기 때문에 지도를 로딩하고나서 다른화면으로 전환시키는게 아니라 지도위에 화면을 표시하도록 하기위함 */}
      <Stack.Screen name="Ing" component={Ing} options={{ headerShown: false }} />
      <Stack.Screen name="Complete" component={Complete} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default Delivery
