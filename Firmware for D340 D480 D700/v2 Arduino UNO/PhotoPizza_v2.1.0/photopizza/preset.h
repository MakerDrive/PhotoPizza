/**
 * File: preset.h
 * Created on: 14 марта 2015 г.
 * Description:
 * 
 *
 * Author: Roman Savrulin <romeo.deepmind@gmail.com>
 * Project Author: Vladimir Matiyasevith <vladimir.m@makerdrive.com>
 * Project Site: PhotoPizza.org
 *
 * Copyright: 2015 Roman Savrulin
 * Copying permission statement:
 * 
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
 *
 */
#ifndef PHOTOPIZZA_PRESET_H_
#define PHOTOPIZZA_PRESET_H_

#include "defines.h"
#include "param.h"
#include "paramAcc.h"
#include "paramSteps.h"
#include "paramSpeed.h"
#include "paramDir.h"
#include "paramFrameCount.h"
#include "paramRun.h"
#include "paramPause.h"

namespace PhotoPizza {

struct presetStorageData {
  long _steps;  // rotaion
  long _accel;    // acceleration
  long _pause;
  int   _frames;
  short _speed; // speed
};

class preset {
public:
  paramSpeed     _speed; // speed
  paramSteps     _steps; // rotaion
  paramAcc       _acc; // acceleration
  paramDir       _dir; // -1 - clockwise , 1 - counterclockwise
  paramFrameCount _frames;
  paramPause     _pause;

  static paramRun _run;

  typedef enum {
    FIRST_PARAM = 0,
    RUN = FIRST_PARAM,  // command-parameter
    STEPS,
    SPEED,
    ITER_COUNT,
    PAUSE,
    ACC,
    DIR,
    PARAM_COUNT,

    SAVED_PARAM,       //parameter where we save value before editing
  } paramType;

  IParam& operator[] (const int nIndex){
    switch (nIndex) {
    case RUN:
      return _run;
    case SPEED:
      return _speed;
    case ITER_COUNT:
      return _frames;
    case PAUSE:
        return _pause;
    case STEPS:
      return _steps;
    case ACC:
      return _acc;
    case DIR:
      return _dir;
    default:
      return _default;
    }
  }

  bool operator!=(presetStorageData & val) {
    if(_speed != val._speed)
       return true;
    if(_acc != val._accel)
       return true;
    if(_steps * _dir != val._steps)
       return true;
    if(_pause != val._pause)
      return true;
    if(_frames != val._frames)
        return true;

    return false;
  }

  operator presetStorageData() {
    DBG("op = cast to psd");
    presetStorageData tmp;
    tmp._accel = _acc;
    tmp._speed = _speed;
    tmp._steps = _steps * _dir;
    tmp._frames = _frames;
    tmp._pause = _pause;
    return tmp;
  }

  preset& operator=(presetStorageData val) {
    DBG(F("op = psd"));
    DBG(F("Sp: ") + val._speed);
    DBG(F("acc: ") + val._acc);
    DBG(F("steps: ") + val._steps);
    _speed = val._speed;
    _acc = val._accel;
    _frames = val._frames;
    _pause = val._pause;

    if(val._steps < 0)
      _dir.setByVal(CW);
    else
      _dir.setByVal(CCW);

    _steps = abs(val._steps);
    return *this;
  }

private:
  static LimitedParam _default;
};
}


#endif /* PHOTOPIZZA_PRESET_H_ */
