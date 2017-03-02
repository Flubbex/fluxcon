var View = require("../class/view");

var ConsoleView = new View({
		el:"console",
		initialize:function()
		{
		},
		log:function()
		{
			var args = [].slice.call(arguments);
			var newelm = document.createElement("div");
			
			for (var i in args)
			{
				var prop = args[i];
				var newspan = document.createElement("span");
				var string;
					switch (typeof(prop))
					{
						case "object":
							if (Error.prototype.isPrototypeOf(prop))
								newspan.style.color = "red";
						case "function":
							string = prop.toString();
							break;
						case "number":
							newspan.style.color = "darkorange";
							newspan.style.fontFamily = "Courier New";
						case "string":
							string = prop;
							break;
						case "undefined":
							string = "'undefined'";
							newspan.style.color = "brown";
							break;
						default:
							this.write("Warning: Unhandled type cast to string: ",typeof(prop))
							string = prop.toString();
							break;
					}
				newspan.innerHTML = string;
				newelm.appendChild(newspan);
			}
			this.el.appendChild(newelm);
			return newelm;
		}
})

module.exports = ConsoleView;
