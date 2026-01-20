/**
 * API Service for Smart Bin Application
 */

const API_BASE_URL = 'https://api.example.com'; // Change to your API URL
const WEATHER_API_KEY = 'YOUR_API_KEY'; // Get free key from openweathermap.org
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
 * @param imageUri - Local image URI
 * @returns Classification result
 */
export const classifyWasteImage = async (imageUri: string): Promise<ClassificationResult> => {
  try {
    // Create form data with image
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = imageUri.split('/').pop() || 'image.jpg';
    
    // Add image to form data
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename,
    } as any);

    // Call classification API
    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
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
    
    // Fallback to mock classification if API fails
    return mockClassifyImage(imageUri);
  }
};

/**
 * Mock classification for testing/fallback
 * Simulates AI analysis with random results
 */
export const mockClassifyImage = async (imageUri: string): Promise<ClassificationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const wasteTypes: Array<'Paper' | 'Plastic' | 'Organic'> = ['Paper', 'Plastic', 'Organic'];
  const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
  const confidence = Math.random() * 0.3 + 0.7; // 70-100%
  
  return {
    type: randomType,
    confidence: parseFloat(confidence.toFixed(2)),
    details: `Mock classification result`,
  };
};

/**
 * Get nearby bin locations
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @returns Array of bin locations
 */
export const getNearbyBins = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bins?lat=${latitude}&lng=${longitude}&radius=5000`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.bins || [];
  } catch (error) {
    console.error('Bins API Error:', error);
    
    // Return mock data if API fails
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
 * Sync local history to cloud
 * @param history - Array of scan history
 */
export const syncHistory = async (history: any[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sync`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Sync API Error:', error);
    throw error;
  }
};

/**
 * Get waste statistics
 */
export const getWasteStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Stats API Error:', error);
    
    // Return mock stats
    return {
      paper: 45,
      plastic: 78,
      organic: 32,
      total: 155,
    };
  }
};

/**
 * Get weather forecast
 * @param city - City name (default: Bangkok)
 * @returns Weather data
 */
export const getWeatherForecast = async (city: string = 'Bangkok'): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
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
    
    // Return mock weather data if API fails
    return {
      temperature: 32,
      description: 'Partly cloudy',
      humidity: 65,
      icon: '02d',
      city: city,
    };
  }
};
