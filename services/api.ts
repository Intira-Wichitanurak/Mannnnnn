/**
 * API Service for Smart Bin Application
 */

import Constants from 'expo-constants';

const API_BASE_URL = 'https://api.example.com';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ✅ รองรับ Expo SDK เก่า + ใหม่
const WEATHER_API_KEY =
  Constants.expoConfig?.extra?.WEATHER_API_KEY ??
  Constants.manifest?.extra?.WEATHER_API_KEY;

console.log('WEATHER_API_KEY =>', WEATHER_API_KEY);

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  icon: string;
  city: string;
}

export interface ClassificationResult {
  type: 'Paper' | 'Plastic' | 'Organic';
  confidence: number;
  details?: string;
}

/**
 * Classify waste image using AI API
 */
export const classifyWasteImage = async (
  imageUri: string
): Promise<ClassificationResult> => {
  try {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'image.jpg';

    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename,
    } as any);

    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      type: data.type || 'Plastic',
      confidence: data.confidence || 0.85,
      details: data.details,
    };
  } catch (error) {
    console.error('Classification API Error:', error);
    return mockClassifyImage(imageUri);
  }
};

/**
 * Mock classification (fallback)
 */
export const mockClassifyImage = async (
  imageUri: string
): Promise<ClassificationResult> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const wasteTypes: Array<'Paper' | 'Plastic' | 'Organic'> = [
    'Paper',
    'Plastic',
    'Organic',
  ];

  const randomType =
    wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
  const confidence = Math.random() * 0.3 + 0.7;

  return {
    type: randomType,
    confidence: parseFloat(confidence.toFixed(2)),
    details: 'Mock classification result',
  };
};

/**
 * Get nearby bins
 */
export const getNearbyBins = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bins?lat=${latitude}&lng=${longitude}&radius=5000`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.bins || [];
  } catch (error) {
    console.error('Bins API Error:', error);
    return [
      {
        id: 1,
        latitude: 13.7563,
        longitude: 100.5018,
        type: 'General',
        name: 'Bangkok Central',
      },
    ];
  }
};

/**
 * Get weather
 */
export const getWeatherForecast = async (
  city: string = 'Bangkok'
): Promise<WeatherData> => {
  try {
    if (!WEATHER_API_KEY) {
      throw new Error('WEATHER_API_KEY not loaded from Expo config');
    }

    const url = `${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    console.log('Weather URL =>', url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Weather API raw error:', errorText);
      throw new Error(`Weather API Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
      city: data.name,
    };
  } catch (error) {
    console.error('Weather API Error:', error);

    // fallback
    return {
      temperature: 32,
      description: 'Partly cloudy',
      humidity: 65,
      icon: '02d',
      city,
    };
  }
};
