import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Animated,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const gardeningCompanies = [
  { id: "1", name: "Jardinería Vilanova", icon: "spa" },
  { id: "2", name: "Jardinería La Geltrú", icon: "local-florist" },
  { id: "3", name: "Jardinería El Jardí Blau", icon: "grass" },
  { id: "4", name: "Jardinería Verd i Flor", icon: "eco" },
  { id: "5", name: "Jardinería Sant Jordi", icon: "nature" },
  { id: "6", name: "Jardinería Mediterrània", icon: "waves" },
  { id: "7", name: "Fonoll Jardiners", icon: "park" },
];

export default function HomeScreen({ navigation }: any) {
  const [showOnboardingBtn, setShowOnboardingBtn] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoModalShown, setPromoModalShown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [modalAnim] = useState(new Animated.Value(0));

  const checkUserData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    setUser(userData?.user || null);
    if (!userData?.user) {
      setShowOnboardingBtn(false);
      setShowPromoModal(false);
      return;
    }
    const { data } = await supabase
      .from("userdata")
      .select("id")
      .eq("user_id", userData.user.id);
    const needsOnboarding = !data || data.length === 0;
    setShowOnboardingBtn(needsOnboarding);
    if (needsOnboarding && !promoModalShown) {
      setShowPromoModal(true);
      setPromoModalShown(true);
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    checkUserData();
    // eslint-disable-next-line
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const updateBtn = async () => {
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user || null);
        if (!userData?.user) {
          setShowOnboardingBtn(false);
          return;
        }
        const { data } = await supabase
          .from("userdata")
          .select("id")
          .eq("user_id", userData.user.id);
        setShowOnboardingBtn(!data || data.length === 0);
      };
      updateBtn();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#4caf50",
      },
      headerShadowVisible: false,
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="spa"
            size={28}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              letterSpacing: 0.5,
            }}
          >
            Jardinerías
          </Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={{ alignItems: "center", width: 44 }}
        >
          <Image
            source={{
              uri: "https://ui-avatars.com/api/?name=User&background=2196f3&color=fff&size=128",
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#fff",
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderCompany = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { gardeningCompany: item })}
      activeOpacity={0.85}
    >
      <View style={styles.cardIconWrap}>
        <MaterialIcons name={item.icon || "spa"} size={32} color="#4caf50" />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4caf50", "#2196f3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // vertical
        style={styles.headerWrap}
      >
        <MaterialIcons
          name="spa"
          size={44}
          color="#fff"
          style={{ marginBottom: 8 }}
        />
        <Text style={styles.title}>Jardinerías cercanas</Text>
        {user && (
          <Text style={styles.greeting}>
            ¡Hola,{" "}
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              {user.email?.split("@")[0] || "usuario"}
            </Text>
            !
          </Text>
        )}
      </LinearGradient>
      <FlatList
        data={gardeningCompanies}
        keyExtractor={(item) => item.id}
        renderItem={renderCompany}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
      {showOnboardingBtn && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("Onboarding")}
          activeOpacity={0.85}
        >
          <MaterialIcons name="person-add" size={28} color="#fff" />
          <Text style={styles.fabText}>Nuevo cliente</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={showPromoModal}
        animationType="none"
        transparent
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={{
              ...styles.modalContent,
              transform: [
                {
                  scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: modalAnim,
            }}
          >
            <Text style={styles.modalTitle}>¡Mejora tu experiencia!</Text>
            <Text style={styles.modalText}>
              Completa tu perfil para recibir atención personalizada y contratar
              servicios de forma más rápida y sencilla.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowPromoModal(false);
                navigation.navigate("Onboarding");
              }}
            >
              <Text style={styles.modalButtonText}>
                Rellenar mi perfil ahora
              </Text>
            </Pressable>
            <Pressable
              style={styles.modalClose}
              onPress={() => setShowPromoModal(false)}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 0,
  },
  headerWrap: {
    paddingTop: 32,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    marginBottom: 0,
    minHeight: 90,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 15,
    color: "#e3f2fd",
    marginBottom: 4,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginHorizontal: 18,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIconWrap: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 8,
    marginRight: 16,
  },
  cardText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#4caf50",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2196f3",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#4caf50",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 10,
    minWidth: 160,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  modalClose: {
    marginTop: 4,
  },
  modalCloseText: {
    color: "#2196f3",
    fontSize: 16,
    fontWeight: "bold",
  },
});
