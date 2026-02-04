import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { BGColor1, BGColor2, bordersColor, buttonColor, textDarkColor, textInverseColor, textLightColor } from './home';
let VictoryChart, VictoryLine, VictoryAxis;
if (Platform.OS === 'web') {
  const Victory = require('victory');
  VictoryChart = Victory.VictoryChart;
  VictoryLine = Victory.VictoryLine;
  VictoryAxis = Victory.VictoryAxis;
} else {
  const VictoryNative = require('victory-native');
  VictoryChart = VictoryNative.VictoryChart;
  VictoryLine = VictoryNative.VictoryLine;
  VictoryAxis = VictoryNative.VictoryAxis;
}

const App = () => {
  const [manager] = useState(Platform.OS !== 'web' ? new BleManager() : null);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [receivedData, setReceivedData] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [webBluetoothDevice, setWebBluetoothDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inMemoryData, setInMemoryData] = useState('');
  const [liveChartData, setLiveChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  // Check if running in Electron
  const isElectron = typeof window !== 'undefined' && window.electronAPI;
  const isWeb = Platform.OS === 'web';
  const sleepDataDir = isWeb ? null : `${FileSystem.documentDirectory}sleepData`;
  const filePath = isWeb ? null : `${sleepDataDir}/data.txt`;

  useEffect(() => {
    if (!isWeb) {
      requestPermissions();
      createDirectory();
    } else {
      // Load data from localStorage on web (but not Electron)
      if (!isElectron) {
        loadWebData();
      } else {
        // For Electron, just use the in-memory state
        setFileContent(inMemoryData);
      }
      
      // Check Bluetooth availability
      console.log('Checking Bluetooth support...');
      console.log('navigator.bluetooth available:', !!navigator.bluetooth);
      console.log('window.bluetooth available:', !!(typeof window !== 'undefined' && window.bluetooth));
      console.log('Is Electron:', isElectron);
    }
    
    return () => {
      if (manager) {
        manager.destroy();
      }
    };
  }, []);

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

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
      setInMemoryData(data || '');
    } catch (error) {
      console.error('Error loading web data:', error);
    }
  };

  const saveWebData = (data) => {
    if (isElectron) {
      // For Electron, just update in-memory state
      const newData = inMemoryData + data;
      setInMemoryData(newData);
      setFileContent(newData);
    } else {
      // For regular web, use localStorage
      try {
        const existing = localStorage.getItem('sleepData') || '';
        const newData = existing + data;
        localStorage.setItem('sleepData', newData);
        setFileContent(newData);
        setInMemoryData(newData);
      } catch (error) {
        console.error('Error saving web data:', error);
      }
    }
  };

  const clearWebData = () => {
    if (isElectron) {
      // For Electron, clear in-memory state
      setInMemoryData('');
      setFileContent('');
      setReceivedData('');
      alert('Data cleared successfully');
    } else {
      // For regular web, clear localStorage
      try {
        localStorage.removeItem('sleepData');
        setFileContent('');
        setReceivedData('');
        setInMemoryData('');
        alert('Data cleared successfully');
      } catch (error) {
        console.error('Error clearing web data:', error);
      }
    }
  };

  const downloadWebData = async () => {
    try {
      // Get data from appropriate source
      let data;
      if (isElectron) {
        data = inMemoryData || 'No data available';
      } else {
        data = localStorage.getItem('sleepData') || 'No data available';
      }
      
      // Use Electron's save dialog if available
      if (isElectron && window.electronAPI?.saveFile) {
        const result = await window.electronAPI.saveFile({
          data: data,
          defaultPath: 'sleepData.txt'
        });
        
        if (result.success) {
          alert(`File saved successfully to:\n${result.path}`);
        } else if (result.canceled) {
          // User canceled, do nothing
        } else {
          alert('Failed to save file');
        }
      } else {
        // Fallback to browser download
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sleepData.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data: ' + error.message);
    }
  };

  const connectWebBluetooth = async () => {
    try {
      const isElectronBluetooth = window.electronAPI && window.electronAPI.bluetooth;
      
      if (isElectronBluetooth) {
        console.log('Using Electron native Bluetooth');
        
        // Clean up any existing listeners first
        if (window.electronAPI.bluetooth.removeAllListeners) {
          await window.electronAPI.bluetooth.removeAllListeners();
        }
        
        const available = await window.electronAPI.bluetooth.available();
        if (!available) {
          alert('Bluetooth is not available');
          return;
        }
        
        console.log('Scanning for Bluetooth devices...');
        const devices = await window.electronAPI.bluetooth.scan();
        
        //console.log('Found devices:', devices);
        
        // Filter for "Snoozy" device
        const snoozyDevice = devices.find(d => d.name === 'Snoozy');
        
        if (!snoozyDevice) {
          alert('Snoozy device not found. Make sure it is powered on and nearby.');
          //console.log('Available devices:', devices.map(d => d.name));
          return;
        }
        
        //console.log('Found Snoozy:', snoozyDevice);
        //alert('Found Snoozy! Connecting...');
        
        // Connect to device
        const connectResult = await window.electronAPI.bluetooth.connect(snoozyDevice.id);
        console.log('Connected:', connectResult);
        
        // Nordic UART Service UUID
        const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        const NUS_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        
        // Subscribe to notifications
        await window.electronAPI.bluetooth.subscribe(
          NUS_SERVICE_UUID,
          NUS_TX_CHARACTERISTIC_UUID
        );
        
        // Listen for data
        window.electronAPI.bluetooth.onData((data) => {
          //console.log('Received from Snoozy:', data);
          handleReceivedData(data);
        });
        
        // Listen for disconnect
        window.electronAPI.bluetooth.onDisconnect(() => {
          console.log('Snoozy disconnected');
          alert('Snoozy disconnected');
          setWebBluetoothDevice(null);
          setIsConnected(false);
        });
        
        // Set connected state and device AFTER everything is set up
        setWebBluetoothDevice({ name: snoozyDevice.name, id: snoozyDevice.id });
        setIsConnected(true);
        
        //alert(`Connected to Snoozy!\nListening for data...`);
      } else {
        // Web Bluetooth code for browsers...
        const bluetoothAPI = navigator.bluetooth;
        
        if (!bluetoothAPI || typeof bluetoothAPI.requestDevice !== 'function') {
          alert('Web Bluetooth is not available.\n\nPlease use Chrome, Edge, or Opera browser.');
          return;
        }
        
        const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        const NUS_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
        
        const device = await bluetoothAPI.requestDevice({
          filters: [{ services: [NUS_SERVICE_UUID] }],
          optionalServices: [NUS_SERVICE_UUID]
        });
        
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(NUS_SERVICE_UUID);
        const characteristic = await service.getCharacteristic(NUS_TX_CHARACTERISTIC_UUID);
        
        await characteristic.startNotifications();
        
        characteristic.addEventListener('characteristicvaluechanged', (event) => {
          const value = new TextDecoder().decode(event.target.value);
          handleReceivedData(value);
        });
        
        // Add disconnect listener for web bluetooth
        device.addEventListener('gattserverdisconnected', () => {
          console.log('Device disconnected');
          setWebBluetoothDevice(null);
          setIsConnected(false);
        });
        
        setWebBluetoothDevice(device);
        setIsConnected(true);
        
        //alert(`Connected to ${device.name || 'Unknown Device'}\nListening for data...`);
      }
      
    } catch (error) {
      console.error('Bluetooth error:', error);
      alert('Bluetooth connection failed: ' + error.message);
      setWebBluetoothDevice(null);
      setIsConnected(false);
    }
  };

  const disconnectWebBluetooth = async () => {
    const isElectronBluetooth = window.electronAPI && window.electronAPI.bluetooth;
    
    if (isElectronBluetooth) {
      // Disconnect Electron Bluetooth
      try {
        // Remove listeners before disconnecting
        if (window.electronAPI.bluetooth.removeAllListeners) {
          await window.electronAPI.bluetooth.removeAllListeners();
        }
        await window.electronAPI.bluetooth.disconnect();
        setWebBluetoothDevice(null);
        setIsConnected(false);
        alert('Device disconnected');
      } catch (error) {
        console.error('Error disconnecting Electron Bluetooth:', error);
        // Still update state even if disconnect fails
        setWebBluetoothDevice(null);
        setIsConnected(false);
      }
    } else if (webBluetoothDevice) {
      // Disconnect regular Web Bluetooth
      if (webBluetoothDevice.gatt && webBluetoothDevice.gatt.connected) {
        webBluetoothDevice.gatt.disconnect();
      }
      setWebBluetoothDevice(null);
      setIsConnected(false);
      alert('Device disconnected');
    } else {
      // No device connected, just update state
      setWebBluetoothDevice(null);
      setIsConnected(false);
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
    // Native mobile Bluetooth only
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
            //console.log('Received data:', data);
            handleReceivedData(data);
          }
        }
      );
      
      setIsConnected(true);
      //Alert.alert('Success', `Connected to ${device.name}\nListening for data...`);
      //console.log('Successfully connected and monitoring');
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', `Failed to connect: ${error.message}`);
      setConnectedDevice(null);
      setIsConnected(false);
    }
  };

  const handleReceivedData = async (data) => {
    setReceivedData(prev => prev + data);
    
    // Get local timestamp instead of UTC
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const timestamp = `${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    const dataWithTimestamp = `${timestamp},${data}`;
    
    const dateString = `${year}-${month}-${day}`;
    
    if (isElectron) {
      try {
        const result = await window.electronAPI.appendToFile(dataWithTimestamp, dateString);
        if (result.success) {
          console.log('Data appended to:', result.path);
          
          // Parse the dataWithTimestamp once to add to live chart
          const values = dataWithTimestamp.split(',');
          const timeWithoutZ = values[0].replace('Z', '');
          const timestampMs = new Date(dateString + 'T' + timeWithoutZ).getTime();
          setLiveChartData(prev => [...prev, { x: timestampMs, y: parseFloat(data) }]);
        } else {
          console.error('Failed to append data:', result.error);
        }
      } catch (error) {
        console.error('Error appending to file:', error);
      }
    }
    
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
      if (isElectron) {
        // For Electron, use in-memory data
        setFileContent(inMemoryData);
      } else {
        // For regular web, use localStorage
        loadWebData();
      }
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
    setIsConnected(false);
  };

  const handleConnect = () => {
    if (isWeb) {
      connectWebBluetooth();
    } else {
      scanDevices();
    }
  };

  const deviceName = isWeb 
    ? (webBluetoothDevice ? webBluetoothDevice.name || 'Unknown Device' : '')
    : (connectedDevice ? connectedDevice.name : '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Data Logger</Text>
      
      {isWeb && (
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeText}>
            {isElectron 
              ? 'Electron version - Data stored in memory. Use "Save As..." to save to disk.'
              : 'Web version uses localStorage for data storage and Web Bluetooth API.'}
            {'\n'}For best Bluetooth support, use Chrome, Edge, or Opera browser.
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
                {isScanning ? 'Scanning...' : (isWeb ? 'Connect to Device' : 'Scan Devices')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={disconnectDevice}>
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
          <TouchableOpacity style={styles.button} onPress={() => setShowChart(true)}>
            <Text style={styles.buttonText}>Live Data</Text>
          </TouchableOpacity>
          {isWeb && (
            <TouchableOpacity style={styles.button} onPress={downloadWebData}>
              <Text style={styles.buttonText}>
                {isElectron ? 'Save As...' : 'Download .txt'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={() => {
            setLiveChartData([]);
          }}>
            <Text style={styles.buttonText}>Clear Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isWeb 
            ? (isElectron ? 'Stored Data (In Memory)' : 'Stored Data (localStorage)')
            : 'File Contents (data.txt)'}
        </Text>
        <ScrollView style={styles.dataContainer}>
          <Text style={styles.dataText}>
            {fileContent || 'No data yet. Connect to a device to receive data.'}
          </Text>
        </ScrollView>
      </View>

      {/* Chart Modal */}
      <Modal
        visible={showChart}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChart(false)}
      >
        <View style={styles.chartModalOverlay}>
          <View style={styles.chartModalContent}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Live Data Chart</Text>
              <TouchableOpacity onPress={() => setShowChart(false)} style={styles.chartCloseButton}>
                <Text style={styles.chartCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
              
              <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{
                justifyContent: liveChartData.length <= 100 ? 'center' : 'flex-start',
                alignItems: 'center',
                minWidth: '100%',
              }}
              >
                <VictoryChart
                  width={Math.max(1280, (liveChartData.length / 60) * 1280)}
                  height={720}
                  scale={{ x: 'time' }}
                  style={{
                    background: { fill: BGColor2 },
                    justifyContent: 'center',
                  }}
                >
                  <VictoryAxis
                    dependentAxis
                    label="Values"
                    style={{
                      axisLabel: { padding: 60, angle: 0, fill: textLightColor },
                      tickLabels: { fill: textLightColor },
                      axis: { stroke: textDarkColor, strokeWidth: 5 },
                      grid: { stroke: bordersColor }
                    }}
                  />
                  <VictoryAxis
                    label="HH:MM:SS"
                    tickFormat={formatXAxis}
                    style={{
                      axisLabel: { padding: 10, fill: textDarkColor },
                      tickLabels: { angle: -45, fill: textLightColor },
                      axis: { stroke: textDarkColor, strokeWidth: 5 },
                      grid: { stroke: bordersColor }
                    }}
                  />
                  <VictoryLine
                    data={liveChartData}
                    style={{
                      data: { stroke: textInverseColor, strokeWidth: 2 }
                    }}
                  />
                </VictoryChart>
              </ScrollView>
          </View>
        </View>
      </Modal>
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
  /* Chart Modal Styles */
  chartModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartModalContent: {
    backgroundColor: BGColor1,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    height: '90%',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: textLightColor,
  },
  chartCloseButton: {
    padding: 5,
  },
  chartCloseButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: textLightColor,
  },
});

export default App;