/**
 * File: IRReceiver.cpp
 * Created on: 26 feb 2015 г.
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

#include "IRReceiver.h"
#include <Arduino.h>
#include "defines.h"

//TODO: convert to class

///////////  IR Consts
#define IR_BIT_LENGTH 32    // number of bits sent by IR remote
#define FirstLastBit 15     // divide 32 bits into two 15 bit chunks for integer variables. Ignore center two bits. they are all the same.
#define BIT_1 1500          // Binary 1 threshold (Microseconds)
#define BIT_0 450           // Binary 0 threshold (Microseconds)
#define BIT_START 4000      // Start bit threshold (Microseconds)

#define IR_PIN 2            // IR Sensor pin

#define IR_TIMEO 100000L    //

/**
 * IR pulses encode binary "0" as a short pulse, and binary "1"
 * as a long pulse.  Given an array containing pulse lengths,
 * convert this to an array containing binary values
 */

static volatile char pulseNum = 0;
static volatile unsigned long lastPulseTime = 0;
static volatile bool ready = false;
static volatile bool reading = false;
static volatile int code;
static volatile int seed;

static void prvIRQ();

int IrGetCode() {
  if (ready) {
    Serial.println((String) F("IR ReadCode: ") + code);
    pulseNum = 0;
    ready = false;
    return code;
  }else
    return 0;
}

void IrInit() {
  pinMode(IR_PIN, INPUT_PULLUP);
  attachInterrupt(0, prvIRQ, CHANGE);
  interrupts();
}

static void prvIRQ() {
  if (ready) { //skip all frames if current key is not read yet
    //TODO: inc stat. frame overrun
    //Serial.println(F("BSY (IRQ)"));
    return;
  }
  unsigned long pulseTime = micros();
  unsigned long pulseLength = 0;

  int state = digitalRead(IR_PIN);

  if (!reading) { //receiving new packet
    if (pulseNum == 0 && state) {
      //Serial.println("FE");
      //TODO: inc Sat frame start error;
      lastPulseTime = pulseTime;
      return;
    }
    reading = true;
    lastPulseTime = pulseTime;
    return;
  }

  if (lastPulseTime > pulseTime) {
    //Serial.println("OVR (IRQ)");
    //TODO: inc stat. TimeOverflow, reset frame or calc correct value
    pulseNum = 0;
    lastPulseTime = pulseTime;
    return;
  }

  unsigned long timeo = pulseTime - lastPulseTime;
  if (reading && (timeo > IR_TIMEO)) {
    //Serial.println((String) F("Timeo: ") + timeo);
    //TODO: stat timeo increase
    reading = false;
    pulseNum = 0;
    lastPulseTime = pulseTime;
    return;
  }

  if (pulseNum == 0 && state) { //skip start bit
    lastPulseTime = pulseTime;
    return;
  }

  if (reading && state == 1) { //do not count time of low pulses
    lastPulseTime = pulseTime;
    return;
  }

  pulseLength = pulseTime - lastPulseTime;

  if (pulseLength < BIT_START){ //skip long impulses

    if(pulseNum < (IR_BIT_LENGTH - FirstLastBit)){
      seed = 1;
      code = 0;
    }else{

      if(pulseLength <= BIT_0){
        reading = false;
        pulseNum = 0;
        lastPulseTime = pulseTime;
        //Serial.println(F("PT Small"));
      }

      if (pulseLength > BIT_1) //is it a 1?
        code += seed;
      seed *= 2;
    }
    ++pulseNum;
  }

  if (pulseNum >= IR_BIT_LENGTH) {
    //Serial.println(F("LEN"));
    ready = true;
    reading = false;
    //TODO: inc stat frames recieved, process data
    pulseNum = 0;
  }
  lastPulseTime = pulseTime;
}

