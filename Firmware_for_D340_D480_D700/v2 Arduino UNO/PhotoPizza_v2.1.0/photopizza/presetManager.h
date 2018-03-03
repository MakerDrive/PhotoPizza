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

#ifndef PRESET_MANAGER_H
#define PRESET_MANAGER_H

#include "defines.h"
#include "preset.h"

namespace PhotoPizza {

class presetManager {
public:
  static presetManager* get();

  void nextPreset();
  void prevPreset();
  int getPresetNumber();
  preset* getPreset();


  void nextParam();
  void prevParam();

  IParam* getParam();

  preset::paramType getParamNumber(){
    return _curParam;
  }

  void firstParam(){
     _curParam = preset::FIRST_PARAM;
  }

  void edit();
  bool isEdit();
  void discard();

  void loop();

  long getValue();
  String getStrValue();
  void setValue(long val);

  void valueUp();
  void valueDown();

  void changeDirection();
  void run();
  void stop();

  void update(){
    _update = true;
  }
  bool isUpdated(){
    if(_update){
      _update = false;
      return true;
    }
    return false;
  }

  void save(bool force = false);

private:
  bool loadPreset(unsigned short num, bool set = false);
  bool savePreset(unsigned short num);
  presetManager();
  int _curPreset; // current preset
  preset _preset;
  preset::paramType _curParam;
  bool _update;
};

}

#endif

