import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import RoutePage from './screens/RoutePage';
import StatisticsPage from './screens/StatisticsPage';
import LogoutScreen from './screens/LogoutScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {user ? (
          <>
            <Tab.Screen 
              name="Route" 
              component={RoutePage} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="navigate-outline" color={color} size={size} />
                ),
              }} 
            />
            <Tab.Screen 
              name="Statistics" 
              component={StatisticsPage} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="stats-chart-outline" color={color} size={size} />
                ),
              }} 
            />
            <Tab.Screen 
              name="Logout" 
              component={LogoutScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-out-outline" color={color} size={size} />
                ),
              }} 
            />
          </>
        ) : (
          <>
            <Tab.Screen 
              name="Login" 
              component={LoginPage} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-in-outline" color={color} size={size} />
                ),
              }} 
            />
            <Tab.Screen 
              name="Register" 
              component={RegisterPage} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-add-outline" color={color} size={size} />
                ),
              }} 
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Loading...</Text>
  </View>
);
