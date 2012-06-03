/**
* @fileoverview
* Package OOP utilites for javascript.
* In programm used dojo hack  <a href="http://alex.dojotoolkit.org/08/jscript/lettable.html">dojo</a>.
* Testing in ie6+, opera 9.5+, google chrome, safari, android browser, firefox 3+ and some khtml and webkit browser.
* @author <a href="mailto:zi.white.drago@gmail.com">zi white</a>
* @version 0.2.0
*/
var fire=function(){};
(function(){
	if(!Array.prototype.forEach) Array.prototype.forEach=function(callback,thisObject){ for(var i=0;i<this.length && typeof callback=='function';i++) if(callback.call(typeof thisObject=='object'?thisObject:window,this[i],i,this)); };
	if(!Array.prototype.every) Array.prototype.every=function(callback,thisObject){ var passed=true; try{ this.forEach(function(elem,i,arr){ passed=!!callback.call(typeof thisObject=='object'?thisObject:window,elem,i,arr); if(!passed) throw true; },thisObject); } catch(err){}; return everyReturn; };
	if(!Array.prototype.filter) Array.prototype.filter=function(callback,thisObject){ var filtered=[]; this.forEach(function(elem,i,arr){ if(callback.call(typeof thisObject=='object'?thisObject:window,elem,i,arr)) filtered.push(elem); },thisObject); return filtered; };
	if(!Array.prototype.indexOf) Array.prototype.indexOf=function(elemToSearch,fromIndex){ for(fromIndex=(fromIndex?fromIndex<0?Math.max(0,this.length+fromIndex):fromIndex:0);fromIndex<this.length;fromIndex++) if(fromIndex in this && this[fromIndex]===elemToSearch) return fromIndex; return -1; };
	if(!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf=function(elemToSearch,fromIndex){ var arr=this.slice.apply(this,(fromIndex!==undefined && fromIndex>0)?[0,fromIndex+1]:[0]); for(var i=arr.length-1;i>-1;i--) if(arr[i]===elemToSearch) return i; };
	if(!Array.prototype.map) Array.prototype.map=function(callback,thisObject){ var passed=[]; this.forEach(function(elem,i,arr){ passed.push(callback.call(typeof thisObject=='object'?thisObject:window,elem,i,arr)); },thisObject); return passed; };
	if(!Array.prototype.some) Array.prototype.some=function(callback,thisObject){ var passed=false; this.forEach(function(elem,i,arr){ if(callback.call(typeof thisObject=='object'?thisObject:window,elem,i,arr)) passed=true; },thisObject); return passed; };
	if(!Array.prototype.fullMask) Array.prototype.fullMask=function(){ var mask=0; this.forEach(function(elem){ mask|=elem; }); return elem; };
	if(!String.prototype.go) String.prototype.go=function(){ location.href=this; };
	if(!Date.prototype.lastMonthDay) Date.prototype.lastMonthDay=function(){ return new Date(this.getFullYear(),this.getMonth(),0).getDate(); };
	if(!Date.prototype.lastYearDay) Date.prototype.lastYearDay=function(){ return new Date(this.getFullYear(),2).lastMonthDay()==28?365:366; };
// 	var classAttractor={};
// 	classAttractor.final
// 	classAttractor.parent
// 	classAttractor.implements
// 	classAttractor.pack
// classAttractor.type
// 	classAttractor.clone
})();