/**
 * File: lcdIrController.cpp
 * Created on: 10 mar 2015 г.
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

#include "lcdIrController.h"

#include "defines.h"
#include <LiquidCrystal.h>
#include <LiquidCrystal_I2C.h>
#include <AccelStepper.h>
#include "IRReceiver.h"
#include "presetManager.h"

#include "keyboard.h"

namespace PhotoPizza {

#if (BOARD_TYPE == BOARD_TYPE_NANO) //TODO: move lcd to class member???
static LiquidCrystal_I2C lcd(0x27, 16, 2); // select the pins used on the LCD panel
#elif (BOARD_TYPE == BOARD_TYPE_UNO)
    static LiquidCrystal lcd(8, 9, 4, 5, 6, 7); // select the pins used on the LCD panel
#endif

///////////  Presets
/* static */presetManager *lcdIrController::_presetMgr;

void lcdIrController::init() {
#if (BOARD_TYPE == BOARD_TYPE_NANO)
  Wire.begin();
  lcd.init(); // initialize the lcd
  lcd.backlight();
#endif
  lcd.home();
  _presetMgr = presetManager::get();
  sayHello();
  showProgram();
  IrInit();
}

void lcdIrController::sayHello() {
  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(F("PhotoPizza DIY"));
  Serial.println(F("PhotoPizza DIY " VERSION));
  lcd.setCursor(0, 1);
  lcd.print(F(VERSION));
  delay(2000);
}

void lcdIrController::processKey(kbKeys key) {
  if (_presetMgr->isEdit())
    editMode(key);
  else
    menuMode(key);

  if (_presetMgr->isUpdated())
    showProgram();
}

void lcdIrController::loop() {

  kbKeys key = kbGetKey();
  processKey(key);
}

void lcdIrController::printProgNum() {
  lcd.setCursor(0, 0);
  lcd.print(F("Program"));
  lcd.setCursor(8, 0);
  lcd.print((_presetMgr->getPresetNumber() + 1));
}

void lcdIrController::showProgram() {
  lcd.clear();
  printProgNum();
  lcd.setCursor(10, 0);
  lcd.print(_presetMgr->getPreset()->_dir.toString(true));

  IParam *ptr = _presetMgr->getParam();

  if (_presetMgr->isEdit()) {
    lcd.setCursor(0, 1);
    lcd.print(F(">"));
  } else {
    lcd.setCursor(0, 1);
    lcd.print(F(" "));
  }

  lcd.setCursor(1, 1);
  lcd.print(ptr->getName());
  lcd.setCursor(7, 1);
  lcd.print(ptr->toString());
}

///////////////////////////////////////

void lcdIrController::menuMode(kbKeys key) {
  long val;

  switch (key) {
  case kbPwr:
    _presetMgr->stop();
    _presetMgr->run();
    break;
  case kbUp:
    _presetMgr->nextParam();
    break;

  case kbDown:
    _presetMgr->prevParam();
    break;

  case kbRight:
    _presetMgr->nextPreset();
    break;

  case kbLeft:
    _presetMgr->prevPreset();
    break;

  case kbOk:
    _presetMgr->edit();
    break;

  case kbClear:
    _presetMgr->edit();
    _presetMgr->setValue(0);
    break;

  case kbBksp:
    _presetMgr->changeDirection();
    break;

  default:
    int keyV = kbGetNumericKey(key);
    if (keyV >= 0) {
      _presetMgr->edit();
      _presetMgr->setValue(0);
      val = _presetMgr->getValue() * 10 + keyV;
      _presetMgr->setValue(val);
    }
    break;
  }

  if (key != kbNoKey && key != kbPwr)
    showProgram();
}

void lcdIrController::editMode(kbKeys key) {
  long val;

  switch (key) {
  case kbPwr:
    _presetMgr->save();
    _presetMgr->stop();
    _presetMgr->run();
    break;
  case kbLeft:
    _presetMgr->discard();
    break;

  case kbOk:
    _presetMgr->save();
    break;

  case kbDown:
    _presetMgr->valueDown();
    break;

  case kbUp:
    _presetMgr->valueUp();
    break;

  case kbClear:
    _presetMgr->setValue(0);
    break;

  default:
    int keyV = kbGetNumericKey(key);
    if (keyV >= 0) {
      val = _presetMgr->getValue() * 10 + keyV;
      _presetMgr->setValue(val);
    }
    break;
  }
  if (key != kbNoKey && key != kbDown && key != kbUp)
    showProgram();
}

String lcdIrController::emulateBtn(String cmd) {

  String OK = F("OK");
  String ERR = F("ERR");
  String BtnCmd = F("BTN ");

  if (cmd.startsWith(BtnCmd)) {

    cmd.remove(0, BtnCmd.length());

    int key = cmd.toInt();

    if(!(key > kbNoKey && key < kbBtnCount))
      return ERR;

    processKey((kbKeys)key);
    return OK;
  } else
    return ERR;
}

}
