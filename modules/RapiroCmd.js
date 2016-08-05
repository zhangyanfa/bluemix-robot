// Call RapiroCmd.sh

module.exports.write = function(rapiroCmd)
{
	result = new run_cmd('/projects/robot/modules/RapiroCmd.sh', [rapiroCmd], function (me, data){me.stdout=data;});
	return result;
}

function run_cmd(cmd, args, cb) {
  var spawn = require('child_process').spawn
  var child = spawn(cmd, args);
  var me = this;
  child.stdout.on('data', function(me, data) {
     cb(me, data);
  });
}

/*var write2 = function(rapiroCmd)
{
	result = new run_cmd('./RapiroCmd.sh', [rapiroCmd], function (me, data){me.stdout=data;});
	return result;
}*/

