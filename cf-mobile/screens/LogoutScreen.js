import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { auth } from '../firebase';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    auth.signOut().then(() => {
      navigation.navigate('Login');
    });
  }, []);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
}
