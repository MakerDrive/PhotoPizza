/**
 * File: paramDir.h
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

#ifndef PHOTOPIZZA_V1_2_2_PARAMDIR_H_
#define PHOTOPIZZA_V1_2_2_PARAMDIR_H_

#include "defines.h"
#include "param.h"

namespace PhotoPizza {

class paramDir : public EnumedParam {
public:
  paramDir() : paramDir(0){}
  paramDir(long val) {
    static enumParamMapItem dirMap[] = {
        {CW, F("CW")},
        {CCW, F("CCW")}
    };
    _valHiLimit = MAP_SIZE(dirMap) - 1;
    //Serial.println((String)F("_valHiLim ctor: ") + _valHiLimit);
    _map = dirMap;
    set(val);
  }

  virtual String getName(bool shorten = false){
    return F("dir");
  }

  virtual String toString(bool shorten = false){
    if(!shorten)
      return EnumedParam::toString(shorten);
    else{
      if ((long)*this == CW)
        return (String) F(">");
      else
        return (String) F("<");
    }
  }
};
}



#endif /* PHOTOPIZZA_V1_2_2_PARAMDIR_H_ */
