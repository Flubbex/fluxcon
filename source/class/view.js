var Emitter = require("./fluxmitter");

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

	View.domloaders.push(function(window){
		self.el = window
					.document
					.getElementById(self.properties.el);
					
		if (self.initialize && typeof(self.initialize)==='function')
			self.initialize(window);
	});
}

View.prototype = new Emitter();

View.domloaders = [];

View.domReady = function(window)
{
	for (var i=0;i<View.domloaders.length;i++)
		View.domloaders[i](window);
}

module.exports = View;
