/**
 * File: paramRun.h
 * Created on: 09 mar 2015 г.
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

#ifndef PHOTOPIZZA_V1_2_2_PARAMRUN_H_
#define PHOTOPIZZA_V1_2_2_PARAMRUN_H_


#include <Timer.h>
#include "defines.h"
#include "param.h"

namespace PhotoPizza {

class relayPause: public Timer{
public:
  relayPause(unsigned long delayMs): Timer(delayMs, NULL){
    pinMode(RELAY_PIN, OUTPUT);
    _frameCount = 0;
  };
  ~relayPause(){};

  inline void on(){
    if(_frameCount >= 0)
      --_frameCount;
    digitalWrite(RELAY_PIN, HIGH);
  }

  inline void off(){
    digitalWrite(RELAY_PIN, LOW);
  }

  void start(){
    on();
    Timer::start();
  };

  virtual boolean operator()(){
    off();
    return true;
  }

  bool framesLeft(){
    return _frameCount != 0;
  }

  short _frameCount;
};

class paramRun : public EnumedParam, public Timer{
public:

  paramRun() : paramRun(0){}
  paramRun(long val): Timer(0, NULL), _relay(RELAY_HOLD_TIMEOUT){
    static enumParamMapItem map[] = {
        {0, F("")},
        {1, F(">>>")}
    };
    _valHiLimit = MAP_SIZE(map) - 1;
    _map = map;
    _run = false;
    _delayTime = 0;
    _chunkSize = 0;
    _lastChunk = 0;
    _relayCycle = false;
    set(val);
  }

  virtual boolean operator()();

  virtual void up();
  virtual void down();

  virtual void edit();

  virtual bool save(){
    stopPreset();
    return true;
  }

  virtual void discard(){
    stopPreset();
  }

  virtual bool isEdit(){
    return _run || _val != 0;
  }

  virtual bool isRunning(){
    return _run;
  }

  virtual bool set(long int val){ return true;}

  virtual String getName(bool shorten = false){
    return F("Run");
  }
  void loop();

private:
  bool _run;
  bool _relayCycle;
  unsigned long _delayTime;
  void stopPreset();
  bool startMotor(Task *t);
  relayPause _relay;
  long _chunkSize;
  long _lastChunk;
private:
};
}


#endif /* PHOTOPIZZA_V1_2_2_PARAMRUN_H_ */
