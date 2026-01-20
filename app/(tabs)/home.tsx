import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getWeatherForecast, WeatherData } from '@/services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const data = await getWeatherForecast('Bangkok');
      setWeather(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Bin</Text>
        <Text style={styles.headerSubtitle}>Waste Management System</Text>
      </View>

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <IconSymbol name="leaf.fill" size={48} color="#10B981" />
        <Text style={styles.welcomeTitle}>Welcome to Smart Bin</Text>
        <Text style={styles.welcomeText}>
          Help the environment by properly sorting your waste
        </Text>
      </View>

      {/* Weather Forecast */}
      <Text style={styles.sectionTitle}>Weather Forecast</Text>
      <View style={styles.weatherCard}>
        {isLoadingWeather ? (
          <ActivityIndicator size="large" color="#10B981" />
        ) : weather ? (
          <>
            <View style={styles.weatherHeader}>
              <View>
                <Text style={styles.weatherCity}>{weather.city}</Text>
                <Text style={styles.weatherDescription}>{weather.description}</Text>
              </View>
              <View style={styles.weatherTempContainer}>
                <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
              </View>
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetailItem}>
                <IconSymbol name="drop.fill" size={20} color="#3B82F6" />
                <Text style={styles.weatherDetailText}>{weather.humidity}%</Text>
                <Text style={styles.weatherDetailLabel}>Humidity</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <IconSymbol name="sun.max.fill" size={20} color="#F59E0B" />
                <Text style={styles.weatherDetailText}>Good</Text>
                <Text style={styles.weatherDetailLabel}>Air Quality</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.weatherError}>Unable to load weather data</Text>
        )}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {/* Scan Action */}
        <Pressable 
          style={[styles.actionCard, { backgroundColor: '#DBEAFE' }]}
          onPress={() => router.push('/(tabs)')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
            <IconSymbol name="camera.fill" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Scan Waste</Text>
          <Text style={styles.actionDescription}>Classify your waste</Text>
        </Pressable>

        {/* History Action */}
        <Pressable 
          style={[styles.actionCard, { backgroundColor: '#D1FAE5' }]}
          onPress={() => router.push('/(tabs)/two')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
            <IconSymbol name="clock.fill" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>History</Text>
          <Text style={styles.actionDescription}>View scan history</Text>
        </Pressable>

        {/* Map Action */}
        <Pressable 
          style={[styles.actionCard, { backgroundColor: '#FEF3C7' }]}
          onPress={() => router.push('/(tabs)/map')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
            <IconSymbol name="map.fill" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitle}>Bin Locations</Text>
          <Text style={styles.actionDescription}>Find nearby bins</Text>
        </Pressable>
      </View>

      {/* Stats Cards */}
      <Text style={styles.sectionTitle}>Waste Categories</Text>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
          <IconSymbol name="arrow.3.trianglepath" size={24} color="#10B981" />
          <Text style={styles.statTitle}>Paper</Text>
          <Text style={styles.statDescription}>Recyclable paper products</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
          <IconSymbol name="arrow.3.trianglepath" size={24} color="#3B82F6" />
          <Text style={styles.statTitle}>Plastic</Text>
          <Text style={styles.statDescription}>Recyclable plastic items</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: '#8B5CF6' }]}>
          <IconSymbol name="arrow.3.trianglepath" size={24} color="#8B5CF6" />
          <Text style={styles.statTitle}>Organic</Text>
          <Text style={styles.statDescription}>Compostable waste</Text>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D1FAE5',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statDescription: {
    fontSize: 13,
    color: '#6B7280',
    flex: 2,
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
    justifyContent: 'center',
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherCity: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  weatherTempContainer: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  weatherDetailItem: {
    alignItems: 'center',
    gap: 4,
  },
  weatherDetailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  weatherDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  weatherError: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
});
