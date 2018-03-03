/**
 * File: paramRun.cpp
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

#include "paramRun.h"
#include <AccelStepper.h>
#include <limits.h>

#include "presetManager.h"

namespace PhotoPizza{

AccelStepper stepper(AccelStepper::DRIVER, MOTOR_STP_PIN, MOTOR_DIR_PIN);

boolean paramRun::operator()(){
  if(!_relay.framesLeft() || _val == 0){
    _run = false;
    _val = 0;
    presetManager::get()->discard();
    presetManager::get()->update();
    DBG(F("Finished"));
  }else
    startMotor(NULL);
  return true;
}

void paramRun::stopPreset(){
  if(!_run)
      return;
  _val = 0;
  _delayTime = 0;
  DBG(F("stopping"));
  stepper.stop();
  presetManager::get()->update();
  return;
}

void paramRun::up(){
  paramSpeed *sp = &presetManager::get()->getPreset()->_speed;
  sp->up();
  stepper.setMaxSpeed((long)*sp);
}

void paramRun::down(){
  paramSpeed *sp = &presetManager::get()->getPreset()->_speed;
  sp->down();
  stepper.setMaxSpeed((long)*sp);
}

void paramRun::loop(){
  presetManager *pMgr = presetManager::get();
  if(!stepper.run()){
    if(_run){
      if(!_relay.isRunning() && !_relayCycle && _val){
        _relay.start();
        _relayCycle = true;
      }
      if(!Timer::isRunning()){
        setPeriodMs(pMgr->getPreset()->_pause);
        start();
      }
      if(!_val){
        Timer::stop(true);
        _relay.stop(true);
      }
    }
  }else{
    if(_chunkSize){
      long chunk = stepper.currentPosition()/_chunkSize;
      if(chunk != _lastChunk){
        _relay.start();
        _lastChunk = stepper.currentPosition()/_chunkSize;
      }
    }
  }
}

bool paramRun::startMotor(Task *t){
  preset *preset = presetManager::get()->getPreset();

  DBG(F("Steps") + preset->_steps);
  DBG(F("Speed") + preset->_speed);
  DBG(F("Accel") + preset->_acc);
  DBG(F("Dir") + preset->_dir);
  DBG(F("Frames") + preset->_frames);
  DBG(F("Pause") + preset->_pause);

  _relayCycle = false;
  long steps = preset->_steps * preset->_dir;
  _chunkSize = steps/preset->_frames;
  _lastChunk = 0;

  if(preset->_pause > PAUSE_NONE){
    steps /= preset->_frames;
    DBG(F("Splitting ") + preset->_steps + F(" in ") + preset->_pause + F("chunks."));
    DBG(F("Chunk size: ") + steps);
    _chunkSize = 0; //disable relay triggering for pause: none mode
  }

  stepper.setCurrentPosition(0L);
  if(preset->_acc == 0){
    stepper.setAcceleration(10000000); //no acc.
  }else
    stepper.setAcceleration(preset->_acc);
  if(steps != 0){
    stepper.moveTo(steps);
  }else
    stepper.moveTo(LONG_MAX * preset->_dir);
  stepper.setMaxSpeed(preset->_speed);

  return false;
}

void paramRun::edit() {
  if(_run)
    return;
  DBG(F("Run"));
  _val = 1;
  _run = true;
  _relay._frameCount = presetManager::get()->getPreset()->_frames;
  startMotor(NULL);

  presetManager::get()->update();
}

};
