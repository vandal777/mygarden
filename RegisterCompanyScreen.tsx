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

export default function RegisterCompanyScreen({ navigation }: any) {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [personalName, setPersonalName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!companyName || !email || !personalName || !phone || !password) {
      Alert.alert("Faltan datos", "Por favor, rellena todos los campos.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "company",
          company_name: companyName,
          personal_name: personalName,
          phone,
        },
      },
    });
    if (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
      return;
    }
    // Insert into companies table if user created
    const userId = data?.user?.id;
    if (userId) {
      const { error: dbError } = await supabase.from("companies").insert([
        {
          id: userId,
          company_name: companyName,
          personal_name: personalName,
          phone,
          email,
        },
      ]);
      setLoading(false);
      if (dbError) {
        Alert.alert("Error al guardar empresa", dbError.message);
        return;
      }
      Alert.alert(
        "Registro exitoso",
        "Verifica tu correo electrónico para activar la cuenta."
      );
      navigation.replace("Login");
    } else {
      setLoading(false);
      Alert.alert("Error", "No se pudo obtener el ID de usuario.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro empresa de jardinería</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la empresa"
        value={companyName}
        onChangeText={setCompanyName}
      />
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
        placeholder="Nombre y apellido del responsable"
        value={personalName}
        onChangeText={setPersonalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono de contacto"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
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
