import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";

export default function UserDataScreen({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);
  const [form, setForm] = useState({
    parking_ease: "",
    parking_spots: "",
    garden_location: "",
    balcony_job: "",
    van_garage_access: "",
    distance_to_garden: "",
    last_job: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        Alert.alert("Error", "No se ha encontrado el usuario autenticado.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("userdata")
        .select("*")
        .eq("user_id", user.user.id)
        .single();
      if (error && error.code !== "PGRST116") {
        Alert.alert("Error", error.message);
        console.error(error);
      } else if (data) {
        setUserData(data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const previousJobs = [
    "Corte de césped",
    "Poda de setos",
    "Riego automático",
    "Limpieza de jardín",
    "Instalación de césped artificial",
  ];

  const handleChip = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      Alert.alert("Error", "No se ha encontrado el usuario autenticado.");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("userdata")
      .update({
        parking_ease: userData.parking_ease,
        parking_spots: userData.parking_spots,
        garden_location: userData.garden_location,
        balcony_job: userData.balcony_job,
        van_garage_access: userData.van_garage_access,
        distance_to_garden: userData.distance_to_garden,
        last_job: userData.last_job,
      })
      .eq("user_id", user.user.id);
    setSaving(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Datos actualizados", "Tus datos han sido guardados.");
    }
  };

  const handleCreate = async () => {
    if (!userData) return;
    setSaving(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      Alert.alert("Error", "No se ha encontrado el usuario autenticado.");
      setSaving(false);
      return;
    }
    const { error } = await supabase.from("userdata").insert([
      {
        user_id: user.user.id,
        parking_ease: userData.parking_ease,
        parking_spots: userData.parking_spots,
        garden_location: userData.garden_location,
        balcony_job: userData.balcony_job,
        van_garage_access: userData.van_garage_access,
        distance_to_garden: userData.distance_to_garden,
        last_job: userData.last_job,
      },
    ]);
    setSaving(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Datos guardados", "Tus datos han sido registrados.");
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Si no hay datos, mostrar formulario para crear
  if (!userData) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Rellena tus datos de usuario</Text>
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
                form.parking_ease === "yes" && styles.chipSelected,
              ]}
              onPress={() => setForm({ ...form, parking_ease: "yes" })}
            >
              <Text style={styles.chipText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                form.parking_ease === "no" && styles.chipSelected,
              ]}
              onPress={() => setForm({ ...form, parking_ease: "no" })}
            >
              <Text style={styles.chipText}>No</Text>
            </TouchableOpacity>
          </View>
          {form.parking_ease === "yes" && (
            <TextInput
              style={styles.input}
              placeholder="¿Cuántas plazas?"
              keyboardType="numeric"
              value={form.parking_spots}
              onChangeText={(v) => setForm({ ...form, parking_spots: v })}
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
                form.garden_location === "indoor" && styles.chipSelected,
              ]}
              onPress={() => setForm({ ...form, garden_location: "indoor" })}
            >
              <Text style={styles.chipText}>Interior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                form.garden_location === "outdoor" && styles.chipSelected,
              ]}
              onPress={() => setForm({ ...form, garden_location: "outdoor" })}
            >
              <Text style={styles.chipText}>Exterior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                form.garden_location === "balcony" && styles.chipSelected,
              ]}
              onPress={() => setForm({ ...form, garden_location: "balcony" })}
            >
              <Text style={styles.chipText}>Balcón</Text>
            </TouchableOpacity>
          </View>
          {form.garden_location === "balcony" && (
            <TextInput
              style={styles.input}
              placeholder="¿Qué trabajo quieres hacer en el balcón?"
              value={form.balcony_job}
              onChangeText={(v) => setForm({ ...form, balcony_job: v })}
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
                form.van_garage_access === "yes" && styles.chipSelected,
              ]}
              onPress={() => setForm({ ...form, van_garage_access: "yes" })}
            >
              <Text style={styles.chipText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chip,
                form.van_garage_access === "no" && styles.chipSelected,
              ]}
              onPress={() => setForm({ ...form, van_garage_access: "no" })}
            >
              <Text style={styles.chipText}>No</Text>
            </TouchableOpacity>
          </View>
          {form.van_garage_access === "no" && (
            <TextInput
              style={styles.input}
              placeholder="¿Cuántos metros hay que recorrer?"
              keyboardType="numeric"
              value={form.distance_to_garden}
              onChangeText={(v) => setForm({ ...form, distance_to_garden: v })}
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
              style={[styles.chip, !form.last_job && styles.chipSelected]}
              onPress={() => setForm({ ...form, last_job: "" })}
            >
              <Text style={styles.chipText}>Ninguno</Text>
            </TouchableOpacity>
            {previousJobs.map((job, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.chip,
                  form.last_job === job && styles.chipSelected,
                ]}
                onPress={() => setForm({ ...form, last_job: job })}
              >
                <Text style={styles.chipText}>{job}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleCreate}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Guardando..." : "Guardar datos"}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 24 }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tus datos de usuario</Text>

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
              userData.parking_ease === "yes" && styles.chipSelected,
            ]}
            onPress={() => handleChip("parking_ease", "yes")}
          >
            <Text style={styles.chipText}>Sí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              userData.parking_ease === "no" && styles.chipSelected,
            ]}
            onPress={() => handleChip("parking_ease", "no")}
          >
            <Text style={styles.chipText}>No</Text>
          </TouchableOpacity>
        </View>
        {userData.parking_ease === "yes" && (
          <TextInput
            style={styles.input}
            placeholder="¿Cuántas plazas?"
            keyboardType="numeric"
            value={userData.parking_spots || ""}
            onChangeText={(v) => setUserData({ ...userData, parking_spots: v })}
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
              userData.garden_location === "indoor" && styles.chipSelected,
            ]}
            onPress={() => handleChip("garden_location", "indoor")}
          >
            <Text style={styles.chipText}>Interior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              userData.garden_location === "outdoor" && styles.chipSelected,
            ]}
            onPress={() => handleChip("garden_location", "outdoor")}
          >
            <Text style={styles.chipText}>Exterior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              userData.garden_location === "balcony" && styles.chipSelected,
            ]}
            onPress={() => handleChip("garden_location", "balcony")}
          >
            <Text style={styles.chipText}>Balcón</Text>
          </TouchableOpacity>
        </View>
        {userData.garden_location === "balcony" && (
          <TextInput
            style={styles.input}
            placeholder="¿Qué trabajo quieres hacer en el balcón?"
            value={userData.balcony_job || ""}
            onChangeText={(v) => setUserData({ ...userData, balcony_job: v })}
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
              userData.van_garage_access === "yes" && styles.chipSelected,
            ]}
            onPress={() => handleChip("van_garage_access", "yes")}
          >
            <Text style={styles.chipText}>Sí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              userData.van_garage_access === "no" && styles.chipSelected,
            ]}
            onPress={() => handleChip("van_garage_access", "no")}
          >
            <Text style={styles.chipText}>No</Text>
          </TouchableOpacity>
        </View>
        {userData.van_garage_access === "no" && (
          <TextInput
            style={styles.input}
            placeholder="¿Cuántos metros hay que recorrer?"
            keyboardType="numeric"
            value={userData.distance_to_garden || ""}
            onChangeText={(v) =>
              setUserData({ ...userData, distance_to_garden: v })
            }
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
            style={[styles.chip, !userData.last_job && styles.chipSelected]}
            onPress={() => handleChip("last_job", "")}
          >
            <Text style={styles.chipText}>Ninguno</Text>
          </TouchableOpacity>
          {previousJobs.map((job, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.chip,
                userData.last_job === job && styles.chipSelected,
              ]}
              onPress={() => handleChip("last_job", job)}
            >
              <Text style={styles.chipText}>{job}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 24 }} />
    </ScrollView>
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
