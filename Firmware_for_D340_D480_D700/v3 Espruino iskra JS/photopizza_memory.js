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

this.f = new (require("FlashEEPROM"))();

function memRec() {
    console.log('start memRec');
    this.f.write(0, 'readable');
    
}
function memRead() {
    console.log(E.toString(this.f.read(0)));  
}

this.myRec = setTimeout(memRec, 2000);
this.myRec = setTimeout(memRead, 40000);