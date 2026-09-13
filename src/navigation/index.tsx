import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { COLORS, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import PetProfileScreen from '../screens/PetProfileScreen';
import PetFormScreen from '../screens/PetFormScreen';
import VaccinesScreen from '../screens/VaccinesScreen';
import VaccineFormScreen from '../screens/VaccineFormScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ConsultaFormScreen from '../screens/ConsultaFormScreen';
import CheckupScreen from '../screens/CheckupScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import RemindersScreen from '../screens/RemindersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditAccountScreen from '../screens/EditAccountScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import VetHomeScreen from '../screens/VetHomeScreen';
import VetConsultasScreen from '../screens/VetConsultasScreen';
import VetPrescricoesScreen from '../screens/VetPrescricoesScreen';
import VetSettingsScreen from '../screens/VetSettingsScreen';

const Stack = createNativeStackNavigator();
const VetStackNav = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Signup" component={SignupScreen} />
    </AuthStackNav.Navigator>
  );
}

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 2,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 60,
  },
  iconWrapperActive: {
    backgroundColor: COLORS.primaryPastel,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 72,
          paddingBottom: 8,
          paddingTop: 4,
          ...SHADOWS.lg,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Início" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="PetProfile"
        component={PetProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🐾" label="Pet" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Checkup"
        component={CheckupScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="❤️" label="Saúde" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💊" label="Remédios" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Config" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.white,
  },
  headerShadowVisible: false,
  headerTitleStyle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
  },
  headerTintColor: COLORS.primary,
  headerBackTitle: '',
  contentStyle: {
    backgroundColor: COLORS.background,
  },
};

function AppStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {/* Main Tabs */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PetForm"
        component={PetFormScreen}
        options={{ title: 'Cadastro do Pet' }}
      />
      <Stack.Screen
        name="Vaccines"
        component={VaccinesScreen}
        options={{ title: 'Carteira de Vacinas' }}
      />
      <Stack.Screen
        name="VaccineForm"
        component={VaccineFormScreen}
        options={{ title: 'Vacina' }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Histórico Clínico' }}
      />
      <Stack.Screen
        name="Medications"
        component={RemindersScreen}
        options={{ title: 'Medicamentos' }}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{ title: 'Editar dados' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Alterar senha' }}
      />
      <Stack.Screen
        name="ConsultaForm"
        component={ConsultaFormScreen}
        options={{ title: 'Consulta' }}
      />
      <Stack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          title: 'Emergência',
          headerStyle: { backgroundColor: COLORS.danger },
          headerTitleStyle: {
            fontSize: FONT_SIZES.lg,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.white,
          },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
}

function VetTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 72,
          paddingBottom: 8,
          paddingTop: 4,
          ...SHADOWS.lg,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="VetHome"
        component={VetHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🗓️" label="Agenda" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="VetConsultas"
        component={VetConsultasScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🩺" label="Consultas" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="VetPrescricoes"
        component={VetPrescricoesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💊" label="Receitas" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="VetSettings"
        component={VetSettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Config" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function VetStack() {
  return (
    <VetStackNav.Navigator screenOptions={screenOptions}>
      <VetStackNav.Screen
        name="VetTabs"
        component={VetTabs}
        options={{ headerShown: false }}
      />
    </VetStackNav.Navigator>
  );
}

export default function AppNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {user.role === 'VETERINARIO' ? <VetStack /> : <AppStack />}
    </NavigationContainer>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
