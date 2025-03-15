# PhotoPizza DIY

## A Message from the Author

**I had to leave my country. Currently, I don't have access to the equipment needed for developing and testing the project, but I plan to restore the project description and publish all the materials developed before my departure soon.**

**I am looking for like-minded individuals worldwide who want to earn money from the open-source project, sell ready-made equipment, and participate in its development. I will post your contact information on the website, provide additional information, and packaging blueprints. Clients who don't have time to assemble the equipment themselves will reach out to you. I will not take any percentage of your profit. You will be the official representatives of this project in your country.**

**For inquiries, please contact photopizza@rnd-pro.com.**

## 360° Product Photography Turntable

**PhotoPizza** is an open-source project for creating a turntable that allows you to take pictures of objects from all directions (3D-photo-360 spin-photo). The control unit platform is based on Espruino. You can self-assemble the device from available components using detailed instructions, and you do not need deep knowledge in electronics. The turntable is also suitable for 3D scanning using photogrammetry methods.

### Requirements

#### External Control Unit

##### Electronics

- ESP32 Controller - 1
- Relay - 1
- Stepper motor driver board - 1
- Stepper motor driver - 1
- Heat sink - 1
- Power contact expansion board - 1
- IR receiver - 1
- Display - 1
- 3.5 Jack connector - 1
- Fan - 1
- Batteries for IR remote - 2

##### Body Parts

- Base - 1
- Cover - 1
- Front panel - 1
- Screen mounting panel - 1
- Left panel with 3.5 Jack cutout - 1
- Right panel: fan - 1
- Rear panel - 1
- 3.5 Jack mounting part - 1
- IR receiver mounting part - 1
- IR remote - 1

##### Fasteners

- Screw 3*16 - 22
- Screw 3*25 - 2
- Nut M3 - 33
- Countersunk screw 6*35 - 4
- Nut M6 - 4
- Furniture nut M6 - 4

##### Wires

- Power wire 5V: male-female "+" 12 cm - 3
- Power wire 5V: male-female "-" 12 cm - 3
- Power wire 5V: female-female "+" 12 cm - 3
- Power wire 5V: female-female "-" 12 cm - 3
- Power wire 12V: male-male "+" long - 1
- Power wire 12V: male-male "-" long - 1
- Control wire: male-male 12 cm - 3
- Control wire: male-female 12 cm - 5
- Extension wire 3.5 Jack - 1
- Sync wire - 1

#### Turntable D340

##### Acrylic Parts

- Base - 1
- Disk 340 cm - 1
- Motor mount - 1
- Motor spacer - 1
- Background disk, white 34 cm

##### Fasteners

- Bearings 608ZZ for rollers - 8
- Bolt 8*40 for rollers and central axis - 9
- Nuts M8 for rollers, central axis, and legs - 26
- Clamps for rollers - 8
- Screw M8x60 DIN912 (legs) - 8
- Wing nuts M8 for leg mounting - 8
- Screw M6x35 for clamping system - 3
- Nut M6 for clamping system - 6
- Screw M3x16 for motor mounting - 4
- Spring for clamping system - 2
- Drive roller - 1
- Rubber for drive roller - 4

##### Electrical Components

- Nema 17 stepper motor - 1
- Wire for motor connection - 1

#### Turntable D480

##### Acrylic Parts

- Base - 1
- Disk 480 cm - 1
- Motor mount - 1
- Motor spacer - 1
- Background disk, white 48 cm

##### Fasteners

- Bearings 608ZZ for rollers - 12
- Bolt 8*40 for rollers and central axis - 13
- Nuts M8 for rollers, central axis, and legs - 38
- Clamps for rollers - 12
- Screw M8x60 DIN912 (legs) - 12
- Wing nuts M8 for leg mounting - 12
- Screw M6x35 for clamping system - 3
- Nut M6 for clamping system - 6
- Screw M3x16 for motor mounting - 4
- Spring for clamping system - 2
- Drive roller - 1
- Rubber for drive roller - 4

##### Electrical Components

- Motor - 1
- Wire for motor connection - 1

#### Turntable D700

##### Acrylic Parts

- Base - 1
- Disk 70 cm - 1
- Motor mount - 1
- Motor spacer - 1
- Background disk, white 70 cm

##### Fasteners

- Bearings 608ZZ for rollers - 24
- Bolt 8*40 for rollers and central axis - 25
- Nuts M8 for rollers, central axis, and legs - 62
- Clamps for rollers - 24
- Screw M8x60 DIN912 (legs) - 12
- Wing nuts M8 for leg mounting - 12
- Screw M6x35 for clamping system - 3
- Nut M6 for clamping system - 6
- Screw M3x16 for motor mounting - 4
- Spring for clamping system - 2
- Drive roller - 1
- Rubber for drive roller - 4

##### Electrical Components

- Motor - 1
- Wire for motor connection - 1

#### Turntable D850

##### Acrylic Parts

- Base - 1
- Disk 85 cm - 1
- Motor mount - 1
- Motor spacer - 1
- Background disk, white 85 cm

##### Fasteners

- Bearings 608ZZ for rollers - 24
- Bolt 8*40 for rollers and central axis - 25
- Nuts M8 for rollers, central axis, and legs - 62
- Clamps for rollers - 24
- Screw M8x60 DIN912 (legs) - 12
- Wing nuts M8 for leg mounting - 12
- Screw M6x35 for clamping system - 6
- Nut M6 for clamping system - 12
- Screw M3x16 for motor mounting - 8
- Spring for clamping system - 4
- Drive roller - 2
- Rubber for drive roller - 8

##### Electrical Components

- Motor - 2
- Wire for motor connection - 2

## User Guide, Firmware Version "PhotoPizza v7 (ESPRUINO)"

### IR Remote Control

#### Description of IR Remote Buttons

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

#### How to Use the IR Remote Control

The remote allows you to fully control the turntable, set shooting parameters, and start/stop the shooting process.

### Shooting Process

1. **Object Placement:**
   - Place the item you want to photograph on the turntable.

2. **Setting Parameters:**
   - Use the IR remote to set the necessary shooting parameters:
     - Number of frames (`frame`).
     - Delay (`delay`) - delay time in milliseconds (e.g., `1000` milliseconds = 1 second).
     - Pause (`pause`) - pause time in milliseconds (e.g., `500` milliseconds = 0.5 seconds).
     - Speed (`speed`) - rotation speed in steps per second.
     - Rotation angle (`degreesX`) - rotation angle in degrees.

3. **Start Shooting:**
   - Press the `OK` button on the IR remote to confirm the settings.
   - To start the shooting process, press the `OK` button again. The turntable will start rotating and taking pictures automatically according to the set parameters.

4. **Stop Shooting:**
   - To stop the shooting process, press the `OK` button again.

5. **Infinite Shooting:**
   - To enable the infinite shooting mode, use the `"infinity"` command.

6. **Video Shooting:**
   - For video shooting, set the parameters for continuous rotation and turn on the camera in video mode. The turntable will rotate smoothly, providing even shooting from all sides.

7. **Saving Settings:**
   - After shooting, if you want to save the current settings for future shoots, press the `SAVE` button on the IR remote.

### Calibration Process

#### Why Calibration is Needed

Turntable calibration is necessary for accurately determining the rotation angle and ensuring correct object positioning. This allows the table to rotate precisely 360 degrees, returning to the starting point, which is important for creating high-quality 3D models, panoramic photos, and video shooting.

#### Calibration Process

1. **Preparation:**
   - Place the item opposite the drive roller on the turntable.

2. **Start Calibration:**
   - Press the `CALIBR` button on the IR remote to start the calibration process.

3. **Calibration Process:**
   - The turntable will start rotating. Stop it when the disk has rotated 360 degrees and is opposite the drive roller.
   - To stop the rotation, press the `OK` button.

4. **Saving Calibration:**
   - After completing the calibration process, press the `SAVE` button on the IR remote to save the settings.

### Wi-Fi Control

#### Connecting to Wi-Fi

The system can operate in two modes:

1. **Access Point (AP):**
   - The device creates an access point with SSID `PhotoPizza` and password `9992030360`.
   - To select this mode, set the `wirelessType` parameter to `ap`.

2. **Connecting to an Existing Network (Client):**
   - To connect to an existing network, set the `wirelessType` parameter to `conn`.
   - Set the network SSID in the `wifiSsid` parameter and the password in the `wifiPassword` parameter.

#### Web Server

Wi-Fi control is an additional way to control the system. Through the web interface, you can manage the system state, change settings, and get current data.

1. The system launches a WebSocket server on the port specified in the configuration (`wsPort`).
2. Through the web interface, you can manage the system state, change settings, and get current data.

### Android Application

#### PhotoPizza Remote App

Now an official Android application is available that allows you to control the PhotoPizza turntable via Wi-Fi connection. The application provides a convenient interface for setting shooting parameters, starting and stopping the process, and saving configurations.

#### Main Features:

- Connect to the PhotoPizza device via Wi-Fi
- Configure all shooting parameters (number of frames, delay, pause, speed, rotation angle)
- Start and stop the shooting process
- Calibrate the turntable
- Save and load user settings
- Test shot
- Infinite rotation mode for video shooting

#### Where to Download:

- Project repository: [https://github.com/PhotoPizza/remote](https://github.com/PhotoPizza/remote)
- Download APK file: [https://github.com/PhotoPizza/remote/blob/master/PhotoPizza.apk](https://github.com/PhotoPizza/remote/blob/master/PhotoPizza.apk)

#### Requirements:

- Android 5.0 or higher
- PhotoPizza device with firmware v7 (ESPRUINO) or newer
- Wi-Fi connection

### System Management

#### Saving Configuration

To save the current settings, use the "Save Config" command in the management interface or press the `SAVE` button on the IR remote.

#### Connecting to Wi-Fi

1. When connecting to Wi-Fi, the status is displayed on the screen.
2. If the connection is lost, the system will automatically attempt to reconnect.

### Working with Screens

#### Status Display

The screen displays current settings and system status, such as the number of remaining frames, speed, and IP address.

---

**PhotoPizza** is a great opportunity to create 3D photos and spin photos yourself. Join our community and help make the project even better!
