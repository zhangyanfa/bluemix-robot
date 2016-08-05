var DigitalSensor = require('./base/digitalSensor')
var commands     = require('../commands')

function ButtonDigitalSensor(pin) {
  DigitalSensor.apply(this, Array.prototype.slice.call(arguments))
}
ButtonDigitalSensor.prototype = new DigitalSensor()

ButtonDigitalSensor.prototype.read = function() {
  var write = this.board.writeBytes(commands.dRead.concat([this.pin,commands.unused, commands.unused]))
  if (write) {
    this.board.wait(100)
  //  this.board.readByte()
    var bytes = this.board.readBytes()[0]
    return bytes
  } else {
    return false
  }
}

module.exports = ButtonDigitalSensor
