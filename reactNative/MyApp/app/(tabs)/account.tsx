import Slider from '@react-native-community/slider';
import Base64 from 'base64-js';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { readAsStringAsync, writeAsStringAsync } from 'expo-file-system/legacy';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Modal, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { BGColor1, BGColor2, bordersColor, buttonColor, textDarkColor, textInverseColor, textLightColor } from './_layout';

let RNFS: any = null;
let SLEEP_DATA_DIR: string = '';
if (Platform.OS === 'android') {
  RNFS = require('react-native-fs');
  SLEEP_DATA_DIR = `${RNFS.ExternalDirectoryPath}/sleepData`;
}

const featureString0 = "[-0.000000, 0.000000, -0.000000, -0.000000, -0.000000, 0.268293, 1.009342, -0.513426, -0.610884, -0.450934, 0.105735, 0.098442, -0.374693, 1.344193, 0.000000, -1.072327, 0.836155, 0.271439, -1.107389, -1.544308, 0.350379, 0.387613, 0.000000, -0.000000, -0.000000, -0.000000, -1.264191, -0.655057, -0.395945, 0.350382, -0.000000, 0.000000, -0.000000, -0.000000, -0.000000, -0.376902, 1.394608, 0.132936, -0.488181, -0.006909, -0.064611, -0.435982, 0.031217, 0.976959, -0.000000, -0.563263, 0.215492, 0.788426, -1.086738, -1.257279, 0.051815, 0.068541, 0.000000, 0.000000, 0.000000, -0.000000, -1.124774, -0.556678, -0.080035, 0.143367, 1.240536, 2.438614, -0.033927, -0.703012, 0.624846, -0.000000, -0.000000, -0.000000, 0.000000, 0.000000, -0.000000, 0.000000, -0.000000, 0.000000, -0.000000, 0.000000, -0.000000, -0.000000, 0.000000]";
const stringToFloat0 = new Float32Array(JSON.parse(featureString0));
const paddedStringToFloat0 = new Float32Array(2 * 1280);
paddedStringToFloat0.set(stringToFloat0.slice(0, 1280), 0);
const feature0 = new Float32Array([-0.000000, 0.000000, -0.000000, -0.000000, -0.000000, 0.268293, 1.009342, -0.513426, -0.610884, -0.450934, 0.105735, 0.098442, -0.374693, 1.344193, 0.000000, -1.072327, 0.836155, 0.271439, -1.107389, -1.544308, 0.350379, 0.387613, 0.000000, -0.000000, -0.000000, -0.000000, -1.264191, -0.655057, -0.395945, 0.350382, -0.000000, 0.000000, -0.000000, -0.000000, -0.000000, -0.376902, 1.394608, 0.132936, -0.488181, -0.006909, -0.064611, -0.435982, 0.031217, 0.976959, -0.000000, -0.563263, 0.215492, 0.788426, -1.086738, -1.257279, 0.051815, 0.068541, 0.000000, 0.000000, 0.000000, -0.000000, -1.124774, -0.556678, -0.080035, 0.143367, 1.240536, 2.438614, -0.033927, -0.703012, 0.624846, -0.000000, -0.000000, -0.000000, 0.000000, 0.000000, -0.000000, 0.000000, -0.000000, 0.000000, -0.000000, 0.000000, -0.000000, -0.000000, 0.000000]);
const feature1 = new Float32Array([0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.040312, 1.496309, -0.901509, -0.163483, -1.278023, 1.452520, 0.474856, 0.348183, 2.034660, 0.000000, 0.136098, -0.502058, 0.768680, 1.156073, -0.304473, 0.582514, 0.537316, 0.000000, 0.000000, 0.000000, -0.000000, 0.269032, -0.864517, -0.938016, -1.266153, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, -0.293484, 1.498941, -0.444025, 0.537662, -0.385227, 1.532501, -0.240901, -0.166661, 1.753861, -0.000000, 0.571667, -0.675960, 0.830575, 0.528118, 0.300679, -0.279620, -0.304934, 0.000000, 0.000000, 0.000000, 0.000000, 0.304800, -0.805438, 0.048439, -1.323702, 1.050594, -1.040584, -0.499668, -0.487523, 1.944431, -0.000000, 0.000000, 0.000000, 0.000000, -0.000000, 0.000000, 0.000000, -0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000]);
const paddedData0 = new Float32Array(2 * 1280);
paddedData0.set(feature0.slice(0, 1280), 0);
const paddedData1 = new Float32Array(2 * 1280);
paddedData1.set(feature1.slice(0, 1280), 0);
let cachedSession: InferenceSession | null = null;
let isLoadingModel = false;
const getSession = async (): Promise<InferenceSession | null> => {
  if (cachedSession) return cachedSession;
  if (isLoadingModel) return null;
  isLoadingModel = true;
  try {
    const asset = await Asset.loadAsync(require('../../assets/meditation_model_eegnetFINAL.ort')); //  final.onnx  eegnet.ort
    const sourceUri = asset[0].localUri!;
    const destPath = `${FileSystem.Paths.cache.uri}meditation_model_eegnetFINAL.ort`;
    const base64 = await readAsStringAsync(sourceUri, { encoding: 'base64' });
    await writeAsStringAsync(destPath, base64, { encoding: 'base64' });
    cachedSession = await InferenceSession.create(
      destPath,
      {
        executionProviders: ['nnapi', 'cpu'],  // Enable NNAPI acceleration
      }
    );
    console.log('Model loaded successfully');
    return cachedSession;
  } catch (err) {
    console.warn("onnx error:", err);
    return null;
  } finally {
    isLoadingModel = false;
  }
};

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

function softmax2(logits: [number, number]): number {
  const [z0, z1] = logits;
  const e0 = Math.exp(z0);
  const e1 = Math.exp(z1 );
  const sum = e0 + e1;
  return e0/sum;
}

const App = () => {
  const [manager] = useState(Platform.OS !== 'web' ? new BleManager() : null);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [receivedData, setReceivedData] = useState('');
  const receivedDataRef = useRef('');
  const [fileContent, setFileContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [webBluetoothDevice, setWebBluetoothDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inMemoryData, setInMemoryData] = useState('');
  const [liveChartData, setLiveChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [modalDims, setModalDims] = useState({ width: 0, height: 0 });
  const [monitorSubscription, setMonitorSubscription] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [size, setSize] = useState(100);
  const [isSleepMode, setIsSleepMode] = useState(false);
  const isDisconnectingRef = useRef(false);
  const sizeAnim = useRef(new Animated.Value(100)).current;
  const [MLthreshold, setMLthreshold] = useState(0.5);
  const MLthreholdDif = 0.1;
  const medOrWander = useRef(false);
  const MLpercentage = useRef(0);
  const MLcounter = useRef(0);
  const fullyReceivedArray = useRef(false);
  
  const isAndroid = Platform.OS === 'android';
  const isElectron = typeof window !== 'undefined' && window.electronAPI;
  const isWeb = Platform.OS === 'web';
  const sleepDataDir = isWeb ? null : `${FileSystem.documentDirectory}sleepData`;
  const filePath = isWeb ? null : `${sleepDataDir}/data.txt`;
  const meditationColor = (size == 200) ? '#30a06a' : '#7b41b1';

  const sizeAction = useRef<'increase' | 'decrease' | null>(null);
  const [mlTick, setMlTick] = useState(0);
  useEffect(() => {
    if (sizeAction.current === 'increase') {
      increaseSize();
      sizeAction.current = null;
    } else if (sizeAction.current === 'decrease') {
      decreaseSize();
      sizeAction.current = null;
    }
  }, [mlTick]);

  const MLthresholdRef = useRef(MLthreshold);
  useEffect(() => {
    MLthresholdRef.current = MLthreshold;
  }, [MLthreshold]);

  useEffect(() => {
    if (!isWeb) {
      requestPermissions();
      console.log('SLEEP_DATA_DIR:', SLEEP_DATA_DIR);
      console.log('Platform:', Platform.OS);
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
  }, []);

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      console.log('Permissions granted:', granted);

      const allGranted = Object.values(granted).every(
        val => val === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allGranted) {
        // Only create directory AFTER permissions are confirmed
        await createDirectory();
      } else {
        console.warn('Some permissions were denied');
      }
    }
  };  

  const createDirectory = async () => {
    try {
      const exists = await RNFS.exists(SLEEP_DATA_DIR);
      console.log('Directory exists:', exists);
      if (!exists) {
        await RNFS.mkdir(SLEEP_DATA_DIR);
        console.log('Directory created successfully');
      } else {
        console.log('Directory already exists, skipping mkdir');
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
        // Electron path
        console.log('Using Electron native Bluetooth');

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

        const snoozyDevice = devices.find(d => d.name === 'Snoozy');
        if (!snoozyDevice) {
          alert('Snoozy device not found. Make sure it is powered on and nearby.');
          return;
        }

        const connectResult = await window.electronAPI.bluetooth.connect(snoozyDevice.id);
        console.log('Connected:', connectResult);

        const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        const NUS_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

        await window.electronAPI.bluetooth.subscribe(NUS_SERVICE_UUID, NUS_TX_CHARACTERISTIC_UUID);

        window.electronAPI.bluetooth.onData((data) => {
          handleReceivedData(data);
        });

        window.electronAPI.bluetooth.onDisconnect(() => {
          console.log('Snoozy disconnected');
          alert('Snoozy disconnected');
          setWebBluetoothDevice(null);
          setIsConnected(false);
        });

        setWebBluetoothDevice({ name: snoozyDevice.name, id: snoozyDevice.id });
        setIsConnected(true);

      } else {
        // --- Android path using react-native-ble-plx ---
        const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        const NUS_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

        // Request permissions on Android 12+
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);
          const allGranted = Object.values(granted).every(
            val => val === PermissionsAndroid.RESULTS.GRANTED
          );
          if (!allGranted) {
            alert('Bluetooth and storage permissions are required.');
            return;
          }

          // Ensure the sleepData directory exists before any writes
          await RNFS.mkdir(SLEEP_DATA_DIR);
        }

        console.log('Scanning for Snoozy...');
        // Scan for the Snoozy device
        const snoozyDevice = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            bleManager.stopDeviceScan();
            reject(new Error('Snoozy device not found. Make sure it is powered on and nearby.'));
          }, 10000); // 10 second scan timeout

          bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
              clearTimeout(timeout);
              bleManager.stopDeviceScan();
              reject(error);
              return;
            }
            if (device?.name === 'Snoozy') {
              clearTimeout(timeout);
              bleManager.stopDeviceScan();
              resolve(device);
            }
          });
        });

        console.log('Found Snoozy, connecting...');

        // Connect and discover services
        const connectedDevice = await snoozyDevice.connect();
        await connectedDevice.discoverAllServicesAndCharacteristics();

        console.log('Connected to Snoozy');

        // Subscribe to NUS TX notifications
        connectedDevice.monitorCharacteristicForService(
          NUS_SERVICE_UUID,
          NUS_TX_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (error) {
              console.error('Notification error:', error);
              return;
            }
            // Decode base64 value to string
            const raw = characteristic?.value;
            if (raw) {
              const bytes = Base64.toByteArray(raw);
              const decoded = new TextDecoder().decode(bytes);
              handleReceivedData(decoded);
            }
          }
        );

        // Listen for disconnect
        connectedDevice.onDisconnected((error, device) => {
          console.log('Snoozy disconnected');
          alert('Snoozy disconnected');
          setWebBluetoothDevice(null);
          setIsConnected(false);
        });

        setWebBluetoothDevice({ name: connectedDevice.name, id: connectedDevice.id });
        setIsConnected(true);
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
      // Electron path
      try {
        if (window.electronAPI.bluetooth.removeAllListeners) {
          await window.electronAPI.bluetooth.removeAllListeners();
        }
        await window.electronAPI.bluetooth.disconnect();
        setWebBluetoothDevice(null);
        setIsConnected(false);
        alert('Device disconnected');
      } catch (error) {
        console.error('Error disconnecting Electron Bluetooth:', error);
        setWebBluetoothDevice(null);
        setIsConnected(false);
      }

    } else if (webBluetoothDevice) {
      // Android path using react-native-ble-plx
      try {
        await bleManager.cancelDeviceConnection(webBluetoothDevice.id);
        setWebBluetoothDevice(null);
        setIsConnected(false);
        alert('Device disconnected');
      } catch (error) {
        console.error('Error disconnecting Android Bluetooth:', error);
        // Still update state even if disconnect fails
        setWebBluetoothDevice(null);
        setIsConnected(false);
      }

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
    console.log('Mobile BL starting');
    try {
      manager.stopDeviceScan();
      setIsScanning(false);

      // Disconnect old device if one exists
      if (connectedDevice) {
        try {
          console.log('Disconnecting old device before reconnecting...');
          await manager.cancelDeviceConnection(connectedDevice.id);
          console.log('Old device disconnected');
          // Small delay to let it fully disconnect
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (disconnectError) {
          console.warn('Failed to disconnect old device (continuing anyway):', disconnectError);
        }
      }

      // Reset disconnecting flag from previous session
      isDisconnectingRef.current = false;

      console.log('Connecting to device:', device.name);
      const connected = await manager.connectToDevice(device.id);
      setConnectedDevice(connected);

      console.log('Discovering services...');
      await connected.discoverAllServicesAndCharacteristics();

      // Nordic UART Service (NUS) UUIDs
      const NUS_SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
      const NUS_TX_CHARACTERISTIC_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

      console.log('Setting up NUS monitoring...');

      // Remove old subscription if it exists
      if (monitorSubscription) {
        try {
          monitorSubscription.remove();
        } catch (e) {
          console.warn('Failed to remove old subscription:', e);
        }
      }

      // Monitor the NUS TX characteristic
      const subscription = connected.monitorCharacteristicForService(
        NUS_SERVICE_UUID,
        NUS_TX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (isDisconnectingRef.current) {
            return;
          }

          if (error) {
            if (error.errorCode === 2 || error.reason === 'DeviceDisconnected') {
              return;
            }
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            const bytes = Base64.toByteArray(characteristic.value);
            const data = new TextDecoder().decode(bytes);
            handleReceivedData(data);
          }
        }
      );

      setMonitorSubscription(subscription);
      setIsConnected(true);
      console.log('Successfully connected and monitoring');

      // Send "start" to device over NUS RX characteristic
      const NUS_RX_CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
      console.log('Sending "start" to device...');
      const startMessage = Base64.fromByteArray(new TextEncoder().encode('start_meditation'));
      await connected.writeCharacteristicWithResponseForService(  // writeCharacteristicWithoutResponseForService
        NUS_SERVICE_UUID,
        NUS_RX_CHARACTERISTIC_UUID,
        startMessage,
      );
      console.log('Sent "start" to device');

    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', `Failed to connect: ${error.message}`);
      setConnectedDevice(null);
      setIsConnected(false);
      isDisconnectingRef.current = false;
    }
  };

  const handleReceivedData = async (data) => {
    if (isDisconnectingRef.current) {
      //console.log('Ignoring data during disconnect');
      return;
    }
    
    // Check again before each state update
    if (isDisconnectingRef.current) return;
    // setReceivedData(prev => prev + data);
    // setReceivedData(prev => prev + data);

    //console.log('RECEIVED DATA: ', data);
    receivedDataRef.current = receivedDataRef.current + data;
    //console.log('UPDATED ARRAY: ', receivedDataRef.current);
    if (data.includes(']')) fullyReceivedArray.current = true;
    if(fullyReceivedArray.current) console.log('Full Array: ', receivedDataRef.current);

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
      // Electron path
      try {
        const result = await window.electronAPI.appendToFile(dataWithTimestamp, dateString + '(' + hours + ')');
        if (result.success) {
          console.log('Data appended to:', result.path);
          const values = dataWithTimestamp.split(',');
          const timeWithoutZ = values[0].replace('Z', '');
          const timestampMs = new Date(dateString + 'T' + timeWithoutZ).getTime();
          setLiveChartData(prev => {
            const updated = [...prev, { x: timestampMs, y: parseFloat(data) }];
            return updated.length > 100 ? updated.slice(-100) : updated;
          });
        } else {
          console.error('Failed to append data:', result.error);
        }
      } catch (error) {
        console.error('Error appending to file:', error);
      }

    } else if (isWeb) {
      // Web path
      saveWebData(dataWithTimestamp);

    } else {
      if(fullyReceivedArray.current) {
        // Android path using react-native-fs
        if(isSleepMode) {
          try {
            const filePath = `${SLEEP_DATA_DIR}/${dateString}(${hours}).csv`;

            const fileExists = await RNFS.exists(filePath);
            if (!fileExists) {
              await RNFS.writeFile(filePath, dataWithTimestamp + '\n', 'utf8');
            } else {
              await RNFS.appendFile(filePath, dataWithTimestamp + '\n', 'utf8');
            }

            // Update live chart
            const values = dataWithTimestamp.split(',');
            const timeWithoutZ = values[0].replace('Z', '');
            const timestampMs = new Date(dateString + 'T' + timeWithoutZ).getTime();
            setLiveChartData(prev => {
              const updated = [...prev, { x: timestampMs, y: parseFloat(data) }];
              return updated.length > 100 ? updated.slice(-100) : updated;
            });

            console.log('Android-Data appended to:', filePath);
          } catch (error) {
            console.error('Error writing to file:', error);
          }
        } else {
          try {
            console.log('ML Step 1: copying session');
            const mainFeature = new Float32Array(JSON.parse(receivedDataRef.current));
            const session = await getSession();
            if (!session) return
            console.log('ML Step 2: session copied; converting features into ', session.inputNames);
            console.log('ML Step 3: features converted; converting to tensor', mainFeature);
            const tensor = new Tensor('float32', mainFeature, [1, 2, 1280]);
            console.log('ML Step 4: converted to tensor; inputting data');
            console.log('Expected output: ', session.outputNames);
            const results = await session.run({ eeg: tensor });
            console.log('ML Step 5: Inference result:', JSON.stringify(results));
            const logitsData = results.logits.data as Float32Array;
            const medAns = softmax2([logitsData[0], logitsData[1]]);
            console.log('ML answer: ', medAns);
            MLpercentage.current = MLpercentage.current + Number(medAns);
            MLcounter.current = MLcounter.current + 1;
            if(MLcounter.current == 1) {  //     5
              const MLresult = medAns; //     (MLpercentage + Number(medAns)) / 6
              console.log('comparing ', MLresult, ' with ', MLthresholdRef.current);
              // if( (medOrWander.current&&(MLresult>MLthreshold+MLthreholdDif)) || (!medOrWander.current&&(MLresult>MLthreshold-MLthreholdDif)) ) {
              //   console.log('INCREASING');
              //   sizeAction.current = 'increase';
              //   medOrWander.current = true;
              // } else if(MLresult<MLthreshold-MLthreholdDif) {
              //   console.log('DECREASING');
              //   sizeAction.current = 'decrease';
              //   medOrWander.current = false;
              // } else {
              //   console.log('NOTHING');
              // }
              if(MLresult>MLthresholdRef.current) {
                console.log('INCREASING');
                sizeAction.current = 'increase';
                medOrWander.current = true;
              } else {
                console.log('DECREASING');
                sizeAction.current = 'decrease';
                medOrWander.current = false;
              }
              setMlTick(prev => prev + 1);
              MLpercentage.current = 0;
              MLcounter.current = 0;
            }
          } catch (err) {
            console.warn("BL Meditation ML error:", err);
          }
        }
        fullyReceivedArray.current = false;
        receivedDataRef.current = '';
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

  const toggleDataListening = () => {
    if (isDisconnectingRef.current) {
      // Resume
      console.log('Resuming data listening...');
      isDisconnectingRef.current = false;
      setIsPaused(false);
      Alert.alert('Resumed', 'Data listening resumed');
    } else {
      // Pause
      console.log('Pausing data listening...');
      isDisconnectingRef.current = true;
      setIsPaused(true);
      Alert.alert('Paused', 'Data listening paused');
    }
  };

  const handleConnect = () => {
    if (isWeb) {
      connectWebBluetooth();
    } else {
      scanDevices();
    }
  };

  const disconnectDevice = async () => {
    try {
      if (isWeb) {
        disconnectWebBluetooth();
      } else {
        // For Android, just tell user to close the app
        Alert.alert(
          'Disconnect', 
          'To fully disconnect Bluetooth, please close the app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const deviceName = isWeb 
    ? (webBluetoothDevice ? webBluetoothDevice.name || 'Unknown Device' : '')
    : (connectedDevice ? connectedDevice.name : '');

  const decreaseSize = () => {
    const newSize = Math.max(16, size - 25);
    Animated.timing(sizeAnim, {
      toValue: newSize,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    setSize(newSize);
  };

  const increaseSize = () => {
    const newSize = Math.min(200, size + 25);
    Animated.timing(sizeAnim, {
      toValue: newSize,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setSize(newSize);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { marginTop: 10, marginBottom: -15 }]}>Bluetooth</Text>
        
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
            {isConnected && (
              <TouchableOpacity
                style={styles.button}
                onPress={toggleDataListening}>
                <Text style={styles.buttonText}>
                  {isPaused ? 'Resume Data' : 'Pause Data'}
                </Text>
              </TouchableOpacity>
            )}
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
            <ScrollView style={styles.deviceList} nestedScrollEnabled>
              {devices.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.deviceItem}
                  onPress={() => connectToDevice(item)}
                >
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.deviceId}>{item.id}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, !isSleepMode && styles.buttonDisabled]} 
              onPress={() => setShowChart(true)}
              disabled={!isSleepMode}
            >
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
              : 'Data'}
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
          <View
            style={styles.chartModalOverlay}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setModalDims({ width, height });
            }}
          >
            <View
              style={[
                styles.chartModalContent,
                isAndroid && {
                  width: modalDims.height,
                  height: modalDims.width,
                  transform: [{ rotate: '90deg' }],
                }
              ]}
            >
              <View style={[styles.chartHeader, { marginTop: -15 }]}>
                <Text style={styles.chartTitle}>LIVE</Text>
                <TouchableOpacity
                  onPress={() => setShowChart(false)} 
                  style={[styles.chartCloseButton, { marginRight: 25 }]}
                >
                  <Text style={styles.chartCloseButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              {(() => {
                const chartWidth  = (isAndroid) ? modalDims.height : modalDims.width;
                const chartHeight = (isAndroid) ? modalDims.width : modalDims.height;
                return (
                  <>
                  <VictoryChart
                    width={chartWidth * 0.9}
                    height={chartHeight * 0.7}
                    scale={{ x: 'time' }}
                    style={{
                      background: { fill: BGColor2 },
                      justifyContent: 'center',
                    }}
                    padding={{ top: 10, bottom: 40, left: 50, right: 10 }} 
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
                        //axisLabel: { padding: 10, fill: textDarkColor },
                        //tickLabels: { angle: -45, fill: textLightColor },
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
                  </>
                );
              })()}
            </View>
          </View>
        </Modal>

        <View style={styles.circleContainer}>
          <View
            style={{
              width: 200 + 16,
              height: 200 + 16,
              borderRadius: (200 + 16) / 2,
              borderWidth: 8,
              borderColor: textLightColor,
              position: 'absolute',
            }}
          />
          <Animated.View
            style={[
              styles.circle,
              {
                width: sizeAnim,
                height: sizeAnim,
                borderRadius: sizeAnim.interpolate({
                  inputRange: [16, 200],
                  outputRange: [8, 100],
                }),
                backgroundColor: isSleepMode ? buttonColor : meditationColor,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isSleepMode ? buttonColor : meditationColor,
              justifyContent: 'center',
              marginTop: 20,
            },
          ]}
          onPress={async () => {
            setIsSleepMode(prev => !prev);
          }}
        >
          <Text style={styles.buttonText}>
            {isSleepMode ? 'Sleep Mode' : 'Meditation Mode'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.section, { paddingTop: 20 }]}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isSleepMode ? buttonColor : meditationColor,
                },
              ]}
              //onPress={increaseSize}>
              onPress={() => {
                //increaseSize();
                // (async () => {
                //   try {
                //     console.log('ML Step 1: copying session');
                //     const session = await getSession();
                //     if (!session) return
                //     console.log('ML Step 2: session copied; converting features into ', session.inputNames);
                //     console.log('ML Step 3: features converted; converting to tensor', feature0);
                //     // const tensor = new Tensor('float32', feature0, [1, feature0.length]);
                //     const tensor = new Tensor('float32', paddedData0, [1, 2, 1280]);  // paddedData0 paddedStringToFloat0
                //     console.log('ML Step 4: converted to tensor; inputting data');
                //     console.log('Expected output: ', session.outputNames);
                //     const results = await session.run({ eeg: tensor }); // input eeg
                //     console.log('ML Step 5: Inference result:', JSON.stringify(results));
                //     const medAns = results.logits.data["0"];     // probabilities logits
                //     console.log('Meditation%:', medAns, ' | meditating? ', (medAns>MLthreshold));
                //   } catch (err) {
                //     console.warn("Meditation ML error:", err);
                //   }
                // })();
              }}
              >
              <Text style={styles.buttonText}>Run Sleep</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isSleepMode ? buttonColor : meditationColor,
                },
              ]}
              //</View>onPress={decreaseSize}>
              // onPress={() => {
              //   decreaseSize();
              //   (async () => {
              //     try {
              //       console.log('ML Step 1: copying session');
              //       const session = await getSession();
              //       if (!session) return
              //       console.log('ML Step 2: session copied; converting features into ', session.inputNames);
              //       console.log('ML Step 3: features converted; converting to tensor', feature1);
              //       // const tensor = new Tensor('float32', feature1, [1, 1, feature1.length]);
              //       const tensor = new Tensor('float32', paddedData1, [1, 2, 1280]);
              //       console.log('ML Step 4: converted to tensor; inputting data');
              //       console.log('Expected output: ', session.outputNames);
              //       const results = await session.run({ eeg: tensor }); // input eeg
              //       console.log('ML Step 5: Inference result:', JSON.stringify(results));
              //       const medAns = results.logits.data["0"];     // probabilities logits
              //       console.log('Meditation%:', medAns, ' | meditating? ', (medAns>MLthreshold));
              //     } catch (err) {
              //       console.warn("Meditation ML error:", err);
              //     }
              //   })();
              // }}
              onPress={() => { (async () => {
                try {
                  const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
                  const NUS_RX_CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
                  console.log('Sending "start" to device...');
                  const startMessage = Base64.fromByteArray(new TextEncoder().encode('start_meditation'));
                  await connectedDevice.writeCharacteristicWithResponseForService(
                    NUS_SERVICE_UUID,
                    NUS_RX_CHARACTERISTIC_UUID,
                    startMessage,
                  );
                } catch {}
              })(); }}
              >
              <Text style={styles.buttonText}>Run Meditation</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={[styles.label, {
            marginTop: -20
          }]}>threshold: {(MLthreshold).toFixed(3)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.010}
            maximumValue={0.990}
            value={MLthreshold}
            onValueChange={setMLthreshold}
            minimumTrackTintColor={isSleepMode ? buttonColor : meditationColor}
            maximumTrackTintColor={BGColor2}
            thumbTintColor={isSleepMode ? buttonColor : meditationColor}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BGColor1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
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
    includeFontPadding: false,
  },
  deviceList: {
    maxHeight: 460,
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
  circleContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    // width, height, borderRadius, backgroundColor applied dynamically
  },
  sliderContainer: {
    width: '100%',
  },
  label: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: textDarkColor,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default App;