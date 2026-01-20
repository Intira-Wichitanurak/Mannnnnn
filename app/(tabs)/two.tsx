import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { fetchHistory, ScanHistory } from '@/database/db';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HistoryScreen() {
  const [data, setData] = useState<ScanHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const history = fetchHistory();
      setData(history);
    }, [])
  );

  useEffect(() => {
    const history = fetchHistory();
    setData(history);
  }, []);

  const filteredData = data.filter(item =>
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'paper':
        return '#10B981'; // Green
      case 'plastic':
        return '#3B82F6'; // Blue
      case 'organic':
        return '#8B5CF6'; // Purple
      default:
        return '#10B981';
    }
  };

  const formatDateTime = (dateTime: string) => {
    // Parse the datetime string and format it for local timezone
    try {
      const date = new Date(dateTime);
      
      // Format: YYYY-MM-DD HH:MM
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return dateTime;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search waste type..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* History List */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) }]}>
              <IconSymbol name="arrow.3.trianglepath" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.type}</Text>
              <Text style={styles.cardTime}>{formatDateTime(item.createdAt)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No scan history found</Text>
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
