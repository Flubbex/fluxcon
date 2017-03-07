var View = require("../class/view");

var ConsoleView = new View({
		el:"console",
		initialize:function()
		{
		},
		clear:function(placeholder)
		{
			this.el.innerHTML = "";
			return placeholder || "console cleared.";
		},
		log:function(timestamp,data)
		{
			var newdiv 		= document.createElement("div");
			var dataspan 	= document.createElement("span");
			var timespan 	= document.createElement("span");
			timespan.innerHTML = timestamp;
	
			switch (typeof(data))
			{
				case "string":
					//don't need to cast anything
					break;
				case "function":
					data = data.toString();
					break;
				case "number":
					dataspan.style.color = "darkorange";
					dataspan.style.fontFamily = "Courier New";
					break;
				case "boolean":
					dataspan.style.color = "purple";
					dataspan.style.fontWeight = 'bold';
					dataspan.style.fontFamily = "Courier New";
					break;
				case "undefined":
					data = "'undefined'";
					dataspan.style.color = "brown";
					break;
				case "object":
					if (data.type==="error") //General error
					{
						dataspan.style.color = "red";
						var prettyfilename = data.filename.slice(data.filename.lastIndexOf("/")+1);
											
						data = data.message + 
							" ["+prettyfilename+":"+data.lineno+":"+data.colno+"]";
					}
					else if(data.stack)
					{
						dataspan.style.color = "red";
						data = data.message;
						break;
					}
					break;
				default:
					this.log("Warning: Unhandled type cast to string: "+typeof(data));
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
