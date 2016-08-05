var AnalogSensor = require('./base/analogSensor')
var commands     = require('../commands')

function SoundAnalogSensor(pin) {
  AnalogSensor.apply(this, Array.prototype.slice.call(arguments))
}
SoundAnalogSensor.prototype = new AnalogSensor()

SoundAnalogSensor.prototype.read = function() {
  var res = AnalogSensor.prototype.read.call(this)
  var number = parseInt(res)
  //var resistance = number <= 0 ? 0 : +(Number(parseFloat((1023 - number) * 10 / number)).toFixed(2))
  //return resistance
  return number
}

module.exports = SoundAnalogSensor