import React, { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLocation(location.coords);
  };

  // Save location data to a file and share it
  const saveLocationToFile = async () => {
    if (latitude && longitude) {
      const fileUri = FileSystem.documentDirectory + 'location_data.txt';
      const locationData = `Latitude: ${latitude}, Longitude: ${longitude}\n`;

      try {
        await FileSystem.writeAsStringAsync(fileUri, locationData, { encoding: FileSystem.EncodingType.UTF8 });
        console.log("Location data saved to:", fileUri);

        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          setErrorMsg("Sharing is not available on this device.");
        }
      } catch (error) {
        console.log("Error saving location data to file:", error);
        setErrorMsg("Error saving location data to file");
      }
    } else {
      setErrorMsg("No location data to save to file");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Nayla Mutiara Salsabila Bastari - 00000075205</Text>
      <Button title="Get Geo Location" onPress={getLocation} />
      <Button title="Save Location to File" onPress={saveLocationToFile} />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {latitude && longitude ? (
        <View style={styles.coordinates}>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
        </View>
      ) : (
        <Text>No coordinates available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    fontSize: 18,
    marginBottom: 20,
  },
  coordinates: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});
