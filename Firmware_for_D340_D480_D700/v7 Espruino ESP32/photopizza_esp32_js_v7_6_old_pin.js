


const I2C_SDA = D21;
const I2C_SCL = D22;
const IR_DATA = D13;

//RELAY
const pinRelay = D26;
const pinLaser = D25;
const rOn = 0;
const rOff = 1;

//STEPPER
const pinStep = D12;
const pinEn = D27;
const pinDir = D14;
const stOn = 0;
const stOff = 1;

const defConfig = {
  firmwareVersion: 'PhotoPizza v7',
  wifiSsid: 'PhotoPizza',
  wifiPassword: '9994501234',
  wsPort: 8000,
  state: 'waiting',//started
  framesLeft: 32,
  frame: 32,
  allSteps: 109000,
  pause: 100,
  delay: 300,
  speed: 5000,
  acceleration: 100,
  shootingMode: 'inter',
  direction: 1,
  shutterT: 200,
  degreesX: 90
};

var config = {};

var run = function () {

  function saveConfig() {
    config.state = 'save config';
    if (display) {
        g.clear();
        g.setFontBitmap();
        g.setFont8x16();
        g.drawString('    Save config...', 0, 30);
        g.flip();
      }
      config.state = 'save config';
      var paces = 3;
    setInterval(function () {
        fs.writeFileSync('cfg.htm', JSON.stringify(config));
        paces -= 1;
        if (paces <= 0) {
            clearInterval();
            console.log('Save config');
            config.state = 'waiting';
            StartDisplay();
        }
    }, 1000);
  }

  var photoPizzaIp = 'disconnected';
  var wifi = require('Wifi');
  var wsocket;
  var server;
  var apListe;
  var wifiAttempt = 1;
  var wifiConnect_ = false;

  wifi.startAP('PhotoPizza', { password: '9992030360', authMode: 'wpa2' }, function(err) {
    if (err) throw err;
    console.log("Connected!");
    photoPizzaIp = '192.168.4.1';
    wifiConnect_ = true;

    if (wifiConnect_) {
      server = require('ws').createServer();
      server.listen(config.wsPort);
      server.on("websocket", function(ws) {
        wsocket = ws;
        ws.send(JSON.stringify(config));
        ws.on('message',function(msg) {
          var configIn = JSON.parse(msg);
          config = configIn;
          //console.log(config);
          NumControl();
          if (configIn.state === 'start' && config.state != 'started') {
            BtnStart();
            config.state = 'started';
            ws.send(JSON.stringify(config));
          }
  
          if (configIn.state === 'infinity' && config.state != 'started') {
            infiniteRotation();
            ws.send(JSON.stringify(config));
          }
    
          if (configIn.state === 'stop') {
            BtnStop();
          }
          if (configIn.state === 'save' && config.state != 'started') {
            
            config.state = 'waiting';
            saveConfig();
            ws.send(JSON.stringify(config));
          }
        });
        ws.on('close', function() {
          wsocket = false;
        });
      });
    }
    wifi.on('disconnected', function() {
      wifiConnect_ = false;
      wsocket = false;
      console.log('Lost WIFI! Disconnected.');
      photoPizzaIp = 'disconnected';
      StartDisplay();
      if (wifiAttempt >= 1) {
        wifiAttempt--;
        var wifiTimer = setTimeout(function () {
          wifiConnect();
        }, 2000);
      }
    });

    //StartDisplay();
  });

  function wifiConnect() {
    photoPizzaIp = 'connection';
    StartDisplay();

    wifi.connect(config.wifiSsid, {password: config.wifiPassword}, function(err) {
      if (err) {
        console.log("WiFi Connection error: "+err);
        return;
      }
      console.log(wifi.getIP());
      photoPizzaIp = wifi.getIP().ip;
      wifiConnect_ = true;
      StartDisplay();

      if (wifiConnect_) {
        server = require('ws').createServer();
        server.listen(config.wsPort);
        server.on("websocket", function(ws) {
          wsocket = ws;
          ws.send(JSON.stringify(config));
          ws.on('message',function(msg) {
            var configIn = JSON.parse(msg);
            config = configIn;
            //console.log(config);
            NumControl();
            if (configIn.state === 'start' && config.state != 'started') {
              BtnStart();
              config.state = 'started';
              ws.send(JSON.stringify(config));
            }

            if (configIn.state === 'infinity' && config.state != 'started') {
              infiniteRotation();
              ws.send(JSON.stringify(config));
            }

            if (configIn.state === 'stop') {
              BtnStop();
            }
            if (configIn.state === 'save' && config.state != 'started') {
              saveConfig();
              config.state = 'waiting';
              ws.send(JSON.stringify(config));
            }

          });
          ws.on('close', function() {
            wsocket = false;
          });
        });
      }
      wifi.on('disconnected', function() {
        wifiConnect_ = false;
        wsocket = false;
        console.log('Lost WIFI! Disconnected.');
        photoPizzaIp = 'disconnected';
        StartDisplay();
        if (wifiAttempt >= 1) {
          wifiAttempt--;
          var wifiTimer = setTimeout(function () {
            wifiConnect();
          }, 2000);
        }
      });
    });
  }
  
 
 
///////////////////////////

  require("Font8x16").add(Graphics);

  var irCode = 0;
  var irDigital = '1';
  var simNum = 0;

  //DISPLAY
  var display = true;
  var marker = 0;
  var indent = 13;
  var dirDisplay = '';

  var nameIndent = 48;

  var _speed = 1;

  digitalWrite(pinStep, 0);
  digitalWrite(pinEn, 1);
  digitalWrite(pinDir, config.direction);

  digitalWrite(pinRelay, rOff);
  digitalWrite(pinLaser, rOn);
  //P8.mode('analog');

  require("IRReceiver").connect(IR_DATA, function(code) {
    var _code = -1;
    try{
     _code = parseInt(code, 2);
    } catch (e) {
      console.log("Unable to parse IR code: " + code + "With Error: " + e);
      return;
    }

    var btn = -1;

    switch (_code) {
      case 6450803341:
      case 25803213367:
      case 17246882167:
        btn = 1;
        break;
      case 6450819151:
      case 25803276607:
      case 17246816887:
        btn = 2;
        break;
      case 6450786511:
      case 25803146047:
      case 17246947447:
        btn = 3;
        break;
      case 6450795181:
      case 25803180727:
      case 17246751607:
        btn = 4;
        break;
      case 6450810991:
      case 25803243967:
      case 17246718967:
        btn = 5;
        break;
      case 6450778351:
      case 25803113407:
      case 17246914807:
        btn = 6;
        break;
      case 6450799261:
      case 25803197047:
      case 17246945407:
        btn = 7;
        break;
      case 6450815071:
      case 25803260287:
      case 17246888287:
        btn = 8;
        break;
      case 6450782431:
      case 25803129727:
      case 17246863807:
        btn = 9;
        break;
      case 6450806911:
      case 25803227647:
      case 17246871967:
        btn = 0;
        break;
      case 6450774271:
      case 25803097087:
        btn = 'SHOT';
        break;
      case 6450794416:
      case 25803177667:
        case 25803254167:
        btn = 'SAVE';
        break;
      case 25803148087:
      case 6450787021:
      case 17246823007:
        btn = 'CALIBR';
        break;
      case 25803357187:
      case 6450839296:
      case 6450817621:
        btn = 'POWER-W';
        break;
      case 6450823741:
      case 25803294967:
      case 17246896447:
        btn = 'SETUP';
        break;
      case 6450800791:
      case 25803203167:
      case 17246741407:
        btn = 'UP';
        break;
      case 6450796711:
      case 25803186847:
      case 17246792407:
        btn = 'DOWN';
        break;
      case 6450809461:
      case 25803237847:
      case 17246733247:
        btn = 'LEFT';
        break;
      case 6450776821:
      case 25803107287:
      case 17246808727:
        btn = 'RIGHT';
        break;
      case 6450825271:
      case 25803301087:
      case 17246774047:
        btn = 'OK';
        break;
      case 6450813031:
      case 25803252127:
        btn = 'DEG';
        break;
      case 6450835471:
      case 25803341887:
        btn = 'WIFI';
        break;
      default:
        console.log("Unknown IR code: " + _code);
        return;
    }

    console.log("Got IR code: " + _code + " -> " + btn);

    if (btn === 'SAVE') {
      saveConfig();
      return;
    }

    if (btn === 'SHOT') {
      shot();
      shotIr();
      return;
    }
    if (btn === 'POWER-W') {
      digitalWrite(pinEn, 0);
      return;
    }
    if (typeof(btn) === 'number' && config.state === 'dispay_1' || typeof(btn) === 'number' && config.state === 'dispay_2'|| typeof(btn) === 'number' && config.state === 'newPass') {
    console.log('input');
      IrInput(btn);
      return;
    }
    if (btn === 'SETUP' && config.state === 'waiting') {
      SettingsDisplay_1();
      console.log('Setup');
      simNum = 0;
      return;
    }
    if (btn === 'SETUP' && config.state === 'dispay_1' || btn === 'SETUP' && config.state === 'dispay_2' || btn === 'SETUP' && config.state === 'newWifi') {
      config.state = 'waiting';
      NumControl();
      saveConfig();
      console.log('Setup Exit');
      return;
    }

    if (btn === 'OK' && config.state === 'started' || btn === 'OK' && config.state === 'DEG' || btn === 'OK' && config.state === 'calibration' || btn === 'OK' && config.state === 'infinite' || btn === 'OK' && config.state === 'shot') {
      BtnStop();
      console.log('OK STOP');
      simNum = 0;
      return;
    }
    if (btn === 'OK' && config.state === 'waiting') {
      BtnStart();
      console.log('OK START');
      simNum = 0;
      return;
    }


    if (btn === 'DOWN' && config.state === 'dispay_1') {
      marker = marker + indent;
      SettingsDisplay_1();
      simNum = 0;
      console.log('Down D1');
      return;
    }
    if (btn === 'DOWN' && config.state === 'dispay_2') {
      marker = marker + indent;
      SettingsDisplay_2();
      console.log('Down D2');
      simNum = 0;
      return;
    }

    
    if (btn === 'UP' && config.state === 'dispay_1') {
      marker = marker - indent;
      SettingsDisplay_1();
      simNum = 0;
      console.log('UP D1');
      return;
    }
    if (btn === 'UP' && config.state === 'dispay_2') {
      marker = marker - indent;
      SettingsDisplay_2();
      console.log('UP D2');
      simNum = 0;
      return;
    }

    if (btn === 'RIGHT' && config.state === 'dispay_1') {
      SettingsDisplay_2();
      console.log('Right');
      simNum = 0;
      return;
    }
    if (btn === 'LEFT' && config.state === 'dispay_2') {
      SettingsDisplay_1();
      console.log('Left');
      simNum = 0;
      return;
    }
    if (btn === 'RIGHT' && config.state != 'dispay_2') {
      digitalWrite(pinDir, 1);
      digitalWrite(pinStep, 0);
      digitalWrite(pinEn, stOn);
      _speed = 1;
      infiniteRotation();
      console.log('Right rotation');
      return;
    }
    if (btn === 'LEFT' && config.state != 'dispay_1') {
      digitalWrite(pinDir, 0);
      digitalWrite(pinStep, 0);
      digitalWrite(pinEn, stOn);
      _speed = 1;
      infiniteRotation();
      console.log('Left rotation');
      return;
    }
    if (btn === 'CALIBR' && config.state === 'dispay_1' || btn === 'CALIBR' && config.state === 'dispay_2') {
      Calibration();
      return;
    }
    if (btn === 'CALIBR' && config.state === 'calibration') {
        var calibrationCorrection = Math.ceil(config.allSteps * 0.03);
            config.allSteps = config.allSteps - calibrationCorrection;
      Stop();
      saveConfig();
    }
    if (btn === 'DEG' && config.state === 'waiting') {
      deg();
      return;
    }
    if (btn === 'DEG' && config.state === 'DEG') {
      Stop();
    }

    if (btn === 'WIFI' && config.state === 'waiting') {
      photoPizzaIp = 'connection';
      StartDisplay();
      wifiConnect();
      console.log('WIFI');
      simNum = 0;
      return;
    }

    if (btn === 'UP' && config.state === 'infinite') {
      config.speed = config.speed + config.stsp;
      analogWrite(pinStep, 0.5, { freq : config.speed } );
      return;
    }

    if (btn === 'DOWN' && config.state === 'infinite' && config.speed > config.stsp) {
      config.speed = config.speed - config.stsp;
      analogWrite(pinStep, 0.5, { freq : config.speed } );
      return;
    }
  });

  function shotIr() {
    //var sony = [2.3,0.6,1.1,0.6,0.6,0.6,1.2,0.6,1.1,0.6,0.6,0.6,1.2,0.6,0.6,0.6,0.6,0.6,1.1,0.6,0.6,0.6,1.2,0.6,1.1,0.6,1.1,0.6,0.6,0.6,0.6,0.6,0.6,0.6,1.2,0.6,1.1,0.6,1.1,0.6,1.2,12.4,2.3,0.6,1.1,0.6,0.6,0.6,1.2,0.6,1.1,0.6,0.6,0.6,1.1,0.6,0.6,0.6,0.6,0.6,1.1,0.6,0.6,0.6,1.1,0.6,1.2,0.6,1.1,0.7,0.6,0.6,0.6,0.6,0.6,0.6,1.1,0.6,1.2,0.6,1.2,0.6,1.1,12.4,2.3,0.6,1.2,0.5,0.7,0.6,1.1,0.7,1.1,0.6,0.6,0.6,1.2,0.6,0.6,0.6,0.6,0.6,1.2,0.6,0.6,0.6,1.2,0.6,1.1,0.6,1.1,0.6,0.6,0.6,0.6,0.6,0.6,0.6,1.1,0.6,1.2,0.6,1.2,0.6,1.2,12.4,2.3,0.6,1.1,0.6,0.6,0.6,1.1,0.6,1.1,0.6,0.6,0.6,1.2,0.6,0.6,0.6,0.6,0.6,1.1,0.6,0.6,0.6,1.1,0.6,1.1,0.6,1.2,0.6,0.6,0.6,0.6,0.6,0.6,0.6,1.2,0.6,1.1,0.6,1.1,0.6,1.2,12.3,2.4,0.6,1.2,0.6,0.6,0.6,1.2,0.6,1.1,0.6,0.6,0.6,1.1,0.6,0.6,0.6,0.6,0.6,1.2,0.6,0.6,0.6,1.1,0.6,1.2,0.6,1.1,0.6,0.6,0.6,0.6,0.6,0.6,0.6,1.1,0.6,1.2,0.6,1.1,0.7,1.1,12.4,2.3,0.6,1.2,0.6,0.6,0.6,1.1,0.6,1.2,0.6,0.6,0.6,1.2,0.6,0.6,0.6,0.6,0.6,1.2,0.6,0.6,0.6,1.2,0.6,1.1,0.6,1.2,0.6,0.6,0.6,0.6,0.6,0.6,0.6,1.2,0.6,1.1,0.6,1.1,0.6,1.2,12.4,2.3,0.6,1.2,0.6,0.6,0.6,1.2,0.6,1.1,0.6,0.6,0.6,1.1,0.6,0.6,0.6,0.6,0.6,1.2,0.6,0.6,0.6,1.2,0.6,1.1,0.7,1.1,0.6,0.6,0.6,0.6,0.6,0.6,0.6,1.1,0.6,1.2,0.6,1.1,0.6,1.1,12.4,2.3,0.7,1.1,0.6,0.6,0.6,1.1,0.6,1.2,0.6,0.6,0.6,1.2,0.6,0.6,0.6,0.6,0.6,1.1,0.6,0.6,0.6,1.1,0.6,1.2,0.6,1.1,0.6,0.6,0.6,0.6,0.6,0.6,0.6,1.2,0.6,1.2,0.6,1.1,0.6,1.1];
    //analogWrite(D16,0.9,{freq:38000});//cathode (GND)
    //digitalPulse(D17, 1, sony);//anode
    //digitalPulse(D17, 1, 0);
    //analogWrite(D16,0);
  }

  function LogoDisplay(){
    if (!display) {
      NumControl();
      return;
    }
    var x1x2 = 1;
    g.clear();
    g.setFontBitmap();
    g.setFont8x16();
    g.drawString(config.firmwareVersion, 10, 45);
    g.flip();
    var preloader = setInterval(function () {
      g.setContrast(x1x2);
      g.drawLine(x1x2, 20, x1x2, 30);
      x1x2 += 2;
      g.drawLine(x1x2, 20, x1x2, 30);
      x1x2 += 2;
      g.drawLine(x1x2, 20, x1x2, 30);
      x1x2 += 2;
      g.drawLine(x1x2, 20, x1x2, 30);
      x1x2 += 2;
      g.drawLine(x1x2, 20, x1x2, 30);
      x1x2 += 2;
      g.drawLine(x1x2, 20, x1x2, 30);
      x1x2 += 2;
      g.flip();
      if (x1x2 > 126) {
        clearInterval(preloader);
        NumControl();
        StartDisplay();
        //wifiConnect();
      }
    }, 10);
  }
  
  function StartDisplay(){
    if (!display) {
      return;
    }
    g.clear();
    g.setFontVector(35);
    g.drawString(config.framesLeft + ' f', 0, 0);
    g.flip();
    g.setFontBitmap();
    g.setFont8x16();
    g.drawString('speed: ' + config.speed, 0, 30);
    g.drawString('IP: ' + photoPizzaIp, 0, 45);
    g.flip();
  }

  function SettingsDisplay_1(){
    if (!display) {
      return;
    }
    config.state = 'dispay_1';

    if (marker > indent * 4) {
      marker = 0;
    } else if (marker < 0) {
      marker = indent * 4;
    }

    g.clear();

    g.setFontBitmap();
    g.setFont8x16();
    g.drawString('>', 1, marker);
    g.drawString('>', 117, 28);
    g.drawString('1', 117, 0);

    g.drawLine(112, 0, 112, 127);

    g.drawString('frame', 8, 0);
    g.drawString('=', nameIndent, 0);
    g.drawString(config.frame, 57, 0);
  
    g.drawString('delay', 8, indent);
    g.drawString('=', nameIndent, indent);
    g.drawString(config.delay, 57, indent);
  
    g.drawString('pause', 8, indent * 2);
    g.drawString('=', nameIndent, indent * 2);
    g.drawString(config.pause, 57, indent * 2);
  
    g.drawString('speed', 8, indent * 3);
    g.drawString('=', nameIndent, indent * 3);
    g.drawString(config.speed, 57, indent * 3);
  
    g.drawString('degX', 8, indent * 4);
    g.drawString('=', nameIndent, indent * 4);
    g.drawString(config.degreesX, 57, indent * 4);
  
    g.flip();
  }
  
  function SettingsDisplay_2(){
    if (!display) {
      return;
    }
    if (config.direction === 1) {
      dirDisplay = 'right';
    } else {
      dirDisplay = 'left';
    }
    
    config.state = 'dispay_2';
  
    if (marker > indent * 3) {
      marker = 0;
    } else if (marker < 0) {
      marker = indent * 3;
    }
  
    g.clear();
  
    g.setFontBitmap();
    g.setFont8x16();
    g.drawString('>', 1, marker);
    g.drawString('<', 117, 28);
    g.drawString('2', 117, 0);
  
    g.drawLine(112, 0, 112, 127);
  
    nameIndent = 48;
  
    g.drawString('mode', 8, 0);
    g.drawString('=', nameIndent, 0);
    g.drawString(config.shootingMode, 57, 0);
  
    g.drawString('direc', 8, indent);
    g.drawString('=', nameIndent, indent);
    g.drawString(dirDisplay, 57, indent);
  
    g.drawString('steps', 8, indent * 2);
    g.drawString('=', nameIndent, indent * 2);
    g.drawString(config.allSteps, 57, indent * 2);

    g.drawString('timeS', 8, indent * 3);
    g.drawString('=', nameIndent, indent * 3);
    g.drawString(config.shutterT, 57, indent * 3);

    g.flip();
  }
  
  function IrInput(btn) {
  
    irDigital = btn + '';
  
    if (config.state === 'dispay_1' && marker === 0 && simNum <= 7 && simNum > 0) {
      config.frame = (config.frame + irDigital) * 1;
      NumControl();
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === 0 && simNum === 0 && irDigital != '0') {
      config.frame = '';
      config.frame = (config.frame + irDigital) * 1;
      NumControl();
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent && simNum <= 7 && simNum > 0) {
      config.delay = (config.delay + irDigital) * 1;
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent && simNum === 0 && irDigital != '0') {
      config.delay = '';
      config.delay = (config.delay + irDigital) * 1;
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent * 2 && simNum <= 7 && simNum > 0) {
      config.pause = (config.pause + irDigital) * 1;
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent * 2 && simNum === 0 && irDigital != '0') {
      config.pause = '';
      config.pause = (config.pause + irDigital) * 1;
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent * 3 && simNum <= 7 && simNum > 0) {
      config.speed = (config.speed + irDigital) * 1;
      NumControl();
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent * 3 && simNum === 0 && irDigital != '0') {
      config.speed = '';
      config.speed = (config.speed + irDigital) * 1;
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent * 4 && simNum <= 7 && simNum > 0) {
        config.degreesX = (config.degreesX + irDigital) * 1;
      SettingsDisplay_1();
      simNum++;
    }
    if (config.state === 'dispay_1' && marker === indent * 4 && simNum === 0 && irDigital != '0') {
        config.degreesX = '';
        config.degreesX = (config.degreesX + irDigital) * 1;
      SettingsDisplay_1();
      simNum++;
    }
  
    //DISPLAY 2
    if (config.state === 'dispay_2' && marker === 0 && irDigital === '1') {
      config.shootingMode = 'inter';
      SettingsDisplay_2();
    }
    if (config.state === 'dispay_2' && marker === 0 && irDigital === '2') {
      config.shootingMode = 'seria';
      SettingsDisplay_2();
    }
    if (config.state === 'dispay_2' && marker === 0 && irDigital === '3') {
      config.shootingMode = 'nonST';
      SettingsDisplay_2();
    }
    if (config.state === 'dispay_2' && marker === 0 && irDigital === '4') {
      config.shootingMode = 'PingP';
      SettingsDisplay_2();
    }
    if (config.state === 'dispay_2' && marker === indent && irDigital === '1') {
      config.direction = 1;
      SettingsDisplay_2();
    }
    if (config.state === 'dispay_2' && marker === indent && irDigital === '2') {
      config.direction = 0;
      SettingsDisplay_2();
    }
    if (config.state === 'dispay_2' && marker === indent * 2 && simNum <= 7 && simNum > 0) {
      config.allSteps = (config.allSteps + irDigital) * 1;
      NumControl();
      SettingsDisplay_2();
      simNum++;
    }
    if (config.state === 'dispay_2' && marker === indent * 2 && simNum === 0 && irDigital != '0') {
      config.allSteps = '';
      config.allSteps = (config.allSteps + irDigital) * 1;
      NumControl();
      SettingsDisplay_2();
      simNum++;
    }
    if (config.state === 'dispay_2' && marker === indent * 3 && simNum <= 7 && simNum > 0) {
        config.shutterT = (config.shutterT + irDigital) * 1;
        NumControl();
        SettingsDisplay_2();
        simNum++;
      }
    if (config.state === 'dispay_2' && marker === indent * 3 && simNum === 0 && irDigital != '0') {
       config.shutterT = '';
       config.shutterT = (config.shutterT + irDigital) * 1;
       SettingsDisplay_2();
      simNum++;
    }
  }

  var stepperTime;
  var accelerationTime;
  var accIntervalSteps;
  var accSpeed;
  var shootingTime1F;
  var shootingTime;
  var _shootingTime;
  var nonStopTimerSpeed;
  var accSteps;
  var accStep;
  var speedCorrection;
  var framesCorrection;
  
  function NumControl() {
    console.log('NumControl');
    accSteps = (config.allSteps / config.frame) / 4;
    accStep = (config.speed / accSteps) * 10;
    config.framesLeft = config.frame;
    _speed = 1;
    var frameSteps = config.allSteps / config.frame;
    stepperTime = frameSteps / config.speed * 500;
    var accelerationSteps = frameSteps / 4;
    accelerationTime = stepperTime / 4; 
    accIntervalSteps = Math.floor(0.04 * accelerationSteps);
    if (accIntervalSteps <= 0) {
      accIntervalSteps = 1;
    }
    //accStep = config.speed / accIntervalSteps;
    accSpeed = accelerationTime / accIntervalSteps;
    shootingTime1F = config.pause + config.delay + stepperTime;
    shootingTime = shootingTime1F * config.frame;
    _shootingTime = shootingTime;
    nonStopTimerSpeed = stepperTime;
    speedCorrection = Math.ceil((config.speed * 0.29) - ((config.allSteps / config.frame) / 40));
    digitalWrite(pinDir, config.direction);
  }
  
  function Start() {
    digitalWrite(pinEn, 0);
    digitalWrite(pinLaser, rOff);
    if (config.shootingMode === 'nonST' || config.shootingMode === 'seria') {
      config.state = 'started';
      nonStopStart0();
      return;
    }
    if (config.framesLeft > 0) {
      config.state = 'started';
      ShotingPause();
    } else {
      Stop();
    }
  }
  
  function Stop() {
    console.log(_speed);
    if (_speed > 1 + accStep) {
      stepperSlowdown();
      return;
    }
    console.log('stop');
    clearInterval();
    config.state = 'waiting';
    digitalWrite(pinStep, 0);
    digitalWrite(pinEn, 1);
    digitalWrite(pinRelay, rOff);
    digitalWrite(pinLaser, rOn);
    digitalWrite(pinDir, config.direction);
    //P8.mode('analog');
    NumControl();
    StartDisplay();
    if (wsocket) {
      config.state = 'waiting';
      wsocket.send(JSON.stringify(config));
      //wsocket.send(JSON.stringify(config));
    }
  }
  function nonStopStart0() {
    
    digitalWrite(pinEn, 0);
    if (config.direction === 1) {
        digitalWrite(pinDir, 0);
    } else {
        digitalWrite(pinDir, 1);
    }
    
    config.state = 'started';
    if (display) {
        g.clear();
        g.setFontBitmap();
        g.setFont8x16();
        g.drawString('   No stop spin', 0, 30);
        g.flip();
      }

    _speed = 1;

    var degSpeedCorrection = Math.ceil((config.speed * 0.29) - ((config.allSteps / (360 / config.degreesX)) / 40));
    console.log(degSpeedCorrection);
    var degStepsLeft = Math.ceil((config.allSteps + degSpeedCorrection) / (360 / config.degreesX));

    var degAccSteps = (config.allSteps / (360 / config.degreesX)) / 4;
    var degAccStep = (config.speed / degAccSteps) * 10;

    var stepTimer = setInterval(function () {
        if (degAccSteps * 3 < degStepsLeft && _speed < config.speed) {
            _speed += degAccStep;
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          if (degAccSteps >= degStepsLeft && _speed > 500) {
            _speed -= degAccStep;
            if (_speed < degAccStep + 100) {
              _speed = 100;
            }
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
    
          if (_speed > config.speed) {
            _speed = config.speed;
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          degStepsLeft -= _speed / 100;
      
      if (degStepsLeft <= 0) {
        clearInterval(stepTimer);
        nonStopStart1();
        return;
      }
 
    }, 10);
  }
  
  function nonStopStart1() {

    digitalWrite(pinDir, config.direction);
    
    _speed = 1;

    var degSpeedCorrection = Math.ceil((config.speed * 0.29) - ((config.allSteps / (360 / config.degreesX)) / 40));
    console.log(degSpeedCorrection);
    var degStepsLeft = Math.ceil((config.allSteps + degSpeedCorrection) / (360 / config.degreesX));

    var degAccSteps = (config.allSteps / (360 / config.degreesX)) / 4;
    var degAccStep = (config.speed / degAccSteps) * 10;

    var stepTimer = setInterval(function () {
        if (degAccSteps * 3 < degStepsLeft && _speed < config.speed) {
            _speed += degAccStep;
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          degStepsLeft -= _speed / 100;
      
      if (degStepsLeft <= 0) {
        clearInterval(stepTimer); 
        nonStop();
        return;
      }
 
    }, 10);
  }

  function nonStop() {
   
    //var nonsSpeedCorrection = Math.ceil((config.speed * 0.8) - ((config.allSteps / config.frame) / 40));
    //var nonsStepsLeft = Math.ceil(config.allSteps - nonsSpeedCorrection);
    //var nonsStepsLeft_ = Math.ceil(config.allSteps + nonsSpeedCorrection);
    var nonsStepsLeft = config.allSteps + speedCorrection + _speed * 0.9;
    var nonsStepsLeft_ = config.allSteps + speedCorrection + _speed * 0.9;
    //var nonsStepsLeft = Math.ceil(config.allSteps + nonsSpeedCorrection);
    //var nonsStepsLeft_ = Math.ceil(config.allSteps + nonsSpeedCorrection);
    var frameTime = nonsStepsLeft_ / config.frame;
    digitalWrite(pinRelay, rOn);
    var stepTimer = setInterval(function () {
        //analogWrite(pinStep, 0.5, { freq : _speed } );
        nonsStepsLeft -= _speed / 100;
        frameTime -= _speed / 100;
        //console.log(frameTime);
        if (frameTime <= 0 && config.shootingMode != 'seria') {
            digitalWrite(pinRelay, rOn);
            frameTime = nonsStepsLeft_ / config.frame;
        }
        if (frameTime <= (nonsStepsLeft_ / config.frame) / 2 && config.shootingMode != 'seria') {
            digitalWrite(pinRelay, rOff);
        }
          
      if (nonsStepsLeft <= 0) {
        clearInterval(stepTimer);
        digitalWrite(pinRelay, rOff);
        nonStopStop0();
        return;
      }
      
    }, 10);
  }

  function nonStopStop0() {

    var degSpeedCorrection = Math.ceil((config.speed * 0.29) - ((config.allSteps / (360 / config.degreesX)) / 40));
    console.log(degSpeedCorrection);
    var degStepsLeft = Math.ceil((config.allSteps + degSpeedCorrection) / (360 / config.degreesX));

    var degAccSteps = (config.allSteps / (360 / config.degreesX)) / 4;
    var degAccStep = (config.speed / degAccSteps) * 10;

    var stepTimer = setInterval(function () {
          if (degAccSteps >= degStepsLeft && _speed > 500) {
            _speed -= degAccStep;
            if (_speed < degAccStep + 100) {
              _speed = 100;
            }
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          degStepsLeft -= _speed / 100;
      
      if (degStepsLeft <= 0) {
        clearInterval(stepTimer);
        nonStopStop1();
        return;
      }
 
    }, 10);
  }

  function nonStopStop1() {
    
    digitalWrite(pinEn, 0);
    if (config.direction === 1) {
        digitalWrite(pinDir, 0);
    } else {
        digitalWrite(pinDir, 1);
    }

    _speed = 1;

    var degSpeedCorrection = Math.ceil((config.speed * 0.29) - ((config.allSteps / (360 / config.degreesX)) / 40));
    console.log(degSpeedCorrection);
    var degStepsLeft = Math.ceil((config.allSteps + degSpeedCorrection) / (360 / config.degreesX));

    var degAccSteps = (config.allSteps / (360 / config.degreesX)) / 4;
    var degAccStep = (config.speed / degAccSteps) * 10;

    var stepTimer = setInterval(function () {
        if (degAccSteps * 3 < degStepsLeft && _speed < config.speed) {
            _speed += degAccStep;
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          if (degAccSteps >= degStepsLeft && _speed > 500) {
            _speed -= degAccStep;
            if (_speed < degAccStep + 100) {
              _speed = 100;
            }
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
    
          if (_speed > config.speed) {
            _speed = config.speed;
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          degStepsLeft -= _speed / 100;
      
      if (degStepsLeft <= 0) {
        clearInterval(stepTimer);
        Stop();
        return;
      }
 
    }, 10);
  }
  
  function shot() {
    console.log('shot');
    digitalWrite(pinRelay, rOn);
    shotIr();
    config.state = 'shot';
    var shotTimer = setTimeout(function () {
      config.state = 'waiting';
      digitalWrite(pinRelay, rOff);
      clearTimeout(shotTimer);
    }, config.delay);
  }

  function Stepper() {
    config.state = 'started';
    _speed = 1;

    
    //var stepsLeft = config.allSteps / config.frame;
    var stepsLeft = (config.allSteps + speedCorrection) / config.frame;

    var stepTimer = setInterval(function () {
      if (accSteps * 3 < stepsLeft && _speed < config.speed) {
        _speed += accStep;
        analogWrite(pinStep, 0.5, { freq : _speed } );
      }
      if (accSteps >= stepsLeft && _speed > 500) {
        _speed -= accStep;
        if (_speed < accStep + 100) {
          _speed = 100; 
        }
        analogWrite(pinStep, 0.5, { freq : _speed } );
      }

      if (_speed > config.speed) {
        _speed = config.speed;
        analogWrite(pinStep, 0.5, { freq : _speed } );
      }
      stepsLeft -= _speed / 100;
      //console.log('stepsLeft ' + stepsLeft);
      //console.log('_speed ' + _speed);
      
      if (stepsLeft <= 0) {
        clearInterval(stepTimer);
        _shootingTime = _shootingTime - shootingTime1F;
        digitalWrite(pinStep, 0);
        Start();
        return;
      }

      
    }, 10);
  }

  function stepperSlowdown() {
    config.state = 'started';
    if (_speed <= 1) {
      Stop();
      return;
    }

    var stepTimer = setInterval(function () {

      if (_speed <= 1 + accStep) {
        clearInterval(stepTimer);
        Stop();
        return;
      }
      _speed -= accStep;
      analogWrite(pinStep, 0.5, { freq : _speed } );
    }, 10);

  }
  
  function ShotingPause() {
    var pauseTimer = setTimeout(function () {
    Relay();
      clearTimeout(pauseTimer);
    }, config.pause);
  }
  
  function Relay() {
    console.log('Relay');
  
    if (config.framesLeft > 0) {
      //config.state = 'shot';
      shotIr();
      digitalWrite(pinRelay, rOn);
      //P8.mode('output');
      config.framesLeft--;
      var frameTimer = setTimeout(function () {
        if (wsocket) {
          wsocket.send(JSON.stringify(config));
        }
        StartDisplay();
        Stepper();
        clearTimeout(frameTimer);
      }, config.delay);
      var relayTimer = setTimeout(function () {
        digitalWrite(pinRelay, rOff);
        clearTimeout(relayTimer);
      }, config.shutterT);
    } else {
      Stop();
    }
  }
  
  function BtnStop() {
    console.log('BtnStop');
        Stop();
  }
  function BtnStart() {
    StartDisplay();
    Start();
  }
  
  function infiniteRotation() {

    config.state = 'infinite';

    digitalWrite(pinLaser, rOff);
    
    if (display) {
        g.clear();
        g.setFontBitmap();
        g.setFont8x16();
        g.drawString(' spins endlessly', 0, 30);
        g.flip();
      }
  
    digitalWrite(pinEn, 0);
  
    var accTimerMax = setInterval(function () {
      analogWrite(pinStep, 0.5, { freq : _speed } );
      _speed = _speed + accStep;
      if (_speed >= config.speed) {
        clearInterval(accTimerMax);
        analogWrite(pinStep, 0.5, { freq : config.speed } );
      }
    }, accSpeed);
  }
  
  function deg() {
    
    digitalWrite(pinEn, 0);
    
    config.state = 'started';
    g.clear();
    g.setFontVector(20);
    g.drawString('turn to: '+ config.degreesX +'°', 0, 0);
    g.flip();

    _speed = 1;

    var degSpeedCorrection = Math.ceil((config.speed * 0.29) - ((config.allSteps / (360 / config.degreesX)) / 40));
    console.log(degSpeedCorrection);
    var degStepsLeft = Math.ceil((config.allSteps + degSpeedCorrection) / (360 / config.degreesX));

    var degAccSteps = (config.allSteps / (360 / config.degreesX)) / 4;
    var degAccStep = (config.speed / degAccSteps) * 10;

    var stepTimer = setInterval(function () {
        if (degAccSteps * 3 < degStepsLeft && _speed < config.speed) {
            _speed += degAccStep;
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          if (degAccSteps >= degStepsLeft && _speed > 500) {
            _speed -= degAccStep;
            if (_speed < degAccStep + 100) {
              _speed = 100;
            }
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
    
          if (_speed > config.speed) {
            _speed = config.speed;
            analogWrite(pinStep, 0.5, { freq : _speed } );
          }
          degStepsLeft -= _speed / 100;
      
      if (degStepsLeft <= 0) {
        clearInterval(stepTimer);
        digitalWrite(pinStep, 0);
        Stop();
        return;
      }
 
    }, 10);
  }
  
  function Calibration() {
    config.state = 'calibration';
    g.clear();
    g.setFontVector(20);
    g.drawString('calibration', 0, 0);
    g.flip();
  
    digitalWrite(pinEn, 0);
    var step1 = true;
    config.allSteps = 0;
    analogWrite(pinStep, 0.5, { freq : config.speed } );
    
    setInterval(function () {
      config.allSteps += config.speed / 100;
   }, 10);
  }
  if (display) {
    //Display connection
    //Here you need to select the type of your display

    //g = require("SH1106").connect(I2C1, LogoDisplay);//1.3" blue case
    g = require("SSD1306").connect(I2C1, LogoDisplay);//0.9" blue case or 1.3" black case
  }
  
  
};

function onInit () {
  
  I2C1.setup({scl:I2C_SCL, sda:I2C_SDA});
  fs = require("fs");
  try {
    config = JSON.parse(fs.readFileSync("cfg.htm"));
  } catch (e) {
    console.log('Formatting FS...');
    E.flashFatFS({ format: true });
    console.log('Writing Defconfig');
    fs.writeFileSync('cfg.htm', JSON.stringify(defConfig));
    config = JSON.parse(fs.readFileSync("cfg.htm"));
    console.log('Defconfig saved');
  }
  config.state = 'waiting';
  config.firmwareVersion = 'PhotoPizza v7.6';

  var riadTimer = setTimeout(function () {
    run();
  }, 500);
}
