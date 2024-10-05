import { NativeStackScreenProps } from '@react-navigation/native-stack'
import axios, { AxiosError } from 'axios'
import React, { useCallback, useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Config from 'react-native-config'
import EncryptedStorage from 'react-native-encrypted-storage'
import { RootStackParamList } from '../../App'
import DismissKeyboardView from '../components/DismissKeyboardView'
import userSlice from '../slices/user'
import { useAppDispatch } from '../store'

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>

const SignIn = ({ navigation }: SignInScreenProps) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const emailRef = useRef<TextInput | null>(null)
  const passwordRef = useRef<TextInput | null>(null)

  const onChangeEmail = (text: string) => {
    setEmail(text.trim())
  }
  const onChangePassword = (text: string) => {
    setPassword(text.trim())
  }

  const canLogin = email && password
  const onSubmit = useCallback(async () => {
    if (loading) {
      return
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.')
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.')
    }
    try {
      setLoading(true)
      const response = await axios.post(`${Config.API_URL}/login`, {
        email,
        password,
      })
      console.log(response.data)
      Alert.alert('알림', '로그인 되었습니다.')
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      )
      // 토큰을 암호화 시켜서 저장
      await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response)
        Alert.alert('알림', error.response?.data.message)
      }
    } finally {
      setLoading(false)
    }
  }, [loading, dispatch, email, password])

  const gotoSignUp = () => {
    navigation.navigate('SignUp')
  }
  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이메일을 입력해주세요"
          onChangeText={onChangeEmail}
          value={email}
          placeholderTextColor="#666"
          // 키보드에 @ 표시나오게함
          keyboardType="email-address"
          // 입력값을 자동완성 시키려고 할때 사용
          importantForAutofill="yes"
          // 인증문자 같은거 뜨게 하는것도 가능하다 (입력값이 정해져있음)
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          // 엔터쳤을때 다음항목으로 넘어가는거 (returnKeyType="next"가 안먹힐때 쓰면됨)
          onSubmitEditing={() => {
            passwordRef.current?.focus()
          }}
          // 엔터쳐서 다음항목으로 갈때 키보드가 내려가는거 방지
          blurOnSubmit={false}
          ref={emailRef}
          // 입력창 우측에 X 버튼 표시해서 누르면 다 지워지게함(IOS전용)
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
          placeholderTextColor="#666"
          onChangeText={onChangePassword}
          value={password}
          secureTextEntry
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          onPress={onSubmit}
          style={
            // 배열로 스타일을 적용하면 뒤에있는애(loginButtonActive)가 우선순위가 높다
            // StyleSheet.compose(styles.loginButton, styles.loginButtonActive) 라고 써도된다
            canLogin ? [styles.loginButton, styles.loginButtonActive] : styles.loginButton
          }
          disabled={!canLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={gotoSignUp}>
          <Text>회원가입</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  )
}

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
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

export default SignIn
