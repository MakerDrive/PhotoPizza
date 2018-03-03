/**
 * File: defines.h
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

#ifndef defines_h
#define defines_h

#define VERSION "V. 2.1.0"

//#define DBG(x) Serial.println((String)x);

#define BOARD_TYPE_NANO 0
#define BOARD_TYPE_UNO 1

#define BOARD_TYPE BOARD_TYPE_NANO

#ifndef BOARD_TYPE
//#define BOARD_TYPE BOARD_TYPE_UNO
#endif

#if (BOARD_TYPE == BOARD_TYPE_NANO)
#define MOTOR_STP_PIN 6
#define MOTOR_DIR_PIN 3
#define RELAY_PIN     11
#elif (BOARD_TYPE == BOARD_TYPE_UNO)
#define MOTOR_STP_PIN 12
#define MOTOR_DIR_PIN 13
#define RELAY_PIN     11
#else
#error "Board Not Supported!"
#endif


#define RELAY_HOLD_TIMEOUT 100

////  PARAMS
#define SPEED_MIN 1
#define SPEED_MAX 4300
#define SPEED_STEP 50

#define STEPS_MIN 0
#define STEPS_MAX 200000000  
#define STEPS_STEP 1000

#define ACC_MIN 0
#define ACC_MAX 50000
#define ACC_STEP 100

#define FRAME_COUNT_MIN 1
#define FRAME_COUNT_MAX 200
#define FRAME_COUNT_STEP 1

#define PAUSE_MIN 0
#define PAUSE_MAX 50000
#define PAUSE_STEP 100
#define PAUSE_NONE   0
#define PAUSE_BURST -1


#define NUM_PROGRAMS 4

#define CW -1  //clockwise
#define CCW 1  //counterclockwise

/////////Ir buttons map
#define BTN_POWER      32640         // pos 0 0
#define BTN_VOL_U      23715         // pos 0 1
#define BTN_FUNC       32385         // pos 0 2

#define BTN_RW         23970         // pos 1 0
#define BTN_PLAY       24480         // pos 1 1
#define BTN_FW         24097         // pos 1 2

#define BTN_CH_D       23979         // pos 2 0
#define BTN_VOL_D      29962         // pos 2 1
#define BTN_CH_U       24229         // pos 2 2


#define BTN_0          22185         // pos 3 0
#define BTN_EQ         23205         // pos 3 1
#define BTN_ST         30855         // pos 3 2

#define BTN_1          29835         // pos 4 0
#define BTN_2          29452         // pos 4 1
#define BTN_3          30982         // pos 4 2
#define BTN_4          31110         // pos 5 0
#define BTN_5          29580         // pos 5 1
#define BTN_6          20655         // pos 5 2
#define BTN_7          31620         // pos 6 0
#define BTN_8          29070         // pos 6 1
#define BTN_9          21165         // pos 6 2

///////// LCD buttons map
#define btnRIGHT  100
#define btnUP     101
#define btnDOWN   102
#define btnLEFT   103
#define btnSELECT 104
#define btnNONE   105

#endif
