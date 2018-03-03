/**
 * File: presetManager.h
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

#include "presetManager.h"
#include "eepromAnything.h"
#include <avr/pgmspace.h>

#include "utils.h"

using namespace PhotoPizza;

struct presetStorage {
  byte flag;
  int  version;

  presetStorageData data;
};

static presetStorage ps;

#define EEPROM_FLAG 204
#define EEPROM_VER 6

const PROGMEM presetStorageData psData[NUM_PROGRAMS] = {
    {-3100, 5000, 100,  5, 1000},
    { 3200, 5000, 200, 10, 2000},
    {-3300, 5000, 300, 20, 3000},
    {-3400, 5000, 400, 30, 4300},
};

presetManager::presetManager() {

  _curPreset = 0;
  _curParam = preset::FIRST_PARAM;
  _update = false;

  Serial.println(F("Validating presets..."));
  for(int i = 0; i < NUM_PROGRAMS; ++i){
    if (!loadPreset(i, true)) {
      Serial.println((String) F("Data for preset ") + i + F(" is invalid, saving default"));
      savePreset(i);
    }
  }

  loadPreset(0, true);

  //_run = &(_preset[0]._run);//&(getPreset()->_run);
}

bool presetManager::loadPreset(unsigned short num, bool set){
  if(num >= NUM_PROGRAMS)
    return false;

  bool valid = true;

  EEPROM_readAnything(sizeof(presetStorage) * num, ps);
  if (ps.flag != EEPROM_FLAG || ps.version != EEPROM_VER){
    valid = false;
    Serial.println((String)F("Loading def preset ") + num + F(" from ") + (uint_farptr_t)&(psData[num]));
    memcpy_PF((void *)&ps.data, (uint_farptr_t)&(psData[num]), sizeof(presetStorageData));
  }

  DBG(F("Sp: ") + ps.data._speed);
  DBG(F("acc: ") + ps.data._accel);
  DBG(F("steps: ") + ps.data._steps);

  if(set)
    _preset = ps.data;
  return valid;
}

bool presetManager::savePreset(unsigned short num){
  if(num >= NUM_PROGRAMS)
    return false;

  ps.flag = EEPROM_FLAG;
  ps.version = EEPROM_VER;
  ps.data = _preset;
  DBG(F("Sp: ") + ps.data._speed);
  DBG(F("acc: ") + ps.data._accel);
  DBG(F("steps: ") + ps.data._steps);
  EEPROM_writeAnything(sizeof(presetStorage) * num, ps);

  return true;
}

void presetManager::loop(){
  _preset._run.loop();
}

void presetManager::save(bool force) {

  getParam()->save();

  loadPreset(_curPreset, false);
  if(_preset != ps.data || force){
    Serial.println((String)F("preset ") + _curPreset + F(" has changed, saving"));
    savePreset(_curPreset);
  }
}

void presetManager::nextParam(){
  _curParam = (preset::paramType) ((_curParam + 1) % preset::PARAM_COUNT);
}

void presetManager::prevParam(){
  _curParam = (preset::paramType) ((_curParam + preset::PARAM_COUNT - 1) % preset::PARAM_COUNT);
}

IParam* presetManager::getParam(){
  return &(*getPreset())[_curParam];
}

void presetManager::edit(){
  getParam()->edit();
}

bool presetManager::isEdit(){
  return getParam()->isEdit();
}

void presetManager::discard(){
  getParam()->discard();
}

void presetManager::nextPreset() {
  firstParam();
  _curPreset = (_curPreset + 1) % NUM_PROGRAMS;
  loadPreset(_curPreset, true);
}

void presetManager::prevPreset() {
  firstParam();
  _curPreset = (_curPreset + NUM_PROGRAMS - 1) % NUM_PROGRAMS;
  loadPreset(_curPreset, true);
}

int presetManager::getPresetNumber() {
  return _curPreset;
}

preset* presetManager::getPreset() {
  return &_preset;
}

long presetManager::getValue() {
  return _preset[_curParam].get();
}

String presetManager::getStrValue(){
  return _preset[_curParam].toString();
}

void presetManager::setValue(long val) {
  _preset[_curParam] = val;
}

void presetManager::valueUp() {
  _preset[_curParam].up();
  if(!_preset._run.isRunning())
    update();
}

void presetManager::valueDown() {
  _preset[_curParam].down();
  if(!_preset._run.isRunning())
      update();
}

void presetManager::changeDirection() {
  _preset._dir.edit();
  _preset._dir.up();
  _preset._dir.save();
  save();
  update();
}

void presetManager::run(){
  firstParam();
  _preset._run.edit();
}

void presetManager::stop(){
  firstParam();
  _preset._run.discard();
}

presetManager * presetManager::get(){
  static presetManager _presetMgr;
  return &_presetMgr;
}

