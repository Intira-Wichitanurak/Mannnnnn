import { View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { insertScan } from '../../database/db';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { classifyWasteImage, ClassificationResult } from '../../services/api';

export default function ScanScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      // Simulate analysis
      analyzeImage();
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      // Simulate analysis
      analyzeImage();
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setDetectedType(null);
    setConfidence(null);
    
    try {
      // Call API to classify image
      const result: ClassificationResult = await classifyWasteImage(selectedImage);
      
      // Save to database
      insertScan(result.type);
      
      // Update UI
      setDetectedType(result.type);
      setConfidence(result.confidence);
      setIsAnalyzing(false);
      
      Alert.alert(
        'Analysis Complete',
        `Detected: ${result.type}\nConfidence: ${(result.confidence * 100).toFixed(1)}%`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setIsAnalyzing(false);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
      console.error('Analysis error:', error);
    }
  };

  const handleScan = () => {
    Alert.alert(
      'Choose Image Source',
      'Select where to get the image from',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleResultPress = (type: string) => {
    insertScan(type);
    Alert.alert('Success', `${type} waste recorded!`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classify Your Waste</Text>
      </View>

      <View style={styles.content}>
        {/* Camera Placeholder */}
        <Pressable style={styles.cameraPlaceholder} onPress={handleScan}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContent}>
            <IconSymbol name="camera.fill" size={80} color="#9CA3AF" />
            <Text style={styles.placeholderText}>Tap to select image</Text>
          </View>
        )}
        {isAnalyzing && (
          <View style={styles.analyzingOverlay}>
            <Text style={styles.analyzingText}>Analyzing...</Text>
          </View>
        )}
      </Pressable>

      {/* Results Section */}
      <Text style={styles.resultsTitle}>
        Results {confidence && `(${(confidence * 100).toFixed(1)}% confidence)`}
      </Text>
      <View style={styles.resultsContainer}>
        {/* Paper */}
        <Pressable 
          style={[
            styles.resultCard, 
            { backgroundColor: '#D1FAE5' },
            detectedType === 'Paper' && styles.resultCardActive
          ]}
          onPress={() => handleResultPress('Paper')}
        >
          <IconSymbol name="arrow.3.trianglepath" size={40} color="#10B981" />
          <Text style={styles.resultLabel}>Paper</Text>
          {detectedType === 'Paper' && (
            <View style={styles.detectedBadge}>
              <Text style={styles.detectedText}>✓</Text>
            </View>
          )}
        </Pressable>

        {/* Plastic */}
        <Pressable 
          style={[
            styles.resultCard, 
            { backgroundColor: '#DBEAFE' },
            detectedType === 'Plastic' && styles.resultCardActive
          ]}
          onPress={() => handleResultPress('Plastic')}
        >
          <IconSymbol name="arrow.3.trianglepath" size={40} color="#3B82F6" />
          <Text style={styles.resultLabel}>Plastic</Text>
          {detectedType === 'Plastic' && (
            <View style={styles.detectedBadge}>
              <Text style={styles.detectedText}>✓</Text>
            </View>
          )}
        </Pressable>

        {/* Organic */}
        <Pressable 
          style={[
            styles.resultCard, 
            { backgroundColor: '#F3E8FF' },
            detectedType === 'Organic' && styles.resultCardActive
          ]}
          onPress={() => handleResultPress('Organic')}
        >
          <IconSymbol name="arrow.3.trianglepath" size={40} color="#8B5CF6" />
          <Text style={styles.resultLabel}>Organic</Text>
          {detectedType === 'Organic' && (
            <View style={styles.detectedBadge}>
              <Text style={styles.detectedText}>✓</Text>
            </View>
          )}
        </Pressable>
      </View>

        {/* Scan Button */}
        <Pressable style={styles.scanButton} onPress={handleScan}>
          <IconSymbol name="camera.fill" size={20} color="#8B5CF6" />
          <Text style={styles.scanButtonText}>Scan Waste</Text>
        </Pressable>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cameraPlaceholder: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 12,
  },
  resultCard: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  resultCardActive: {
    borderWidth: 3,
    borderColor: '#10B981',
    transform: [{ scale: 1.05 }],
  },
  detectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  scanButton: {
    backgroundColor: '#F3E8FF',
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});
