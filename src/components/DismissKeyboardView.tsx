import React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native'

// React 18부터 변경됐다함
interface Props {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const DismissKeyboardView: React.FC<Props> = ({ children, ...props }) => (
  // TouchableWithoutFeedback는 터치를해도 아무런반응을 하지않는 컴포넌트
  // onPress={Keyboard.dismiss} 를 설정하므로써 입력창 이외의 영역을 터치하면 키보드가 내려가게끔 한다
  // 근데 TouchableWithoutFeedback가 아니고 Pressable써도 같은것 같음..
  // accessible은 장애인을 위한 접근성을 비활성화 시키는것 (지금 이 캄포넌트는 키보드를 내리기위함이기 때문에 비활성화)
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    {/* KeyboardAvoidingView는 키보드에 의해 입력필드가 가려졌을때 올라오게해서 보이게끔함 */}
    <KeyboardAvoidingView
      {...props}
      style={props.style}
      behavior={Platform.OS === 'android' ? 'position' : 'padding'}>
      {children}
    </KeyboardAvoidingView>
    {/* 만약 keyboardAvoidingView가 이상하게 작동하면 KeyboardAwareScrollView 라는 라이브러리를 쓰면된다 */}
    {/* <KeyboardAwareScrollView {...props} style={props.style}>
      {children}
    </KeyboardAwareScrollView> */}
  </TouchableWithoutFeedback>
)

export default DismissKeyboardView
