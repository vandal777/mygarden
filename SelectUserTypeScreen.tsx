import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SelectUserTypeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo quieres registrarte?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RegisterCompany")}
      >
        <Text style={styles.buttonText}>Empresa de jardinería</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RegisterUser")}
      >
        <Text style={styles.buttonText}>Particular</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196f3",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 18,
    minWidth: 220,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
