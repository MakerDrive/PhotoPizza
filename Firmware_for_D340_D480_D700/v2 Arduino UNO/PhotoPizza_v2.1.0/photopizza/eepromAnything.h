// From http://playground.arduino.cc/Code/EEPROMWriteAnything
#include <EEPROM.h>

#if defined(ARDUINO) && ARDUINO >= 100
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

template<class T> int EEPROM_writeAnything(int ee, const T& value) {
  const byte* p = (const byte*) (const void*) &value;
  unsigned int i;
  for (i = 0; i < sizeof(value); i++)
    EEPROM.write(ee++, *p++);
  return i;
}

template<class T> int EEPROM_readAnything(int ee, T& value) {
  byte* p = (byte*) (void*) &value;
  unsigned int i;
  for (i = 0; i < sizeof(value); i++)
    *p++ = EEPROM.read(ee++);
  return i;
}

