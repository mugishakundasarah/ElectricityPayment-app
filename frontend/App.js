import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Pay from './screens/Pay';
import Tokens from './screens/Tokens';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Pay" component={Pay} options={{headerTitle: "", headerShown: false}}/>
        <Stack.Screen name="Tokens" component={Tokens}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

