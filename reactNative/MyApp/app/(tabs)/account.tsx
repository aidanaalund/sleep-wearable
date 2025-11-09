import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import * as FileSystem from 'expo-file-system';
import { BGColor1, BGColor2, bordersColor, buttonColor, buttonChoiceColor, textLightColor, textDarkColor } from './home';

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

  const connectWebBluetooth = async () => {
    try {
      if (!navigator.bluetooth) {
        alert('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.');
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access', 'device_information']
      });

      setWebBluetoothDevice(device);
      
      const server = await device.gatt.connect();
      const services = await server.getPrimaryServices();

      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        
        for (const characteristic of characteristics) {
          if (characteristic.properties.notify) {
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
              const value = new TextDecoder().decode(event.target.value);
              handleReceivedData(value);
            });
          }
        }
      }

      alert(`Connected to ${device.name || 'Unknown Device'}`);
    } catch (error) {
      console.error('Web Bluetooth error:', error);
      alert('Failed to connect to device: ' + error.message);
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

      const connected = await manager.connectToDevice(device.id);
      setConnectedDevice(connected);
      
      await connected.discoverAllServicesAndCharacteristics();
      
      const services = await connected.services();
      
      for (const service of services) {
        const characteristics = await service.characteristics();
        
        for (const char of characteristics) {
          if (char.isNotifiable) {
            char.monitor((error, characteristic) => {
              if (error) {
                console.error('Monitor error:', error);
                return;
              }
              
              if (characteristic?.value) {
                const data = Buffer.from(characteristic.value, 'base64').toString('utf-8');
                handleReceivedData(data);
              }
            });
          }
        }
      }
      
      Alert.alert('Success', `Connected to ${device.name}`);
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'Failed to connect to device');
    }
  };

  const handleReceivedData = async (data) => {
    setReceivedData(prev => prev + data);
    
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = `[${timestamp}] ${data}\n`;
    
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