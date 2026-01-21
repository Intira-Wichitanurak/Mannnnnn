import { Platform, StyleSheet, Text, View } from 'react-native';

export default function MapScreen() {
  // Web fallback - Maps not supported on web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bin Locations</Text>
        </View>
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webMapText}>🗺️</Text>
          <Text style={styles.webMapSubtext}>
            Map view is available on mobile app only
          </Text>
          <Text style={styles.webMapInfo}>
            Download the mobile app to see bin locations on the map
          </Text>
        </View>
      </View>
    );
  }

  // Dynamically import MapView only on mobile
  const MapView = require('react-native-maps').default;
  const Marker = require('react-native-maps').Marker;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bin Locations</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 13.7563,
          longitude: 100.5018,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: 13.7563, longitude: 100.5018 }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#10B981',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  map: {
    flex: 1,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapText: {
    fontSize: 80,
    marginBottom: 20,
  },
  webMapSubtext: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    textAlign: 'center',
  },
  webMapInfo: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
