var Emitter = require("./emitter");

var Model = function(attributes)
{
	for (var attr in attributes)
		this[attr] = attributes[attr];
}

Model.prototype = new Emitter();

module.exports = Model;
