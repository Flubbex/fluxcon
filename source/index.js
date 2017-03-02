Object.dump = require("./util/object").dump;

var Config 		= require("./config");
var Fluxcon 	= require("./module/fluxcon");
var ViewClass	=	require("./class/view");

window.addEventListener("load",
	function(){
		ViewClass.domReady();
		var flx = new Fluxcon();
		function printError(e){
			flx.log(e);
		};
		
		window.addEventListener('error',printError);

		function processHash() {
		  const hash = location.hash.slice(1);
		  if (hash)
			{
				try //to load as base64
				{
					flx.parseInput ( atob( hash ) );
				}
				catch (e)
				{
					flx.parseInput(hash)
				}
				
				location.hash = "";
			}
		}

		window.addEventListener('hashchange', processHash);
		processHash();
		flx.log("Fluxcon ",Config.version," (",Config.vername,") running");
		flx.focusEditor();
	}
);
