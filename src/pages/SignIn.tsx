import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useCallback, useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { RootStackParamList } from '../../App'

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>

const SignIn = ({ navigation }: SignInScreenProps) => {
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
  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) return Alert.alert('알림', '이메일을 입력해주세요.')
    if (!password || !password.trim()) return Alert.alert('알림', '비밀번호를 입력해주세요.')
    Alert.alert('알림', '로그인 성공')
  }, [email, password])

  const gotoSignUp = () => {
    navigation.navigate('SignUp')
  }
  return (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이메일을 입력해주세요"
          onChangeText={onChangeEmail}
          value={email}
          // 키보드에 @ 표시나오게함
          keyboardType="email-address"
          // 입력값을 자동완성 시키려고 할때 사용
          importantForAutofill="yes"
          // 인증문자 같은거 뜨게 하는것도 가능하다 (입력값이 정해져있음)
          autoComplete="email"
          textContentType="emailAddress"
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
          placeholder="비밀번호를 입력해주세요"
          onChangeText={onChangePassword}
          value={password}
          secureTextEntry
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
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
      <View></View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  // hairlineWidth는 가장 얇은데 눈에는 보이는 단위로 알아서해줌
  textInput: { padding: 5, borderBottomWidth: StyleSheet.hairlineWidth },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
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
  loginButtonText: { color: 'white', fontSize: 16 },
  buttonZone: {
    alignItems: 'center',
  },
})

export default SignIn
