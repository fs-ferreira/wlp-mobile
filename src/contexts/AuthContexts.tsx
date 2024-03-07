import React, { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

type AuthContextProps = {
  user: UserProps,
  isAuthenticated: boolean
  loadingAuth: boolean,
  loading: boolean
  signIn: (credentials: SignInProps) => Promise<void>,
  signOut: () => Promise<void>,
}

type UserProps = {
  user: {
    id: string,
    name: string,
    email: string,
  }
  token: string
}

type AuthProviderProps = {
  children: ReactNode
}

type SignInProps = {
  email: string,
  password: string
}

const emptyUser = {
  user: {
    id: '',
    email: '',
    name: '',
  },
  token: '',
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>(emptyUser)
  const isAuthenticated = !!user.token

  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const userInfo = await AsyncStorage.getItem('@wlpuser')
      const loadedUser: UserProps = JSON.parse(userInfo || '{}')

      if (Object.keys(loadedUser).length) {
        api.defaults.headers.common['Authorization'] = `Bearer ${loadedUser.token}`
        setUser({ ...loadedUser })
      }
      setLoading(false)
    }

    getUser()
  }, [])

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true)
    try {
      const response = await api.post('/session', {
        email, password
      })

      const { user, token }: UserProps = response.data
      const data = {
        ...response.data
      }
      await AsyncStorage.setItem('@wlpuser', JSON.stringify(data))

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser({
        user,
        token
      })
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Login successfully! Redirecting you...',
        text2Style: { fontSize: 13 }
      });
      setLoadingAuth(false)

    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err.response?.data?.error || 'Something gone wrong',
          text2Style: { fontSize: 13 }
        });
      }
      setLoadingAuth(false)
    }
  }

  async function signOut() {
    await AsyncStorage.clear().then(() => {
      setUser(emptyUser)
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      loadingAuth,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}