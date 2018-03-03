/**
 * File: photopizza.ino
 * Created on: 22 feb 2015 г.
 * Description:
 * PhotoPizza DIY is an open source project of 360° product photography turntable.
 *
 * Author: Roman Savrulin <romeo.deepmind@gmail.com>
 * Project Author: Vladimir Matiyasevith <vladimir.m@makerdrive.com>
 * Project Site: PhotoPizza.org
 *
 * Copyright: 2015 MakerDrive
 * Copying permission statement:
 *  This file is part of PhotoPizza DIY.
 *
 *  PhotoPizza DIY is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

/////////////
//need to include libs here, because of compile error in other files.
#include <EEPROM.h>
#include <Arduino.h>
#include <LiquidCrystal.h>
#include <Wire.h>

#include <AccelStepper.h>
#include <LiquidCrystal_I2C.h>
#include <SoftTimer.h>
////////////
#include "lcdIrController.h"
#include "presetManager.h"
#include "IRReceiver.h"

using namespace PhotoPizza;
static presetManager *presetMgr = NULL;
static lcdIrController controller;

String inputString = ""; // input string buffer
boolean stringComplete = false; // whether the string is complete

////////////////////////////////////////////////////////////////////////////////////

void setup() {
  Serial.begin(115200);
  controller.init();
  presetMgr = presetManager::get();

  // reserve 200 bytes for the inputString:
  inputString.reserve(200);
}

void yield() {
  if (presetMgr)
    presetMgr->loop(); //very carefully! do not allow delay call in presetMgr
}

void loop() {
  presetMgr->loop();
  controller.loop();
  SoftTimer.loop();

  if (stringComplete) {
    Serial.println(controller.emulateBtn(inputString));
    // clear the string:
    inputString = F("");
    stringComplete = false;
  }
}

/*
 SerialEvent occurs whenever a new data comes in the
 hardware serial RX.  This routine is run between each
 time loop() runs, so using delay inside loop can delay
 response.  Multiple bytes of data may be available.
 */
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char) Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

