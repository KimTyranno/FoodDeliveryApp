import axios, { AxiosError } from 'axios'
import React, { useCallback, useEffect } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import Config from 'react-native-config'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useSelector } from 'react-redux'
import userSlice from '../slices/user'
import { useAppDispatch } from '../store'
import { RootState } from '../store/reducer'

function Settings() {
  const { name, money } = useSelector((state: RootState) => state.user)
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  const dispatch = useAppDispatch()
  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      Alert.alert('알림', '로그아웃 되었습니다.')
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      )
      await EncryptedStorage.removeItem('refreshToken')
    } catch (error) {
      const errorResponse = (error as AxiosError).response
      console.error(errorResponse)
    }
  }, [accessToken, dispatch])

  useEffect(() => {
    async function getMoney() {
      const response = await axios.get(`${Config.API_URL}/showmethemoney`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      dispatch(userSlice.actions.setMoney(response.data.data))
    }
    getMoney()
  }, [accessToken, dispatch])

  return (
    <View>
      <View style={styles.money}>
        <Text style={styles.moneyText}>
          {name}님의 수익금{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {/* 숫자 3자리마다 콤마찍는 정규식 */}
            {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Text>
          원
        </Text>
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={StyleSheet.compose(styles.loginButton, styles.loginButtonActive)}
          onPress={onLogout}>
          <Text style={styles.loginButtonText}>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  money: {
    padding: 20,
  },
  moneyText: {
    fontSize: 16,
  },
  buttonZone: {
    alignItems: 'center',
    paddingTop: 20,
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default Settings
