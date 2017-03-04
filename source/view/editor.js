var View = require("../class/view");

var EditorView = new View({
		el:"editor",
		initialize:function()
		{
			this.textbox = document.getElementById("text");
			this.toolbox = {
					tb_run:		document.getElementById("tb_run"),
					tb_load:	document.getElementById("tb_load"),
					tb_save:	document.getElementById("tb_save"),
					tb_panic:	document.getElementById("tb_pan"),
					tb_flux:	document.getElementById("tb_flux")
				};
			
			for (var toolname in this.toolbox)
			{
				this.toolbox[toolname].addEventListener("click",this[toolname]);
			}
			document.addEventListener("keydown",function(key){
				if (key.keyCode===13) //13 === "Enter"
				{
					EditorView.emit("input",EditorView.textbox.value);
				}
			});	
		},
		clear:function()
		{
			this.textbox.value = "";
		},
		tb_run:function()
		{
			EditorView.emit("input",EditorView.textbox.value);
		}
})

module.exports = EditorView;
