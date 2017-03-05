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
				this.toolbox[toolname]
				.addEventListener("click",this[toolname]);
			}
			document.addEventListener("keydown",function(key){
				if (key.keyCode===13)	//No empty runs 
				{
					if (EditorView.textbox.value.length===0)
					{
						window.setTimeout(function(){
						EditorView.textbox.value = "";
						},0);
						return
					}
					if (key.shiftKey)
						return
					
					EditorView.emit("input",EditorView.textbox.value);
					EditorView.clearText();
				}
			});	
		},
		clearText:function()
		{
			window.setTimeout(function(){
				EditorView.textbox.value = "";
			},0);
		},
		tb_run:function()
		{
			if (EditorView.textbox.value==="")
				return
				
			EditorView.emit("input",EditorView.textbox.value);
			EditorView.clearText();
		},
		tb_save:function()
		{
			EditorView.emit("input","this.history.save()");
		},
		tb_load:function()
		{
			var source = prompt("Paste your saucecode here.");
			EditorView.emit("clearConsole");
			EditorView.emit("input","this.history.load('"+source+"')");
		},
		tb_panic:function()
		{
			EditorView.emit("input","alert('AAAAAAH!')");
		},
		tb_flux:function()
		{
			EditorView.emit("toggleflux");
		}
})

module.exports = EditorView;
