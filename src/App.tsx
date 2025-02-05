import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import { TimeOption } from './types/game';

export type RootStackParamList = {
  Home: undefined;
  Game: { words: string[]; timeout: TimeOption };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Word Tilt Game' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: 'Play Game' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
