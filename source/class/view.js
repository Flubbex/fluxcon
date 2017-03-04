var Emitter = require("./emitter");

function View(attributes)
{
	this.properties = {};

	for (var attr in attributes)
		switch(typeof(attributes[attr]))
		{
			case "function":
				this[attr] = attributes[attr];
				break
			default:
				this.properties[attr] = attributes[attr];
				break;
		}
	
	var self = this;

	View.domloaders.push(function(){
		self.el = document.getElementById(self.properties.el);
		if (self.initialize)
			self.initialize();
	});
}

View.prototype = new Emitter();

View.domloaders = [];

View.domReady = function()
{
	for (var i=0;i<View.domloaders.length;i++)
		View.domloaders[i]();
}

module.exports = View;
