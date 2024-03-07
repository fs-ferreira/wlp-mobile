import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { AuthContext } from "../../contexts/AuthContexts";

export default function SignIn() {
  const { signIn, loadingAuth } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    if (!email || !password) {
      return
    }

    await signIn({ email, password })
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/logo.png')} />
      <View style={styles.inputContainer}>
        <TextInput placeholderTextColor="#a3a3a3"
          style={styles.input}
          placeholder="Type your email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput placeholderTextColor="#a3a3a3"
          style={styles.input}
          placeholder="Type your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loadingAuth
            ? (<ActivityIndicator size={24} color="#dc2626" />)
            : (<Text style={styles.buttonText}>Sign in</Text>)
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  logo: {
    marginBottom: 18
  },
  inputContainer: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 12
  },
  input: {
    width: '95%',
    height: 48,
    backgroundColor: 'transparent',
    color: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 12,
  },
  button: {
    width: '95%',
    height: 48,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#fef2f2"
  }
})