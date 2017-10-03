/**
 * File: photopizza_espruino.js
 * Created on: August 30, 2017
 * Description:
 * PhotoPizza DIY is an open source project of 360° product photography turntable.
 *
 * Author: Vladimir Matiyasevith <vladimir.m@makerdrive.ru>
 * Project Site: PhotoPizza.org
 *
 * Copyright: 2017 MakerDrive
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
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

this.ShowVersion = 'PhotoPizza v3.1.1';

this.f = new (require("FlashEEPROM"))();
require("SSD1306");
require("Font8x16").add(Graphics);

this.IRCODES = {};
this.IRCODES.calibrationStart = 25803148087;
this.IRCODES.calibrationStart_2 = 6450787021;

this.IRCODES.RedPower = 6450774781;
this.IRCODES.RedPower_2 = 25803099127;
this.IRCODES.Setup = 6450823741;
this.IRCODES.Setup_2 = 25803294967;
this.IRCODES.Up = 6450800791;
this.IRCODES.Up_2 = 25803203167;
this.IRCODES.Down = 6450796711;
this.IRCODES.Down_2 = 25803186847;
this.IRCODES.Left = 6450809461;
this.IRCODES.Left_2 = 25803237847;
this.IRCODES.Right = 6450776821;
this.IRCODES.Right_2 = 25803107287;
this.IRCODES.Ok = 6450825271;
this.IRCODES.Ok_2 = 25803301087;
this.IRCODES.Ok_3 = '';
this.IRCODES.StepperEn = '';

this.IRCODESDIG = {};
this.IRCODESDIG._1 = 6450803341;
this.IRCODESDIG._2 = 6450819151;
this.IRCODESDIG._2_2 = 8888888888888;
this.IRCODESDIG._3 = 6450786511;
this.IRCODESDIG._4 = 6450795181;
this.IRCODESDIG._5 = 6450810991;
this.IRCODESDIG._6 = 6450778351;
this.IRCODESDIG._7 = 6450799261;
this.IRCODESDIG._8 = 6450815071;
this.IRCODESDIG._8_2 = 25803260287;
this.IRCODESDIG._9 = 6450782431;
this.IRCODESDIG._0 = 6450806911;
this.IRCODESDIG._0_2 = 25803227647;

this.right = 1;
this.left = 0;
this.direction = 1;
this.dirDisplay = '';
if (this.direction === 1) {
  this.dirDisplay = 'right';
} else {
  this.dirDisplay = 'left';
}

this.saved = E.toString(this.f.read(0));

//MEMORY
if (this.saved != 'saved') {
  console.log('start save');
  this.f.write(0, 'saved');
  this.f.write(1, '109295');//allsteps
  this.f.write(2, '36');//frame
  this.f.write(3, '100');//pause
  this.f.write(4, '300');//shootingTime
  this.f.write(5, '5000');//speed
  this.f.write(6, '2000');//acceleration
  this.f.write(7, 'inter');//shootingMode
}

this.frame = E.toString(this.f.read(2)) * 1;
this.allSteps = E.toString(this.f.read(1)) * 1;
this.pause = E.toString(this.f.read(3)) * 1;
this.frameTime = E.toString(this.f.read(4)) * 1;
this.speed = E.toString(this.f.read(5)) * 1;
this.acceleration = E.toString(this.f.read(6)) * 1;
this.shootingMode = E.toString(this.f.read(7));

this.irCode = 0;
this.irDigital = '1';
this.simNum = 0;

//DISPLAY
this.marker = 0;
this.indent = 13;
this.dispay_2 = false;
this.setupMode = false;

//STEPPER
this.pinStep = P11;
this.pinEn = P12;
this.pinDir = P10;

digitalWrite(this.pinStep, 0);
digitalWrite(this.pinEn, 1);
digitalWrite(this.pinDir, this.direction);

//RELAY
this.pinRelay = P5;
this.relayOn = false;

//FLAGS
this.startFlag = false;


require("IRReceiver").connect(A0, function(code) {
  this._code = parseInt(code, 2);
  
  if (this.setupMode && this._code === this.IRCODESDIG._1 || this.setupMode && this._code === this.IRCODESDIG._2 || this.setupMode && this._code === this.IRCODESDIG._3 || this.setupMode && this._code === this.IRCODESDIG._4 || this.setupMode && this._code === this.IRCODESDIG._5 || this.setupMode && this._code === this.IRCODESDIG._6 || this.setupMode && this._code === this.IRCODESDIG._7 || this.setupMode && this._code === this.IRCODESDIG._8 || this.setupMode && this._code === this.IRCODESDIG._9 || this.setupMode && this._code === this.IRCODESDIG._0) {
  console.log('input');
    IrInput();
    return;
  }
  if (this._code === this.IRCODES.Setup && !this.setupMode && !this.poweroff || this._code === this.IRCODES.Setup_2 && !this.setupMode && !this.poweroff) {
    SettingsDisplay_1();
    console.log('Setup');
    this.simNum = 0;
    return;
  } else if (this._code === this.IRCODES.Setup && this.setupMode || this._code === this.IRCODES.Setup_2 && this.setupMode) {
    this.setupMode = false;
    NumControl();
    StartDisplay();
    console.log('Setup Exit');
    return;
  }
  if (this._code === this.IRCODES.Ok && this.startFlag && !this.poweroff || this._code === this.IRCODES.Ok_2 && this.startFlag && !this.poweroff || this._code === this.IRCODES.Ok_3 && this.startFlag && !this.poweroff) {
    this.startFlag = false;
    BtnStop();
    console.log('OK STOP');
    this.simNum = 0;
    return;
  }
  if (this._code === this.IRCODES.Ok && !this.startFlag && !this.poweroff || this._code === IRCODES.Ok_2 && !this.startFlag && !this.poweroff || this._code === this.IRCODES.Ok_3 && !this.poweroff && !this.startFlag) {
    this.startFlag = true;
    StartDisplay();
    Start();
    console.log('OK START');
    this.simNum = 0;
    return;
  }
  if (this._code === this.IRCODES.Down && !this.dispay_2 && this.setupMode || this._code === this.IRCODES.Down_2 && !this.dispay_2 && this.setupMode) {
    this.marker = this.marker + this.indent;
    SettingsDisplay_1();
    this.simNum = 0;
    console.log('Down D1');
    return;
  } else if (this._code === this.IRCODES.Down && this.dispay_2 && this.setupMode || this._code === this.IRCODES.Down_2 && this.dispay_2 && this.setupMode) {
    this.marker = this.marker + this.indent;
    SettingsDisplay_2();
    console.log('Down D2');
    this.simNum = 0;
    return;
  }
   if (this._code === this.IRCODES.Up && !this.dispay_2 && this.setupMode || this._code === this.IRCODES.Up_2 && !this.dispay_2 && this.setupMode) {
    this.marker = this.marker - this.indent;
    SettingsDisplay_1();
    this.simNum = 0;
    console.log('UP D1');
    return;
  } else if (this._code === this.IRCODES.Up && this.dispay_2 && this.setupMode || this._code === this.IRCODES.Up_2 && this.dispay_2 && this.setupMode) {
    this.marker = this.marker - this.indent;
    SettingsDisplay_2();
    console.log('UP D2');
    this.simNum = 0;
    return;
  }
  if (this._code === this.IRCODES.Right_2 && !this.dispay_2 && this.setupMode || this._code === this.IRCODES.Right && !this.dispay_2 && this.setupMode) {
    SettingsDisplay_2();
    console.log('Right');
    this.simNum = 0;
    return;
  }
  if (this._code === this.IRCODES.Left_2 && this.dispay_2 && this.setupMode || this._code === this.IRCODES.Left && this.dispay_2 && this.setupMode) {
    SettingsDisplay_1();
    console.log('Left');
    this.simNum = 0;
    return;
  }
  if (this._code === this.IRCODES.StepperEn && !this.poweroff) {
  }
  if (this._code === this.IRCODES.calibrationStart && !this.calibration&& !this.poweroff || this._code === this.IRCODES.calibrationStart_2 && !this.calibration && !this.poweroff) {
    Calibration();
    return;
  } else if (this._code === this.IRCODES.calibrationStart && this.calibration && !this.poweroff || this._code === this.IRCODES.calibrationStart_2 && this.calibration && !this.poweroff) {
    this.calibration = false;
    Stop();
  }
  if (this._code === this.IRCODES.RedPower && !this.poweroff || this._code === this.IRCODES.RedPower_2 && !this.poweroff) {
    this.g.off();
    this.poweroff = true;
    Stop();
    return;
  } else if (this._code === this.IRCODES.RedPower && this.poweroff || this._code === this.IRCODES.RedPower_2 && this.poweroff) {
    this.g.on();
    this.poweroff = false;
    LogoDisplay();
    return;
  }
  console.log(this._code);
});

function LogoDisplay(){
  
  var x1x2 = 1;
  this.g.clear();
  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString(this.ShowVersion, 10, 45);
  this.g.flip();
  var preloader = setInterval(function () {
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.drawLine(x1x2, 20, x1x2, 30);
    x1x2 += 2;
    this.g.flip();
    if (x1x2 > 126) {
      clearInterval(preloader);
      NumControl();
      StartDisplay();
    }
  }, 10);
}

function StartDisplay(){
  this.g.clear();
  this.g.setFontVector(35);
  this.g.drawString(this._frame + ' f', 0, 0);
  this.g.flip();
  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString(Math.floor(this._shootingTime / 1000) + ' SECONDS', 0, 45);
  this.g.flip();
}

function SettingsDisplay_1(){
  this.setupMode = true;
  this.dispay_2 = false;

  if (this.marker > this.indent * 4) {
    this.marker = 0;
  } else if (this.marker < 0) {
    this.marker = this.indent * 4;
  }

  this.g.clear();

  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString('>', 1, this.marker);
  this.g.drawString('>', 117, 28);
  this.g.drawString('1', 117, 0);

  this.g.drawLine(112, 0, 112, 127);

  this.nameIndent = 48;

  this.g.drawString('frame', 8, 0);
  this.g.drawString('=', this.nameIndent, 0);
  this.g.drawString(this.frame, 57, 0);

  this.g.drawString('delay', 8, this.indent);
  this.g.drawString('=', this.nameIndent, this.indent);
  this.g.drawString(this.frameTime, 57, this.indent);

  this.g.drawString('pause', 8, this.indent * 2);
  this.g.drawString('=', this.nameIndent, this.indent * 2);
  this.g.drawString(this.pause, 57, this.indent * 2);

  this.g.drawString('speed', 8, this.indent * 3);
  this.g.drawString('=', this.nameIndent, this.indent * 3);
  this.g.drawString(this.speed, 57, this.indent * 3);

  this.g.drawString('accel', 8, this.indent * 4);
  this.g.drawString('=', this.nameIndent, this.indent * 4);
  this.g.drawString(this.acceleration, 57, this.indent * 4);

  this.g.flip();
}

function SettingsDisplay_2(){
  this.setupMode = true;
  this.dispay_2 = true;

  if (this.marker > this.indent * 2) {
    this.marker = 0;
  } else if (this.marker < 0) {
    this.marker = this.indent * 2;
  }

  this.g.clear();

  this.g.setFontBitmap();
  this.g.setFont8x16();
  this.g.drawString('>', 1, this.marker);
  this.g.drawString('<', 117, 28);
  this.g.drawString('2', 117, 0);

  this.g.drawLine(112, 0, 112, 127);

  this.nameIndent = 48;

  this.g.drawString('mode', 8, 0);
  this.g.drawString('=', this.nameIndent, 0);
  this.g.drawString(this.shootingMode, 57, 0);

  this.dirDisp = 'left';

  if (this.direction === left) {
    this.dirDisp = 'left';
  } else {
    this.dirDisp = 'Right';
  }
  this.g.drawString('direc', 8, this.indent);
  this.g.drawString('=', this.nameIndent, this.indent);
  this.g.drawString(this.dirDisp, 57, this.indent);

  this.g.drawString('steps', 8, this.indent * 2);
  this.g.drawString('=', this.nameIndent, this.indent * 2);
  this.g.drawString(this.allSteps, 57, this.indent * 2);

  this.g.flip();
}

function IrInput() {

  if (this._code === this.IRCODESDIG._1) {
    this.irDigital = '1';
  }
  if (this._code === this.IRCODESDIG._2 || this._code === this.IRCODESDIG._2_2) {
    this.irDigital = '2';
  }
  if (this._code === this.IRCODESDIG._3) {
    this.irDigital = '3';
  }
  if (this._code === this.IRCODESDIG._4) {
    this.irDigital = '4';
  }
  if (this._code === this.IRCODESDIG._5) {
    this.irDigital = '5';
  }
  if (this._code === this.IRCODESDIG._6) {
    this.irDigital = '6';
  }
  if (this._code === this.IRCODESDIG._7) {
    this.irDigital = '7';
  }
  if (this._code === this.IRCODESDIG._8 || this._code === this.IRCODESDIG._8_2) {
    this.irDigital = '8';
  }
  if (this._code === this.IRCODESDIG._9) {
    this.irDigital = '9';
  }
  if (this._code === this.IRCODESDIG._0 || this._code === this.IRCODESDIG._0_2) {
    this.irDigital = '0';
  }
  if (!this.dispay_2 && this.marker === 0 && this.simNum <= 7 && this.simNum > 0) {
    this.frame = (this.frame + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === 0 && this.simNum === 0 && this.irDigital != '0') {
    this.frame = '';
    this.frame = (this.frame + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent && this.simNum <= 7 && this.simNum > 0) {
    this.frameTime = (this.frameTime + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent && this.simNum === 0 && this.irDigital != '0') {
    this.frameTime = '';
    this.frameTime = (this.frameTime + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 2 && this.simNum <= 7 && this.simNum > 0) {
    this.pause = (this.pause + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 2 && this.simNum === 0 && this.irDigital != '0') {
    this.pause = '';
    this.pause = (this.pause + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 3 && this.simNum <= 7 && this.simNum > 0) {
    this.speed = (this.speed + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 3 && this.simNum === 0 && this.irDigital != '0') {
    this.speed = '';
    this.speed = (this.speed + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 4 && this.simNum <= 7 && this.simNum > 0) {
    this.acceleration = (this.acceleration + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }
  if (!this.dispay_2 && this.marker === this.indent * 4 && this.simNum === 0 && this.irDigital != '0') {
    this.acceleration = '';
    this.acceleration = (this.acceleration + this.irDigital) * 1;
    SettingsDisplay_1();
    this.simNum++;
  }

  //DISPLAY 2
  if (this.dispay_2 && this.marker === 0 && this.irDigital === '1') {
    this.shootingMode = 'inter';
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === 0 && this.irDigital === '2') {
    this.shootingMode = 'nonstop';
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === 0 && this.irDigital === '3') {
    this.shootingMode = 'stopmo';
    SettingsDisplay_2();
  }
   if (this.dispay_2 && this.marker === this.indent && this.irDigital === '1') {
    this.direction = 1;
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === this.indent && this.irDigital === '2') {
    this.direction = 0;
    SettingsDisplay_2();
  }
  if (this.dispay_2 && this.marker === this.indent * 2 && this.simNum <= 7 && this.simNum > 0) {
    this.allSteps = (this.allSteps + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_2();
    this.simNum++;
  }
  if (this.dispay_2 && this.marker === this.indent * 2 && this.simNum === 0 && this.irDigital != '0') {
    this.allSteps = '';
    this.allSteps = (this.allSteps + this.irDigital) * 1;
    NumControl();
    SettingsDisplay_2();
    this.simNum++;
  }
}

function NumControl() {
  if ((E.toString(this.f.read(1)) * 1) != this.allSteps + '' && !this.setupMode) {
    this.f.write(1, this.allSteps + '');
    console.log('save allSteps');
  }
  if ((E.toString(this.f.read(2)) * 1) != this.frame + '' && !this.setupMode) {
    this.f.write(2, this.frame + '');
    console.log('save frame');
  }
  if ((E.toString(this.f.read(5)) * 1) != this.speed + '' && !this.setupMode) {
    this.f.write(5, this.speed + '');
    console.log('save speed');
  }
  this._frame = this.frame;
  this._speed = 1;
  this.frameSteps = this.allSteps / this.frame;
  this.stepperTime = this.frameSteps / this.speed * 1000;
  this.accelerationSteps = this.frameSteps / 4;
  this.accelerationTime = this.stepperTime / 4; 
  this.accIntervalSteps = Math.floor(0.04 * this.accelerationSteps);
  if (this.accIntervalSteps <= 0) {
    this.accIntervalSteps = 1;
  }
  this.accStep = this.speed / this.accIntervalSteps;
  this.accSpeed = this.accelerationTime / this.accIntervalSteps;
  this.shootingTime1F = this.pause + this.frameTime + this.stepperTime;
  this.shootingTime = this.shootingTime1F * this.frame;
  this._shootingTime = this.shootingTime;
  console.log('this.accIntervalSteps = ' + this.accIntervalSteps);
  console.log('NumControl');
}

function Start() {
  digitalWrite(pinEn, 0);
  if (this._frame > 0) {
    this.startFlag = true;
    ShotingPause();
  } else {
    Stop();
  }
}

function Stop() {
  console.log('stop');
  clearInterval();
  this.startFlag = false;
  digitalWrite(this.pinStep, 0);
  digitalWrite(pinEn, 1);
  digitalWrite(this.pinRelay, 0);
  NumControl();
  StartDisplay();
}

function StepperAccMax() {
  if (!this.startFlag) {
    return;
  }
  this._speed = 1;
  if (this.accIntervalSteps === 1) {
    this._speed = this.speed;
    this.accelerationTime = this.stepperTime / 3;
    Stepper();
    return;
  }
  var accTimerMax = setInterval(function () {
    analogWrite(this.pinStep, 0.5, { freq : this._speed } );
    this._speed = this._speed + this.accStep;
    if (this._speed >= this.speed) {
      clearInterval(accTimerMax);
      Stepper();
    }
  }, this.accSpeed);
}

function Stepper() {
  if (!this.startFlag) {
    return;
  }
  analogWrite(this.pinStep, 0.5, { freq : this.speed } );
  this.stepTimer = setTimeout(function () {
    clearTimeout(this.stepTimer);
    if (this.accIntervalSteps === 1) {
      this._shootingTime = this._shootingTime - this.shootingTime1F;
      digitalWrite(this.pinStep, 0);
      Start();
      return;
    }
    StepperAccMin();
  }, this.accelerationTime * 3);
}

function StepperAccMin() {
  if (!this.startFlag) {
    return;
  }
  analogWrite(this.pinStep, 0.5, { freq : this.speed } );
  var accTimerMin = setInterval(function () {
    analogWrite(this.pinStep, 0.5, { freq : this._speed } );
    this._speed = this._speed - this.accStep;
    if (this._speed <= 0) {
      clearInterval(accTimerMin);
      this._shootingTime = this._shootingTime - this.shootingTime1F;
      Start();
    }
  }, this.accSpeed);
}

function ShotingPause() {
  if (!this.startFlag) {
    return;
  }
  this.pauseTimer = setTimeout(function () {
  Relay();
    clearTimeout(this.pauseTimer);
  }, this.pause);

}

function Relay() {
  if (!this.startFlag) {
    return;
  }
  console.log('Relay');

  if (this._frame > 0 && this.startFlag) {
    this.relayOn = true;
    digitalWrite(this.pinRelay, 1);
    this._frame--;
    this.frameTimer = setTimeout(function () {
      digitalWrite(this.pinRelay, 0);
      this.relayOn = false;
      StartDisplay();
      StepperAccMax();
      clearTimeout(this.frameTimer);
    }, this.frameTime);
  } else {
    Stop();
  }
}

function BtnStop() {
  console.log('BtnStop');
      Stop();
}

function Calibration() {
  this.calibration = true;
  this.g.clear();
  this.g.setFontVector(20);
  this.g.drawString('calibration', 0, 0);
  this.g.flip();

  digitalWrite(this.pinEn, 0);
  this.step1 = true;
  allSteps = 0;
  var calibrationSpeed = 2000;
  analogWrite(this.pinStep, 0.5, { freq : calibrationSpeed } );
  
  setInterval(function () {
    this.allSteps = this.allSteps + (calibrationSpeed / 1000);
 }, 1);
}

this.loadingTimer = setTimeout(function () {
  
  this.g = require("SSD1306").connect(I2C1, LogoDisplay);
      clearTimeout(this.loadingTimer);
    }, 100);
function onInit() {
 I2C1.setup({scl:B8, sda:B9});
}