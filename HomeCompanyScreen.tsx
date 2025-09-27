import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "./lib/supabase";

export default function HomeCompanyScreen() {
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      setCompanyName(user?.user_metadata?.company_name || "Empresa");
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.company}>{companyName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2196f3",
    marginBottom: 18,
  },
  company: {
    fontSize: 24,
    color: "#4caf50",
    fontWeight: "bold",
  },
});
