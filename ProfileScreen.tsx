import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { supabase } from "./lib/supabase";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    }
    // Eliminada navegación manual a 'Home'. El stack se actualiza automáticamente.
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://ui-avatars.com/api/?name=User&background=2196f3&color=fff&size=128",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.email || "Usuario"}</Text>
      </View>
      <View style={styles.optionsCard}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("UserData")}
        >
          <MaterialIcons
            name="person"
            size={22}
            color="#2196f3"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.optionText}>Datos de usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
          <FontAwesome
            name="sign-out"
            size={22}
            color="#e53935"
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.optionText, { color: "#e53935" }]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  optionsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#2196f3",
    fontWeight: "500",
  },
});
