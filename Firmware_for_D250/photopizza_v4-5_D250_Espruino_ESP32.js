/**
 * File: photopizza_espruino.js
 * Created on: August 30, 2017
 * Description:
 * PhotoPizza DIY is an open source project of 360° product photography turntable.
 *
 * Author: Vladimir Matiyasevith <vladimir.m@makerdrive.ru>
 * Project Site: PhotoPizza.org
 *
 * Copyright: 2018 Vladimir Matiyasevith
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

var config = {};
function  PhotoPizzaInit() {

  var photoPizzaIp = 'disconnected';
  var wifi = require('Wifi');
  var wsocket;
  var server;
  var wifiSsid = config.wifiSsid;
  var wifiPassword = config.wifiPassword;
  var attempt = 1;
  var displaywifiPassword = '**********';
  var displaywifiName = wifiSsid;
  function wifiConnect() {
    wifi.connect(wifiSsid, {password: wifiPassword}, function() {

      console.log(`PhotoPizza connected:${wifi.getIP().ip}`);
      photoPizzaIp = wifi.getIP().ip;
      printDisplay();

      server = require('ws').createServer();
      server.listen(config.wsPort);
      server.on("websocket", function(ws) {
        wsocket = ws;
        ws.send(JSON.stringify(config));
        ws.on('message',function(msg) {
          var configIn = JSON.parse(msg);
          config = configIn;
          console.log(config);
          saveConfig();
          if (configIn.state === 'start' && config.state != 'started') {
            start();
            config.state = 'started';
            ws.send(JSON.stringify(config));
          }

          if (configIn.state === 'infinity' && config.state != 'started') {
            start();
            ws.send(JSON.stringify(config));
          }

          if (configIn.state === 'stop') {
            stop();
          }
        });
        ws.on('close', function() {
          wsocket = false;
          console.log('wsocket close');
        });
      });
      return;
    });
    wifi.on('disconnected', function() {
      console.log('Lost WIFI! Disconnected.');
      photoPizzaIp = 'disconnected';
      printDisplay();
      if (attempt > 0) {
        attempt--;
        wifiSsid = 'PhotoPizza';
        wifiPassword = '9994501234';
        displaywifiName = wifiSsid;
        displaywifiPassword = wifiPassword;
        printDisplay();
        wifiConnect();
      }
      //ESP32.reboot();
    });
  }
///
  function saveConfig() {
    if (JSON.stringify(config) != fs.readFileSync("config.txt")) {
      fs.writeFileSync('config.txt', JSON.stringify(config));
      console.log('Save config');
    }
  }

  var step = 0;
  var steps = [];
  var stepperPins = [D12,D14,D27,D26];
  var speed;
  var _speed = 3;
  var accSteps = 0;

  //RELAY
  var pinShot = D25;
  var pinLaser = D33;
  var relayOn = false;
  var rOn = 0;
  var rOff = 1;
  digitalWrite(pinShot, rOff);
  digitalWrite(pinLaser, rOn);

  require("IRReceiver").connect(D13, function(code) {
    var _code = parseInt(code, 2);
    var btn;
  
    if (_code === 6450803341 || _code === 25803213367) {
      btn = 1;
      console.log(btn);
    }
    if (_code === 6450819151 || _code === 25803276607) {
      btn = 2;
      console.log(btn);
    }
    if (_code === 6450786511 || _code === 25803146047) {
      btn = 3;
      console.log(btn);
    }
    if (_code === 6450795181 || _code === 25803180727) {
      btn = 4;
      console.log(btn);
    }
    if (_code === 6450810991 || _code === 25803243967) {
      btn = 5;
      console.log(btn);
    }
    if (_code === 6450778351 || _code === 25803113407) {
      btn = 6;
      console.log(btn);
    }
    if (_code === 6450799261 || _code === 25803197047) {
      btn = 7;
      console.log(btn);
    }
    if (_code === 6450815071 || _code === 25803260287) {
      btn = 8;
      console.log(btn);
    }
    if (_code === 6450782431 || _code === 25803129727) {
      btn = 9;
      console.log(btn);
    }
    if (_code === 6450806911 || _code === 25803227647) {
      btn = 0;
      console.log(btn);
    }
  
    if (_code === 25803148087 || _code === 6450787021) {
      btn = 'CALIBR';
      console.log(btn);
    }

    if (_code === 6450823741 || _code === 25803294967) {
      btn = 'SETUP';
      console.log(btn);
    }
    if (_code === 6450800791 || _code === 25803203167) {
      btn = 'UP';
      console.log(btn);
    }
    if (_code === 6450796711 || _code === 25803186847) {
      btn = 'DOWN';
      console.log(btn);
    }
    if (_code === 6450809461 || _code === 25803237847) {
      btn = 'LEFT';
      console.log(btn);
    }
    if (_code === 6450776821 || _code === 25803107287) {
      btn = 'RIGHT';
      console.log(btn);
    }
    if (_code === 6450825271 || _code === 25803301087) {
      btn = 'OK';
      console.log(btn);
    }
    if (_code === 6450813031 || _code === 25803252127) {
      btn = '90DEG';
      console.log(btn);
    }

    console.log(_code);
    console.log(config.state);
    
    if (btn === 'OK' && config.state === 'started' || btn === 'OK' && config.state === 'infinity') {
      stop();
      console.log('OK STOP');
      return;
    }
    if (btn === 'OK' && config.state === 'waiting') {
      start();
      config.state = 'started';
      console.log('OK START');
      return;
    }
    if (btn === 'RIGHT' && config.state === 'waiting') {
      config.direction = 1;
      config.state = 'infinity';
      start();
      return;
    }
    if (btn === 'LEFT' && config.state === 'waiting') {
      config.direction = 0;
      config.state = 'infinity';
      start();
      return;
    }
  });

  function printDisplay(){
    g.clear();
    g.setFont8x16();
    g.drawString('WiFi: ' + displaywifiName, 0, 14);
    g.drawString('Pass: ' + displaywifiPassword, 0, 31);
    g.drawString('IP: ' + photoPizzaIp, 0, 48);
    g.flip();
  }

  function sendConfig() {
    if (wsocket) {
      wsocket.send(JSON.stringify(config));
    }
  }

  function start() {
    digitalWrite(pinLaser, rOff);
    if (config.direction === 1) {
      steps = [0b0001,0b0010,0b0100,0b1000];
    } else {
      steps = [0b1000,0b0100,0b0010,0b0001];
    }
    if (config.speed > 100) {
      config.speed = 100;
    } else if (config.speed < 1) {
      config.speed = 1;
    }
    speed = 100 / config.speed;
    config.framesLeft = config.frame;
    accSteps = (config.allSteps / config.frame) / 4;
    step = 0;
    if (config.state === 'infinity') {
      doStep();
      return;
    }
    shot();
  }

  function stop() {
    config.state = 'stopping';
    digitalWrite(pinLaser, rOn);
    console.log('STOP');
  }

  function shot() {
    console.log('SHOT');
    
    if (config.framesLeft === 0) {
      config.state = 'waiting';
      sendConfig();
      return;
    }

    digitalWrite(pinShot, rOn);
    sendConfig();

    var shotTimeout = setTimeout(function() {
      digitalWrite(pinShot, rOff);
      config.framesLeft--;
      step = 0;
      doStep();
    }, config.delay);
  }

  function doStep() {
    if (config.state === 'stopping') {
      config.state = 'waiting';
      sendConfig();
      return;
    }
    
    // if (step < accSteps && _speed > 10) {
    //   _speed -= accSteps / 40;
    // } else if (step >= (config.allSteps / config.frame) - accSteps && _speed < 50 && config.state != 'infinity') {
    //   _speed += accSteps / 40;
    // }
    //console.log(_speed);
    
    step++;

    if (step >= config.allSteps / config.frame && config.state != 'infinity') {
      //_speed = 50;
      pause();
      return;
    }
    digitalWrite(stepperPins, steps[step % steps.length]);
    step++;
    digitalWrite(stepperPins, steps[step % steps.length]);
    
    var stepTimeout = setTimeout(function() {
      doStep();

    }, config.speed);
  }

  function pause() {
    console.log('PAUSE');
    var pauseTimeout = setTimeout(function() {
      shot();
    }, config.pause);
  }
  console.log(config);
  g = require("SH1106").connect(I2C1, printDisplay);
  wifiConnect();
}

function onInit () {
  I2C1.setup({scl:D22, sda:D21});
  fs = require("fs");
  require("Font8x16").add(Graphics);
  config = JSON.parse(fs.readFileSync("config.txt"));
  config.state = 'waiting';
  var riadTimer = setTimeout(function () { 
    PhotoPizzaInit();
  }, 1000);
  
}