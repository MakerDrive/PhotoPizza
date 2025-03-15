# 📱 Control Methods

## 🎮 IR Remote Control

### Description of IR Remote Buttons

1. **Parameter control buttons:**
   - `1-9, 0`: Enter numerical values for various parameters.
   - `UP`: Move up through the menu.
   - `DOWN`: Move down through the menu.
   - `LEFT`: Move left through the menu.
   - `RIGHT`: Move right through the menu.
   - `OK`: Confirm selection or change a parameter, start and stop the shooting process.
   - `SETUP`: Enter and exit the parameter setup menu.

2. **Special buttons:**
   - `SAVE`: Save the current settings.
   - `SHOT`: Test shot.
   - `CALIBR`: System calibration.
   - `WIFI`: Enable Wi-Fi.

### How to Use the IR Remote Control

The remote allows you to fully control the turntable, set shooting parameters, and start/stop the shooting process.

## 📱 Android Application

### PhotoPizza Remote App

Now an official Android application is available that allows you to control the PhotoPizza turntable via Wi-Fi connection. The application provides a convenient interface for setting shooting parameters, starting and stopping the process, and saving configurations.

### ✨ Main Features:

- Connect to the PhotoPizza device via Wi-Fi
- Configure all shooting parameters (number of frames, delay, pause, speed, rotation angle)
- Start and stop the shooting process
- Calibrate the turntable
- Save and load user settings
- Test shot
- Infinite rotation mode for video shooting

### 📥 Where to Download:

- Project repository: [https://github.com/PhotoPizza/remote](https://github.com/PhotoPizza/remote)
- Download APK file: [https://github.com/PhotoPizza/remote/blob/master/PhotoPizza.apk](https://github.com/PhotoPizza/remote/blob/master/PhotoPizza.apk)

### 📋 Requirements:

- Android 5.0 or higher
- PhotoPizza device with firmware v7 (ESPRUINO) or newer
- Wi-Fi connection

## 🌐 Wi-Fi Control

### Connecting to Wi-Fi

The system can operate in two modes:

1. **Access Point (AP):**
   - The device creates an access point with SSID `PhotoPizza` and password `9992030360`.
   - To select this mode, set the `wirelessType` parameter to `ap`.

2. **Connecting to an Existing Network (Client):**
   - To connect to an existing network, set the `wirelessType` parameter to `conn`.
   - Set the network SSID in the `wifiSsid` parameter and the password in the `wifiPassword` parameter.

### Web Server

Wi-Fi control is an additional way to control the system. Through the web interface, you can manage the system state, change settings, and get current data.

1. The system launches a WebSocket server on the port specified in the configuration (`wsPort`).
2. Through the web interface, you can manage the system state, change settings, and get current data. 