var View = require("../class/view");

var ConsoleView = new View({
		el:"console",
		initialize:function()
		{
		},
		log:function(timestamp,data)
		{
			var newdiv 		= document.createElement("div");
			var dataspan 	= document.createElement("span");
			var timespan 	= document.createElement("span");
			timespan.innerHTML = timestamp;
	
			switch (typeof(data))
			{
				case "object":
					if (Error.prototype.isPrototypeOf(data))
					dataspan.style.color = "red";
				case "function":
					data = data.toString();
					break;
				case "number":
					dataspan.style.color = "darkorange";
					dataspan.style.fontFamily = "Courier New";
				case "string":
					break;
				case "undefined":
					data = "'undefined'";
					dataspan.style.color = "brown";
					break;
				default:
					this.log("Warning: Unhandled type cast to string: "+typeof(data))
					data = data.toString();
					break;
			};

			dataspan.innerHTML = data;
			newdiv.appendChild(timespan);
			newdiv.appendChild(dataspan);
			this.el.appendChild(newdiv);
			return newdiv;
		}
})

module.exports = ConsoleView;
