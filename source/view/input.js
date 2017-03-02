var View = require("../class/view");

var InputView = new View({
		el:"text",
		initialize:function()
		{
			var self = this;
			this.el.addEventListener("keydown",function(e){
				if (e.keyCode===13)
				{
					self.emit("input",self.el.value);
				}
			});	
		},
		clear:function()
		{
			this.el.value = "";
		}
})

module.exports = InputView;
