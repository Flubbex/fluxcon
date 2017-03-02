!function t(n,e,o){function i(s,u){if(!e[s]){if(!n[s]){var c="function"==typeof require&&require;if(!u&&c)return c(s,!0);if(r)return r(s,!0);throw new Error("Cannot find module '"+s+"'")}var l=e[s]={exports:{}};n[s][0].call(l.exports,function(t){var e=n[s][1][t];return i(e?e:t)},l,l.exports,t,n,e,o)}return e[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(t,n,e){n.exports=function(t){return t||(t={}),t._subs=[],t._paused=!1,t._pending=[],t.on=function(n,e){t._subs[n]=t._subs[n]||[],t._subs[n].push(e)},t.off=function(n,e){if(t._subs[n])for(var o in t._subs[n])if(t._subs[n][o]===e){t._subs[n].splice(o);break}},t.emit=function(n){if(t._subs[n]){var e=Array.prototype.slice.call(arguments,1);if(t._paused)return t._pending[n]=t._pending[n]||[],void t._pending[n].push(e);for(var o in t._subs[n])t._subs[n][o].apply(t,e)}},t.pause=function(){t._paused=!0},t.resume=function(){t._paused=!1;for(var n in t._pending)for(var e=0;e<t._pending[n].length;e++)t.emit(n,t._pending[n][e])},t}},{}],2:[function(t,n,e){function o(t){this.properties={};for(var n in t)switch(typeof t[n]){case"function":this[n]=t[n];break;default:this.properties[n]=t[n]}var e=this;o.domloaders.push(function(){e.el=document.getElementById(e.properties.el),e.initialize&&e.initialize()}),i(this)}var i=t("emitonoff");o.domloaders=[],o.domReady=function(){for(var t=0;t<o.domloaders.length;t++)o.domloaders[t]()},n.exports=o},{emitonoff:1}],3:[function(t,n,e){Config={},Config.version="0.2.1",Config.vername="Sunny Taco",n.exports=Config},{}],4:[function(t,n,e){var o=function(){};o.prototype.get=function(t){var n=new XMLHttpRequest;return n.open("GET",t),n.send(),{then:function(t,e){n.addEventListener("load",function(){t.apply(e||this,arguments)})}}},n.exports=o},{}],5:[function(t,n,e){var o=function(){this.content=[]};o.key=0,o.toString=function(t){if(console.log(this.content.length),0===this.content.length)return"No history";result="<ul>"+(t||"History");for(var n=0;n<this.content.length;n++)result+="<li style='margin-left: 5%;'><span>"+this.content[n].time+"</span><span>"+this.content[n].command+"</span></li>";return result+="</ul>",result},o.prototype.push=function(t){return this.content.push(t)},o.prototype.get=function(t){return this.content[t]},o.prototype.clear=function(){this.content=[]},o.prototype.save=function(){var t=btoa("History.load('"+btoa(JSON.stringify(this))+"')"),n=location.toString();return n.endsWith("#")||(n+="#"),"<a href='"+n+t+"'>"+t+"</a>"},o.prototype.exec=function(t){for(var n=0;n<this.content.length-1;n++)console.log(n,this[n]),t(this.content[n].command)},o.prototype.load=function(t){if(!t)return"No command entered.";var n=JSON.parse(atob(t));this.clear();for(var e in n)this.content[e]=n[e];return this.exec(),this.toString("Loaded history")},n.exports=o},{}],6:[function(t,n,e){Object.dump=t("./util/object").dump;var o=t("./config"),i=t("./module/fluxcon"),r=t("./class/view");window.addEventListener("load",function(){function t(t){e.log(t)}function n(){const t=location.hash.slice(1);if(t){try{e.parseInput(atob(t))}catch(n){e.parseInput(t)}location.hash=""}}r.domReady();var e=new i;window.addEventListener("error",t),window.addEventListener("hashchange",n),n(),e.log("Fluxcon ",o.version," (",o.vername,") running"),e.focusEditor()})},{"./class/view":2,"./config":3,"./module/fluxcon":7,"./util/object":8}],7:[function(require,module,exports){function Fluxcon(){this.ajax=new AjaxController,this.history=new HistoryController,self=this,InputView.on("input",function(t){self.parseInput(t)})}var AjaxController=require("../controller/ajax"),HistoryController=require("../controller/history"),ConsoleView=require("../view/console"),InputView=require("../view/input");Fluxcon.prototype.parse=function(string){try{return eval(string)}catch(t){return t}return null},Fluxcon.prototype.parseLog=function(t,n){var e=this.parse(t),o=this.log(e);return n||this.history.push({time:this.timestamp(),command:t}),{el:o,result:e}},Fluxcon.prototype.parseInput=function(t){this.log(t).style.color="blue";var n=this.parseLog(t).result;return InputView.clear(),n},Fluxcon.prototype.up=function(){if(0===this.history.length)return!1;this.history.key=this.history.key+1>this.history.length?1:this.history.key+1;var t=this.history[this.history.key];this.input.elm.value=t.command},Fluxcon.prototype.down=function(){if(0===this.history.length)return!1;this.history.key=this.history.key-1<0?0:this.history.key-1;var t=this.history[this.history.key];this.input.elm.value=t.command},Fluxcon.prototype.timestamp=function(){return function(t){return"0"+t.getHours().toString().slice(0,2)+":0"+t.getMinutes().toString().slice(0,2)+":0"+t.getSeconds().toString().slice(0,2)}(new Date)},Fluxcon.prototype.focusEditor=function(){InputView.el.focus()},Fluxcon.prototype.log=function(){var t=[].slice.call(arguments);t.unshift(this.timestamp());var n=ConsoleView.log.apply(ConsoleView,t);return n.scrollIntoView(),n},module.exports=Fluxcon},{"../controller/ajax":4,"../controller/history":5,"../view/console":9,"../view/input":10}],8:[function(t,n,e){function o(t){var n=[];return JSON.stringify(t,function(t,e){if(null!=e&&"object"==typeof e){if(n.indexOf(e)>=0)return;n.push(e)}return e})}n.exports={dump:o}},{}],9:[function(t,n,e){var o=t("../class/view"),i=new o({el:"console",initialize:function(){},log:function(){var t=[].slice.call(arguments),n=document.createElement("div");for(var e in t){var o,i=t[e],r=document.createElement("span");switch(typeof i){case"object":Error.prototype.isPrototypeOf(i)&&(r.style.color="red");case"function":o=i.toString();break;case"number":r.style.color="darkorange",r.style.fontFamily="Courier New";case"string":o=i;break;case"undefined":o="'undefined'",r.style.color="brown";break;default:this.write("Warning: Unhandled type cast to string: ",typeof i),o=i.toString()}r.innerHTML=o,n.appendChild(r)}return this.el.appendChild(n),n}});n.exports=i},{"../class/view":2}],10:[function(t,n,e){var o=t("../class/view"),i=new o({el:"text",initialize:function(){var t=this;this.el.addEventListener("keydown",function(n){13===n.keyCode&&t.emit("input",t.el.value)})},clear:function(){this.el.value=""}});n.exports=i},{"../class/view":2}]},{},[6]);