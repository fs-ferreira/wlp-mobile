import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Routes from './src/routes';
import { AuthProvider } from './src/contexts/AuthContexts';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar
          backgroundColor="#121212"
          barStyle={'light-content'}
          translucent={false}
        />
        <Routes />
        <Toast />
      </AuthProvider>
    </NavigationContainer>
  );
}
