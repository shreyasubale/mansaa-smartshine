var util = require('util');
var nodeCleanup = require('node-cleanup');


var NobleDevice = require('noble-device');

var SERVICE_UUID          = 'ffb0';
var CONTROL_UUID          = 'ffb2';
var EFFECT_UUID           = 'ffb2';

var MansaaLed = function(peripheral) {
  NobleDevice.call(this, peripheral);
};

MansaaLed.SCAN_UUIDS = [SERVICE_UUID];

MansaaLed.prototype.RGBtoBuffer = function (rgbString, brightness) {
  rgbString = rgbString || "000000";
  brightness = brightness || "d1";
  var fromString = brightness + rgbString 
  return Buffer.from(fromString, "hex")

};
MansaaLed.is = function(peripheral) {
  var localName = peripheral.advertisement.localName;
  console.log(localName);
  return true;
  return ((localName === undefined) || (localName === 'Cnlight') );
};

NobleDevice.Util.inherits(MansaaLed, NobleDevice);

MansaaLed.prototype.writeServiceStringCharacteristic = function(uuid, string, callback) {
  this.writeStringCharacteristic(SERVICE_UUID, uuid, string, callback);
};

MansaaLed.prototype.writeControlCharateristic = function(red, green, blue, brightness, callback) {
  var rgbString = red + green + blue;
  var brightNess = brightness;
  var command = this.RGBtoBuffer(rgbString,brightNess);
  this.writeServiceStringCharacteristic(CONTROL_UUID, command, callback);
};

MansaaLed.prototype.turnOn = function(callback) {
  this.writeControlCharateristic( "FF", "FF", "FF", "FF", callback);
};

MansaaLed.prototype.turnOff = function(callback) {
  this.writeControlCharateristic("00", "00", "00", "00",callback);
};

MansaaLed.prototype.setColorAndBrightness = function(red, green, blue, brightness, callback) {
    function convert(integer) {
        var str = Number(integer).toString(16);
        return str.length == 1 ? "0" + str : str;
    };
  red = convert(red);
  blue = convert(blue);
  green = convert(green);
  brightness = brightness?convert(brightness):"00";

  this.writeControlCharateristic(brightness, red, green, blue, callback);
};

// MansaaLed.prototype.setGradualMode = function(on, callback) {
//   this.writeServiceStringCharacteristic(EFFECT_UUID, on ? 'TS' : 'TE', callback);
// };

module.exports = MansaaLed;