import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const START_HOUR = 17;
const END_HOUR = 20;

function getNextWeekDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(new Date(date));
  }
  return dates;
}

function getBudgetSlots() {
  const slots = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    const start = `${h.toString().padStart(2, "0")}:00`;
    const end = `${(h + 1).toString().padStart(2, "0")}:00`;
    slots.push({ start, end });
  }
  return slots;
}

export default function DetailScreen({ route }: any) {
  const { gardeningCompany } = route.params;
  // Datos reales Fonoll Jardiners
  const companyDetail = {
    name: "Fonoll Jardiners",
    address: "Carrer Pere Rovirosa, 08880 Cubelles",
    phone: "722 423 936",
    email: "fonolljardiners@gmail.com",
    description:
      "Jardineros de confianza en Cubelles, Garraf y Baix Penedés. Servicio integral de jardinería, profesionalidad y máquinas ecológicas.",
    images: [
      // Imágenes de Instagram (puedes actualizar con imágenes reales si tienes acceso)
      "https://instagram.com/fonolljardiners/profile_pic", // Placeholder
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Placeholder
    ],
    prices: [
      { service: "Diseño y creación de jardines", price: "Consultar" },
      { service: "Mantenimiento comunitario y particular", price: "Consultar" },
      { service: "Instalación de césped artificial", price: "Consultar" },
      { service: "Tala y poda de árboles", price: "Consultar" },
      { service: "Desbroce forestal y parcelas", price: "Consultar" },
      { service: "Biotrituraje de ramas", price: "Consultar" },
      { service: "Destaconado de tocones", price: "Consultar" },
    ],
    services: [
      "Diseño y creación de jardines",
      "Mantenimiento comunitario y particular",
      "Instalación de césped artificial",
      "Tala y poda de árboles",
      "Desbroce forestal y parcelas",
      "Biotrituraje de ramas",
      "Destaconado de tocones",
    ],
    instagram: "https://www.instagram.com/fonolljardiners/",
    facebook:
      "https://www.facebook.com/people/Fonoll-Jardiners/pfbid0Tbx8JF7mbLHKqnXSpmB1iTUWdpuHQWPJXZCBVMF8cDEqxYgASaC54RzCVbZcHskTl/",
  };
  const [date, setDate] = useState(getNextWeekDates()[0]);
  const slots = getBudgetSlots();
  const [slot, setSlot] = useState(slots[0].start);
  const [showReserveModal, setShowReserveModal] = useState(false);

  const onReserve = () => {
    Alert.alert(
      "Reserva completada",
      `Jardinería: ${
        gardeningCompany.name
      }\nFecha: ${date.toLocaleDateString()}\nHora: ${slot} - ${
        slots.find((s) => s.start === slot)?.end
      }`
    );
    // Aquí iría la lógica para guardar la reserva en Supabase
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Encabezado visual */}
        <View style={styles.headerWrap}>
          <Image
            source={{ uri: companyDetail.images[0] }}
            style={styles.headerImage}
          />
          <Text style={styles.title}>{gardeningCompany.name}</Text>
          <Text style={styles.address}>{companyDetail.address}</Text>
          <Text style={styles.workers}>{companyDetail.description}</Text>
        </View>
        {/* Servicios ofrecidos */}
        <Text style={styles.sectionTitle}>Servicios que ofrecemos</Text>
        <View style={styles.chipsWrap}>
          {companyDetail.services.map((srv) => (
            <View key={srv} style={styles.chip}>
              <Text style={styles.chipText}>{srv}</Text>
            </View>
          ))}
        </View>
        {/* Carrusel de imágenes */}
        <Text style={styles.sectionTitle}>Trabajos realizados</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesScroll}
        >
          {companyDetail.images.map((img, idx) => (
            <Image key={img} source={{ uri: img }} style={styles.workImage} />
          ))}
        </ScrollView>
        {/* Precios orientativos */}
        <Text style={styles.sectionTitle}>Precios orientativos</Text>
        <View style={styles.pricesWrap}>
          {companyDetail.prices.map((p) => (
            <View key={p.service} style={styles.priceRow}>
              <Text style={styles.priceService}>{p.service}</Text>
              <Text style={styles.priceValue}>{p.price}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      {/* Botón flotante llamativo */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowReserveModal(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>¡Pide tu presupuesto!</Text>
      </TouchableOpacity>
      {/* Modal para proceso de reserva */}
      {showReserveModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 18,
              width: "96%",
              maxWidth: 480,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#2196f3",
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              Reserva tu cita de presupuesto
            </Text>
            {/* Selector de día visual */}
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              Selecciona día:
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              {getNextWeekDates().map((d) => (
                <TouchableOpacity
                  key={d.toDateString()}
                  style={{
                    backgroundColor:
                      date.toDateString() === d.toDateString()
                        ? "#4caf50"
                        : "#e3f2fd",
                    borderRadius: 14,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginHorizontal: 4,
                    marginBottom: 6,
                  }}
                  onPress={() => setDate(d)}
                >
                  <Text
                    style={{
                      color:
                        date.toDateString() === d.toDateString()
                          ? "#fff"
                          : "#2196f3",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {d.toLocaleDateString("es-ES", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Selector de hora visual */}
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              Selecciona hora:
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              {slots.map((item) => (
                <TouchableOpacity
                  key={item.start}
                  style={{
                    backgroundColor: slot === item.start ? "#2196f3" : "#eee",
                    borderRadius: 14,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginHorizontal: 4,
                    marginBottom: 6,
                  }}
                  onPress={() => setSlot(item.start)}
                >
                  <Text
                    style={{
                      color: slot === item.start ? "#fff" : "#2196f3",
                      fontWeight: slot === item.start ? "bold" : "normal",
                      fontSize: 15,
                    }}
                  >
                    {item.start} - {item.end}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#4caf50",
                borderRadius: 18,
                paddingVertical: 14,
                alignItems: "center",
                minWidth: 180,
                marginTop: 8,
              }}
              onPress={() => {
                onReserve();
                setShowReserveModal(false);
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Confirmar reserva
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => setShowReserveModal(false)}
            >
              <Text
                style={{ color: "#2196f3", fontSize: 16, fontWeight: "bold" }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
  },
  headerWrap: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#e8f5e9",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 12,
    backgroundColor: "#c8e6c9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196f3",
    marginBottom: 4,
    textAlign: "center",
  },
  address: {
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
    textAlign: "center",
  },
  workers: {
    fontSize: 15,
    color: "#388e3c",
    marginBottom: 6,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4caf50",
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 18,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 18,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: "#e3f2fd",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: "#2196f3",
    fontWeight: "bold",
    fontSize: 15,
  },
  imagesScroll: {
    marginHorizontal: 18,
    marginBottom: 8,
  },
  workImage: {
    width: 110,
    height: 80,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#c8e6c9",
  },
  pricesWrap: {
    marginHorizontal: 18,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceService: {
    fontSize: 16,
    color: "#333",
  },
  priceValue: {
    fontSize: 16,
    color: "#2196f3",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#2196f3",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
