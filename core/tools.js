/**
* @fileoverview
* Пакет содержит набор утилит разработаных для проекта firecomponent
* @author <a href="mailto:zi.white.drago@gmail.com">zi white</a>
* @version 0.1.25
*/
if(!tools) var tools={};
Class({
	name:"Browser",
	type:"interface",
	pack:tools,
	public:{
		browser:(function(){
			var name="Another";
			var agent=navigator.userAgent.toLowerCase();
			if(agent.search("firefox")>-1) name="Firefox";
			if(agent.search("opera")>-1)   name="Opera";
			if(agent.search("safari")>-1)  name="Safari";
			if(agent.search("chrome")>-1)  name="Chrome";
			if(agent.search("msie")>-1)    name="Internet Explorer";
			return name;
		})(),
		Opera:"~this.browser=='Opera'~",
		Firefox:"~this.browser=='Firefox'~",
		Chrome:"~this.browser=='Chrome'~",
		Safari:"~this.browser=='Safari'~",
		IE:"~this.browser=='Internet Explorer'~",
		IE6:"~this.IE && this.intertrigoBrowserVersion()==6~",
		IE7:"~this.IE && this.intertrigoBrowserVersion()==7~",
		IE8:"~this.IE && this.intertrigoBrowserVersion()==8~",
		IE9:"~this.IE && this.intertrigoBrowserVersion()==9~",
		version:"~this.intertrigoBrowserVersion()~",
		IEMask:"~this.IEMaskArray.fullMask()~",
		IE6Id:"~this.IEMaskArray[0]~",
		IE7Id:"~this.IEMaskArray[1]~",
		IE8Id:"~this.IEMaskArray[2]~",
		IE9Id:"~this.IEMaskArray[3]~",
		currentIEId:"~this.detectIEId()~",
		browser_engine:"~this.detectBrowserEngine()~",
		gecko:"~this.detectBrowserEngine()=='gecko'~",
		presto:"~this.detectBrowserEngine()=='presto'~",
		webkit:"~this.detectBrowserEngine()=='webkit'~",
		khtml:"~this.detectBrowserEngine()=='khtml'~",
		trident:"~this.detectBrowserEngine()=='trident'~"
	},
	protected:{
		IEMaskArray:[0x00000001,0x00000002,0x00000004,0x00000008],
		intertrigoBrowserVersion:function(){
			var version="None";
			var agent=navigator.userAgent.toLowerCase();
			if(this.IE) var version_detect=agent.match(/msie ([0-9]+\.[0-9]+)/i);
			if(this.Opera) var version_detect=window.opera.version();
			if(this.Firefox){
				var version_detect=agent.match(/firefox\/([0-9]+\.[0-9]+\.[0-9]+)/i);
				if(!version_detect) var version_detect=agent.match(/firefox\/([0-9]+\.[0-9]+)/i);
			}
			if(this.Chrome) var version_detect=agent.match(/chrome\/([0-9]+\.[0-9]+)/i);
			if(this.Safari) var version_detect=agent.match(/version\/([0-9]+\.[0-9]+)/i);
			if(version_detect) version=(version_detect[1] && typeof version_detect=="object")?version_detect[1].replace(/^([0-9]+\.[0-9]+)\.([0-9]+)/,"$100$2"):version_detect;
			return parseFloat(version);
		},
		detectIEId:function(){
			if(this.IE){
				if(this.IE9) return this.IEMaskArray[3];
				if(this.IE8) return this.IEMaskArray[2];
				if(this.IE7) return this.IEMaskArray[1];
				if(this.IE6) return this.IEMaskArray[0];
			}
			return 0;
		},
		detectBrowserEngine:function(){
			var detect='none';
			if(detecting=navigator.userAgent.match(/(gecko|presto|webkit|khtml|trident)/i)) detect=detecting[0].toLowerCase();
			return detect;
		}
	}
});
Class({
	pack:tools,
	name:"eventDispatcher",
	constructor:function(){
		this.eventAll={};
		for(var i=0;i<this.eventList.length;i++) this.eventAll[this.eventList[i]]=[];
	},
	public:{
		bind:function(_event,_function){
			if(typeof _event=="string" && typeof _function=="function"){
				if(this.eventAll[_event]){
					this.eventAll[_event].push(_function);
					$(this).bind(_event,_function);
				}
			}
		},
		unbind:function(_event,_function){
			if(typeof _event=="string" && typeof _function=="function"){
				if(this.eventAll[_event]){
					this.eventAll[_event]=$.grep(this.eventAll[_event],function(key,i){ return key!==_function; });
					$(this).unbind(_event,_function);
				}
				return;
			}
			if(typeof _event=="string" && arguments.length==1) $(this).unbind(_event);
		}
	},
	protected:{
		eventList:[],
		eventAll:{},
		dispatch:function(_event,_arr){
			var __arr=[];
			if(typeof _arr=="object") __arr=_arr;
			if(typeof _event=="string" && this.eventAll[_event]) $(this).trigger(_event,__arr);
		}
	}
});
Class({
	pack:tools,
	parent:tools.eventDispatcher,
	name:"Timer",
	constructor:function(delay,repeatCount){
		this.Super();
		if(typeof delay=="number") this.delay=delay;
		if(typeof repeatCount=="number") this.repeatCount=repeatCount;
	},
	public:{
		currentCount:0,
		delay:0,
		repeatCount:0,
		running:false,
		start:function(){
			if(this.delay>0){
				this.currentCount=0;
				this.running=true;
				this.timeLink=setInterval(this.timeExec,this.delay);
			}
		},
		stop:function(){
			this.running=false;
			clearInterval(this.timeLink);
		}
	},
	protected:{
		eventList:["timer","timerComplete"]
	},
	private:{
		timeLink:null,
		timeExec:function(){
			this.dispatch("timer",[++this.currentCount]);
			if(this.repeatCount>0 && this.currentCount==this.repeatCount){
				this.dispatch("timerComplete",[this.currentCount]);
				this.stop();
			}
		}
	}
});
Class({
	name:"CookieManager",
	pack:tools,
	parent:tools.eventDispatcher,
	final:true,
	constructor:function(){
		if(this.cookieEnabled){
			this.Super();
			this.oldCookieString=document.cookie;
			this.timer.bind("timer",this.cookieEvent);
			this.timer.start();
			this.lsCreate();
		}
	},
	public:{
		ls:{},
		defaultTime:"Mon, 01-Jan-2020 00:00:00 GMT",
		defaultPath:"/",
		rm:"~this._remove~",
		val:function(name,val){
			if(arguments.length==1) return (this.ls[name])?this.ls[name]:null;
			if(arguments.length==2){
				this._add(name,val);
				return null;
			}
		}
	},
	get:{
		add:function(key){
			return this._add;
		},
		remove:function(key){
			return this._remove;
		},
		cookieEnabled:function(){
			return window.navigator.cookieEnabled;
		}
	},
	set:{
		add:function(key,val){
			if(this.cookieEnabled){
				if(typeof val.name=="string" && (typeof val=="string" || typeof val=="number") && this.cookieEnabled) this._add(val.name,val.val);
				if(typeof val=="object"){
					if(val.name && val.val){
						if(typeof val.name=="string" && (typeof val.val=="string" || typeof val.val=="number") && this.cookieEnabled){
							this._add(val.name,val);
						}
					}
				}
			}
		},
		remove:function(key,val){
			if(this.cookieEnabled) this._remove(val);
		},
		cookieEnabled:function(){}
	},
	protected:{
		eventList:["change","add","remove"]
	},
	private:{
		oldCookieString:"",
		timer:new tools.Timer(1000),
		cookieEvent:function(e){
			if(this.oldCookieString!=document.cookie){
				this.dispatch("change",[document.cookie,this.oldCookieString]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		_add:function(name,val){
			if(typeof name=="string" && (typeof val=="string" || typeof val=="number") && this.cookieEnabled){
				document.cookie=escape(name)+"="+escape(val)+"; expires="+this.defaultTime+"; path="+this.defaultPath+";";
				this.dispatch("add",[name,val]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
			if(typeof name=="string" && typeof val=="object"){
				var date=val.date ? this.parseTime(val.date) : "";
				var path=val.path ? val.path : this.defaultPath;
				var domain=val.domain ? val.domain : false;
				var secure=secure ? true : false;
				if(typeof name=="string" && (typeof val.val=="string" || typeof val.val=="number") && this.cookieEnabled){
					document.cookie=
						escape(name)+"="+escape(val.val) +
						"; path="+path +
						"; expires="+date +
						((!!domain) ? "; domain="+domain: "") +
						((!!secure) ? "; secure" : "")
				}
				this.dispatch("add",[name,val]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		_remove:function(name){
			if(typeof name=="string"){
				var expireAt = new Date(1970,1);
				document.cookie=unescape(name)+ "= 0;  path=/;  expires="+expireAt.toGMTString();
				this.dispatch("remove",[name]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		lsCreate:function(){
			var ls=this.oldCookieString.match(/([^;]+);?/gi);
			ls=!!ls ? ls : [];
			var space;
			var key;
			var val;
			for(var i=0;i<ls.length;i++){
				space=ls[i].substr(0,1);
				if(space==" "){
					key=ls[i].substr(1,ls[i].indexOf("=")-1);
					val=ls[i].substr(ls[i].indexOf("=")+1,ls[i].length);
					val=val.substr(val.length-1,val.length)==";" ? val.substr(0,val.length-1) : val;
				}
				else{
					key=ls[i].substr(0,ls[i].indexOf("="));
					val=ls[i].substr(ls[i].indexOf("=")+1,ls[i].length);
					val=val.substr(val.length-1,val.length)==";" ? val.substr(0,val.length-1) : val;
				}
				this.ls[unescape(key)]=unescape(val);
			}
		},
		parseTime:function(time){
			if(typeof time=="string"){
				var options=time.match(/\+[0-9]+(?:m|h|d|w|M|Y)/g);
				var m=60000;
				var h=m*60;
				var d=h*24;
				var w=d*7;
				var todaySimp=new Date();
				var today={
					day:todaySimp.getDate(),
					month:todaySimp.getMonth()+1,
					year:todaySimp.getFullYear()
				};
				var endTime=0;
				for(var i=0;i<options.length;i++){
					var optArr=options[i].match(/\+([0-9]+)(m|h|d|w|M|Y)/);
					if(optArr[1] && optArr[2]){
						var currentTimeInt=parseInt(optArr[1]);
						switch(optArr[2]){
							case "m": endTime+=currentTimeInt*m; break;
							case "h": endTime+=currentTimeInt*h; break;
							case "d": endTime+=currentTimeInt*d; break;
							case "w": endTime+=currentTimeInt*w; break;
							case "M":
								for(var j=0;j<currentTimeInt;j++){
									var deltaDate=new Date(today.year,today.month+j);
									var maxDay=Date.prototype.lastMonthDay(deltaDate.getMonth()+1,deltaDate.getFullYear());
									endTime+=d*maxDay;
								}
							break;
							case "Y": for(var j=1;j<=currentTimeInt;j++) endTime+=d*Date.prototype.lastYearDay(today.year+j);
							break;
							default:
						}
					}
				}
				var Time=new Date(new Date().getTime()+endTime);
				return Time.toGMTString();
			}
		}
	}
});
Class({
	name:"Url",
	pack:tools,
	parent:tools.eventDispatcher,
	final:true,
	constructor:function(url){
		this.Super();
		this._url=url || location.href;
		this.parseUrl();
		this.timer.bind("timer",this.hashEvent);
		this.timer.start();
	},
	public:{
		go:function(){
			if(this._url) location.href=this._url;
		}
	},
	get:{
		scheme:function(key){
			return this._scheme;
		},
		user:function(key){
			return this._user;
		},
		password:function(key){
			return this._password;
		},
		host:function(key){
			return this._host;
		},
		port:function(key){
			return this._port;
		},
		directory:function(key){
			return this._directory;
		},
		file:function(key){
			return this._file;
		},
		query:function(key){
			return this._query;
		},
		hash:function(key){
			return this._hash;
		},
		url:function(key){
			return this._url;
		}
	},
	set:{
		scheme:function(key,val){
			val=val.toLowerCase();
			if(val.match(/[a-z]+/)){
				this._scheme=val;
				this.urlReload();
			}
		},
		user:function(key,val){
			if(val.match(/[^:@\/]+/i)){
				this._user=val;
				this.urlReload();
			}
		},
		password:function(key,val){
			if(val.match(/[^:@\/]+/i)){
				this._password=val;
				this.urlReload();
			}
		},
		host:function(key,val){
			val=val.toLowerCase();
			if(val.match(/[^:\/?#]+/i)){
				this._host=val;
				this.urlReload();
			}
		},
		port:function(key,val){
			if(val.match(/[0-9]+/i)){
				this._port=val;
				this.urlReload();
			}
		},
		directory:function(key,val){
			if(val.match(/\.\.?$|(?:[^?#\/]*\/)*/i)){
				this._directory=val;
				this.urlReload();
			}
		},
		dir:function(key,val){
			if(val.match(/\.\.?$|(?:[^?#\/]*\/)*/i)){
				this._directory=val;
				this.urlReload();
			}
		},
		file:function(key,val){
			if(val.match(/[^?#\/]+/i)){
				this._file=val;
				this.urlReload();
			}
		},
		query:function(key,val){
			if(val.match(/^[^#\/]+=[^#\/]*$/i)){
				this._query=val;
				this.urlReload();
			}
		},
		hash:function(key,val){
			this._hash=val;
			this.urlReload();
		},
		url:function(key,val){
			if(val.match(/^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/)){
				this._url=val;
				this.parseUrl();
			}
		}
	},
	protected:{
		eventList:["hash"]
	},
	private:{
		timer:new tools.Timer(1000),
		hashEvent:function(e){
			if(this.stdHash!=location.hash){
				this.dispatch("hash",[this.stdHash,location.hash]);
				this.stdHash=location.hash;
			}
		},
		_scheme:"",
		_user:"",
		_password:"",
		_host:"",
		_port:"",
		_directory:"",
		_file:"",
		_query:"",
		_hash:"",
		_url:"",
		stdHash:location.hash,
		parseUrl:function(){
			if(this._url){
				var regexp=/^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
				var parseUrl=this._url.match(regexp);
				this._scheme=parseUrl[1] || "";
				this._user=parseUrl[2] || "";
				this._password=parseUrl[3] || "";
				this._host=parseUrl[4] || "";
				this._port=parseUrl[5] || "";
				this._directory=parseUrl[6] || "";
				this._file=parseUrl[7] || "";
				this._query=parseUrl[8] || "";
				this._hash=parseUrl[9] || "";
			}
		},
		urlReload:function(){
			this._url=this._scheme+"://"+(!!this._user && !!this._password ? this._user+":"+this._password+"@" : "")+this._host+this._directory+this._file+(!!this._query ? "?"+this._query : "")+(this._hash ? "#"+this._hash : "");
		}
	}
});
Class({
	name:"Platform",
	type:"interface",
	pack:tools,
	public:{
		name:(function(){
			var name=navigator.platform.match(/(Linux|FreeBSD|Mac|Win|SunOS)/i);
			return (name && name[1])?name[1]:(window.orientation!=undefined)?"iPod":"Other";
		})(),
		linux:(navigator.platform.indexOf("Linux")!=-1),
		freebsd:(navigator.platform.indexOf("FreeBSD")!=-1),
		mac: (navigator.platform.indexOf("Mac")!=-1),
		windows:(navigator.platform.indexOf("Win")!=-1),
		ipad:(window.orientation!=undefined),
		other:"~!(this.linux || this.freebsd || this.mac || this.windows || this.ipod || this.sun)~",
		sun:(navigator.platform.indexOf("SunOS")!=-1),
		arch:(function(){
			switch(true){
				case !!(navigator.platform.match(/32|i586/i)): return "i586"; break;
				case !!(navigator.platform.match(/64/i)): return "x86_64"; break;
				default: return "Other";
			}
		})()
	}
});
Class({
	name:"Flash",
	type:"interface",
	pack:tools,
	public:{
		enable:(function(){
			try{
				return (tools.Browser.IE && new ActiveXObject('ShockwaveFlash.ShockwaveFlash'))?true:!!(navigator.plugins['Shockwave Flash']);
			}
			catch(err){
				return false;
			}
		})(),
		version:"~this._version()~"
	},
	protected:{
		_version:function(){
			if(this.enable){
				if(tools.Browser.IE){
					var ActiveX=new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').match(/\d+/g);
					return (ActiveX[0] && ActiveX[1])?parseFloat(ActiveX[0]+"."+ActiveX[1]):ActiveX[0];
				}
				else{
					var StdX=navigator.plugins['Shockwave Flash'].description.match(/\d+/g);
					return (StdX[0] && StdX[1])?parseFloat(StdX[0]+"."+StdX[1]):StdX[0];
				}
			}
			else{
				return 0;
			}
		}
	}
});