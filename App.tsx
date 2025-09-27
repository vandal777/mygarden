import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { View, ActivityIndicator, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { supabase } from "./lib/supabase";
import HomeScreen from "./HomeScreen";
import HomeCompanyScreen from "./HomeCompanyScreen";
import DetailScreen from "./DetailScreen";
import ProfileScreen from "./ProfileScreen";
import OnboardingScreen from "./OnboardingScreen";
import LoginScreen from "./LoginScreen";
import UserDataScreen from "./UserDataScreen";
import SelectUserTypeScreen from "./SelectUserTypeScreen";
import RegisterCompanyScreen from "./RegisterCompanyScreen";
import RegisterUserScreen from "./RegisterUserScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<null | Record<string, any>>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setSession(session);
      }
    );

    // Manejo de magic link/deep link para confirmación de email
    const handleDeepLink = async (event) => {
      const url = event.url;
      const { queryParams } = Linking.parse(url);
      const { access_token, refresh_token } = queryParams;
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        Alert.alert(
          "¡Email confirmado!",
          "Tu correo ha sido verificado correctamente. Ahora puedes usar la app.",
          [
            {
              text: "OK",
              onPress: async () => {
                // Redirige al Home automáticamente
                setTimeout(async () => {
                  const { data } = await supabase.auth.getSession();
                  setSession(data.session);
                }, 500);
              },
            },
          ]
        );
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Iniciar sesión" }}
          />
          <Stack.Screen
            name="SelectUserType"
            component={SelectUserTypeScreen}
            options={{ title: "Tipo de usuario" }}
          />
          <Stack.Screen
            name="RegisterCompany"
            component={RegisterCompanyScreen}
            options={{ title: "Registro empresa" }}
          />
          <Stack.Screen
            name="RegisterUser"
            component={RegisterUserScreen}
            options={{ title: "Registro particular" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Detectar tipo de usuario
  const userRole = session?.user?.user_metadata?.role;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={userRole === "company" ? HomeCompanyScreen : HomeScreen}
          options={{
            title:
              userRole === "company" ? "Panel empresa" : "Jardinerías cercanas",
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: "Detalle de jardinería" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Perfil" }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ title: "Onboarding del cliente" }}
        />
        <Stack.Screen
          name="UserData"
          component={UserDataScreen}
          options={{ title: "Datos de usuario" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
