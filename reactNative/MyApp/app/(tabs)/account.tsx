/*
https://www.youtube.com/watch?v=1ETOJloLK3Y
cd MyApp
npx expo start --tunnel
w
*/

import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { BGColor1, BGColor2, buttonColor, textLightColor } from './home';

const App = () => {
  const [manager] = useState(Platform.OS !== 'web' ? new BleManager() : null);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [receivedData, setReceivedData] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [webBluetoothDevice, setWebBluetoothDevice] = useState(null);

  // Use localStorage for web, FileSystem for native
  const isWeb = Platform.OS === 'web';
  const sleepDataDir = isWeb ? null : `${FileSystem.documentDirectory}sleepData`;
  const filePath = isWeb ? null : `${sleepDataDir}/data.txt`;

  useEffect(() => {
    if (!isWeb) {
      requestPermissions();
      createDirectory();
    } else {
      // Load data from localStorage on web
      loadWebData();
    }
    
    return () => {
      if (manager) {
        manager.destroy();
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const createDirectory = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(sleepDataDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(sleepDataDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  };

  // Web Bluetooth Functions
  const loadWebData = () => {
    try {
      const data = localStorage.getItem('sleepData');
      setFileContent(data || '');
    } catch (error) {
      console.error('Error loading web data:', error);
    }
  };

  const saveWebData = (data) => {
    try {
      const existing = localStorage.getItem('sleepData') || '';
      const newData = existing + data;
      localStorage.setItem('sleepData', newData);
      setFileContent(newData);
    } catch (error) {
      console.error('Error saving web data:', error);
    }
  };

  const clearWebData = () => {
    try {
      localStorage.removeItem('sleepData');
      setFileContent('');
      setReceivedData('');
      alert('Data cleared successfully');
    } catch (error) {
      console.error('Error clearing web data:', error);
    }
  };

  const downloadWebData = () => {
    try {
      const data = localStorage.getItem('sleepData') || 'No data available';
      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sleepData.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data');
    }
  };

  const connectWebBluetooth = async () => {
    try {
      if (!navigator.bluetooth) {
        alert('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.');
        return;
      }

      // Nordic UART Service UUID
      const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
      const NUS_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [NUS_SERVICE_UUID] }],
        optionalServices: [NUS_SERVICE_UUID]
      });

      console.log('Device selected:', device.name);
      setWebBluetoothDevice(device);
      
      const server = await device.gatt.connect();
      console.log('Connected to GATT server');
      
      const service = await server.getPrimaryService(NUS_SERVICE_UUID);
      console.log('Got NUS service');
      
      const characteristic = await service.getCharacteristic(NUS_TX_CHARACTERISTIC_UUID);
      console.log('Got TX characteristic');
      
      await characteristic.startNotifications();
      console.log('Notifications started');
      
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = new TextDecoder().decode(event.target.value);
        console.log('Received data:', value);
        handleReceivedData(value);
      });

      alert(`Connected to ${device.name || 'Unknown Device'}\nListening for data...`);
    } catch (error) {
      console.error('Web Bluetooth error:', error);
      alert('Failed to connect to device: ' + error.message);
      setWebBluetoothDevice(null);
    }
  };

  const disconnectWebBluetooth = async () => {
    if (webBluetoothDevice && webBluetoothDevice.gatt.connected) {
      webBluetoothDevice.gatt.disconnect();
      setWebBluetoothDevice(null);
      alert('Device disconnected');
    }
  };

  // Native Bluetooth Functions
  const scanDevices = () => {
    setDevices([]);
    setIsScanning(true);
    
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        setDevices(prev => {
          const exists = prev.find(d => d.id === device.id);
          if (!exists) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const connectToDevice = async (device) => {
    try {
      manager.stopDeviceScan();
      setIsScanning(false);

      console.log('Connecting to device:', device.name);
      const connected = await manager.connectToDevice(device.id);
      setConnectedDevice(connected);
      
      console.log('Discovering services...');
      await connected.discoverAllServicesAndCharacteristics();
      
      // Nordic UART Service (NUS) UUIDs
      const NUS_SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
      const NUS_TX_CHARACTERISTIC_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
      
      console.log('Setting up NUS monitoring...');
      
      // Monitor the NUS TX characteristic (device sends data to app)
      connected.monitorCharacteristicForService(
        NUS_SERVICE_UUID,
        NUS_TX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }
          
          if (characteristic?.value) {
            const data = Buffer.from(characteristic.value, 'base64').toString('utf-8');
            console.log('Received data:', data);
            handleReceivedData(data);
          }
        }
      );
      
      Alert.alert('Success', `Connected to ${device.name}\nListening for data...`);
      console.log('Successfully connected and monitoring');
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', `Failed to connect: ${error.message}`);
      setConnectedDevice(null);
    }
  };

  const handleReceivedData = async (data) => {
    setReceivedData(prev => prev + data);
    
    const timestamp = new Date().toISOString();             // change this for CSV
    const dataWithTimestamp = `[${timestamp}] ${data}\n`;   // change this for CSV
    
    if (isWeb) {
      saveWebData(dataWithTimestamp);
    } else {
      try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
          await FileSystem.writeAsStringAsync(filePath, dataWithTimestamp, {
            encoding: FileSystem.EncodingType.UTF8,
          });
        } else {
          const existingContent = await FileSystem.readAsStringAsync(filePath);
          await FileSystem.writeAsStringAsync(
            filePath, 
            existingContent + dataWithTimestamp, 
            { encoding: FileSystem.EncodingType.UTF8 }
          );
        }
        readFileContent();
      } catch (error) {
        console.error('Error writing to file:', error);
      }
    }
  };

  const readFileContent = async () => {
    if (isWeb) {
      loadWebData();
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        setFileContent(content);
      } else {
        setFileContent('No data file found');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setFileContent('Error reading file');
    }
  };

  const clearFile = async () => {
    if (isWeb) {
      clearWebData();
      return;
    }

    try {
      await FileSystem.writeAsStringAsync(filePath, '', {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setFileContent('');
      setReceivedData('');
      Alert.alert('Success', 'File cleared');
    } catch (error) {
      console.error('Error clearing file:', error);
    }
  };

  const disconnectDevice = async () => {
    if (isWeb) {
      disconnectWebBluetooth();
    } else if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      Alert.alert('Disconnected', 'Device disconnected');
    }
  };

  const handleConnect = () => {
    if (isWeb) {
      connectWebBluetooth();
    } else {
      scanDevices();
    }
  };

  const isConnected = isWeb ? (webBluetoothDevice && webBluetoothDevice.gatt?.connected) : !!connectedDevice;
  const deviceName = isWeb 
    ? (webBluetoothDevice ? webBluetoothDevice.name || 'Unknown Device' : '')
    : (connectedDevice ? connectedDevice.name : '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Data Logger</Text>
      
      {isWeb && (
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeText}>
            Web version uses localStorage for data storage and Web Bluetooth API.
            {'\n'}Make sure you're using Chrome, Edge, or Opera browser.
          </Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isConnected ? `Connected: ${deviceName}` : 'Not Connected'}
        </Text>
        
        <View style={styles.buttonRow}>
          {!isConnected ? (
            <TouchableOpacity 
              style={[styles.button, isScanning && styles.buttonDisabled]} 
              onPress={handleConnect}
              disabled={isScanning}
            >
              <Text style={styles.buttonText}>
                {isWeb ? 'Connect to Device' : (isScanning ? 'Scanning...' : 'Scan Devices')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={disconnectDevice}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isWeb && devices.length > 0 && !connectedDevice && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Devices</Text>
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deviceItem}
                onPress={() => connectToDevice(item)}
              >
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
              </TouchableOpacity>
            )}
            style={styles.deviceList}
          />
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={readFileContent}>
            <Text style={styles.buttonText}>Refresh Data</Text>
          </TouchableOpacity>
          {isWeb && (
            <TouchableOpacity style={styles.button} onPress={downloadWebData}>
              <Text style={styles.buttonText}>Download .txt</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={clearFile}>
            <Text style={styles.buttonText}>Clear Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isWeb ? 'Stored Data (localStorage)' : 'File Contents (data.txt)'}
        </Text>
        <ScrollView style={styles.dataContainer}>
          <Text style={styles.dataText}>
            {fileContent || 'No data yet. Connect to a device to receive data.'}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BGColor1,
  },
  title: {
    color: textLightColor,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  webNotice: {
    backgroundColor: BGColor2,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  webNoticeText: {
    fontSize: 14,
    color: textLightColor,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: textLightColor,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: buttonColor,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: textLightColor,
    textAlign: 'center',
    fontWeight: '600',
  },
  deviceList: {
    maxHeight: 200,
  },
  deviceItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  dataContainer: {
    backgroundColor: BGColor2,
    padding: 15,
    borderRadius: 8,
    maxHeight: 300,
  },
  dataText: {
    color: textLightColor,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

export default App;