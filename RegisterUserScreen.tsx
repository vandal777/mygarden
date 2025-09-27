import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "./lib/supabase";

export default function RegisterUserScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert(
        "Faltan datos",
        "Por favor, rellena todos los campos obligatorios."
      );
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "user",
          name,
        },
      },
    });
    if (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
      return;
    }
    // Insert into users table if user created and not already present
    const userId = data?.user?.id;
    if (userId) {
      // Verifica si el usuario ya existe en la tabla users
      const { data: userExists, error: selectError } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();
      if (selectError && selectError.code !== "PGRST116") {
        setLoading(false);
        Alert.alert("Error al verificar usuario", selectError.message);
        return;
      }
      if (userExists) {
        setLoading(false);
        Alert.alert(
          "Registro exitoso",
          "Ya existe un perfil para este usuario. Verifica tu correo electrónico para activar la cuenta."
        );
        return;
      }
      // Si no existe, inserta el perfil
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: userId,
          name,
          email,
        },
      ]);
      setLoading(false);
      if (dbError) {
        Alert.alert("Error al guardar usuario", dbError.message);
        return;
      }
      Alert.alert(
        "Registro exitoso",
        "Verifica tu correo electrónico para activar la cuenta."
      );
      return;
    } else {
      setLoading(false);
      Alert.alert("Error", "No se pudo obtener el ID de usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro particular</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre (opcional)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 28,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2196f3",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 10,
    minWidth: 180,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
