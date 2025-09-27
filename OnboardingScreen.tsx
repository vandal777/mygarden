import React, { useState } from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { supabase } from "./lib/supabase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

const previousJobs = [
  "Corte de césped",
  "Poda de setos",
  "Riego automático",
  "Limpieza de jardín",
  "Instalación de césped artificial",
];

export default function OnboardingScreen({ navigation }: any) {
  const [parkingEase, setParkingEase] = useState<string>("");
  const [parkingSpots, setParkingSpots] = useState("");
  const [gardenLocation, setGardenLocation] = useState<string>("");
  const [balconyJob, setBalconyJob] = useState("");
  const [vanGarageAccess, setVanGarageAccess] = useState<string>("");
  const [distanceToGarden, setDistanceToGarden] = useState("");
  const [lastJob, setLastJob] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      Alert.alert("Error", "No se ha encontrado el usuario autenticado.");
      setLoading(false);
      return;
    }
    // Verificar si ya existe registro
    const { data: existing, error: existError } = await supabase
      .from("userdata")
      .select("id")
      .eq("user_id", user.user.id);
    if (existError) {
      Alert.alert(
        "Error",
        existError.message || "Error al comprobar el registro previo."
      );
      setLoading(false);
      return;
    }
    if (existing && existing.length > 0) {
      Alert.alert(
        "Ya registrado",
        "Ya existe un registro de datos para este usuario. Solo puedes modificarlo desde tu perfil."
      );
      setLoading(false);
      return;
    }
    // Si no existe, guardar
    const { error: insertError } = await supabase.from("userdata").insert([
      {
        user_id: user.user.id,
        parking_ease: parkingEase,
        parking_spots: parkingSpots,
        garden_location: gardenLocation,
        balcony_job: balconyJob,
        van_garage_access: vanGarageAccess,
        distance_to_garden: distanceToGarden,
        last_job: lastJob,
      },
    ]);
    setLoading(false);
    if (insertError) {
      Alert.alert(
        "Error",
        insertError.message || "No se han podido guardar los datos."
      );
    } else {
      Alert.alert(
        "Onboarding completado",
        "Tus preferencias han sido guardadas."
      );
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { flexGrow: 1, paddingBottom: 40 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Onboarding del cliente</Text>

        {/* Aparcamiento */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="local-parking" size={24} color="#2196f3" />
            <Text style={styles.cardTitle}>¿Hay facilidad para aparcar?</Text>
          </View>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[
                styles.chip,
                parkingEase === "yes" && styles.chipSelected,
              ]}
              onPress={() => setParkingEase("yes")}
            >
              <Text style={styles.chipText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, parkingEase === "no" && styles.chipSelected]}
              onPress={() => setParkingEase("no")}
            >
              <Text style={styles.chipText}>No</Text>
            </TouchableOpacity>
          </View>
          {parkingEase === "yes" && (
            <TextInput
              style={styles.input}
              placeholder="¿Cuántas plazas?"
              keyboardType="numeric"
              value={parkingSpots}
              onChangeText={setParkingSpots}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          )}
        </View>

        {/* Ubicación jardín */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="tree" size={22} color="#4caf50" />
            <Text style={styles.cardTitle}>¿Dónde está el jardín?</Text>
          </View>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[
                styles.chip,
                gardenLocation === "indoor" && styles.chipSelected,
              ]}
              onPress={() => setGardenLocation("indoor")}
            >
              <Text style={styles.chipText}>Interior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                gardenLocation === "outdoor" && styles.chipSelected,
              ]}
              onPress={() => setGardenLocation("outdoor")}
            >
              <Text style={styles.chipText}>Exterior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                gardenLocation === "balcony" && styles.chipSelected,
              ]}
              onPress={() => setGardenLocation("balcony")}
            >
              <Text style={styles.chipText}>Balcón</Text>
            </TouchableOpacity>
          </View>
          {gardenLocation === "balcony" && (
            <TextInput
              style={styles.input}
              placeholder="¿Qué trabajo quieres hacer en el balcón?"
              value={balconyJob}
              onChangeText={setBalconyJob}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          )}
        </View>

        {/* Furgoneta */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="airport-shuttle" size={22} color="#ff9800" />
            <Text style={styles.cardTitle}>
              ¿Se puede meter la furgoneta en el garaje?
            </Text>
          </View>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[
                styles.chip,
                vanGarageAccess === "yes" && styles.chipSelected,
              ]}
              onPress={() => setVanGarageAccess("yes")}
            >
              <Text style={styles.chipText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                vanGarageAccess === "no" && styles.chipSelected,
              ]}
              onPress={() => setVanGarageAccess("no")}
            >
              <Text style={styles.chipText}>No</Text>
            </TouchableOpacity>
          </View>
          {vanGarageAccess === "no" && (
            <TextInput
              style={styles.input}
              placeholder="¿Cuántos metros hay que recorrer?"
              keyboardType="numeric"
              value={distanceToGarden}
              onChangeText={setDistanceToGarden}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          )}
        </View>

        {/* Último trabajo */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="tasks" size={20} color="#607d8b" />
            <Text style={styles.cardTitle}>Último trabajo realizado</Text>
          </View>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, lastJob === "" && styles.chipSelected]}
              onPress={() => setLastJob("")}
            >
              <Text style={styles.chipText}>Ninguno</Text>
            </TouchableOpacity>
            {previousJobs.map((job, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, lastJob === job && styles.chipSelected]}
                onPress={() => setLastJob(job)}
              >
                <Text style={styles.chipText}>{job}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.saveButtonText}>Guardando...</Text>
          ) : (
            <Text style={styles.saveButtonText}>Guardar</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    padding: 16,
    paddingTop: 32,
    minHeight: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    color: "#2196f3",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: "#2196f3",
  },
  chipText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
