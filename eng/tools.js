if(!Date.prototype.lastMonthDay){
	Date.prototype.lastMonthDay=function(month, year){
		var d=new Date(year ? year : this.getFullYear(), month ? month  : this.getMonth() + 1, 0);
		return d.getDate();
	};
}
if(!Date.prototype.lastYearDay){
	Date.prototype.lastYearDay=function(year){
		return new Date().lastMonthDay(2,year)==28 ? 365 : 366;
	};
}
var tools={};
Class({
	name:"browser",
	type:"interface",
	pack:tools,
	constructor:function(){},
	public:{
		browser:(function(){
			var name="Another";
			var agent=navigator.userAgent.toLowerCase();
			if(agent.search("firefox")>-1){
				name="Firefox";
			}
			if(agent.search("opera")>-1){
				name="Opera";
			}
			if(agent.search("safari")>-1){
				name="Safari";
			}
			if(agent.search("chrome")>-1){
				name="Chrome";
			}
			if(agent.search("msie")>-1){
				name="Internet Explorer";
			}
			return name;
		})(),
		IE:"~this.browser=='Internet Explorer'~",
		IE6:"~this.IE && this.intertrigoBrowserVersion()=='6.0'~",
		IE7:"~this.IE && this.intertrigoBrowserVersion()=='7.0'~",
		IE8:"~this.IE && this.intertrigoBrowserVersion()=='8.0'~",
		Opera:"~this.browser=='Opera'~",
		Firefox:"~this.browser=='Firefox'~",
		Chrome:"~this.browser=='Chrome'~",
		Safari:"~this.browser=='Safari'~",
		browserVersion:"~this.intertrigoBrowserVersion()~"
	},
	protected:{
		intertrigoBrowserVersion:function(){
			var version="None";
			var agent=navigator.userAgent.toLowerCase();
			version=agent
			if(this.IE){
				var version_detect=agent.match(/msie ([0-9]+\.[0-9]+)/i);
			}
			if(this.Opera){
				var version_detect=agent.match(/opera\/([0-9]+\.[0-9]+)/i);
			}
			if(this.Firefox){
				var version_detect=agent.match(/firefox\/([0-9]+\.[0-9]+\.[0-9]+)/i);
			}
			if(this.Chrome){
				var version_detect=agent.match(/chrome\/([0-9]+\.[0-9]+)/i);
			}
			if(this.Safari){
				var version_detect=agent.match(/version\/([0-9]+\.[0-9]+)/i);
			}
			if(version_detect){
				if(version_detect[1]){
					version=version_detect[1];
				}
			}
			return version;
		}
	}
});
Class({
	pack:tools,
	name:"eventDispatcher",
	constructor:function(){
		this.eventAll={};
		for(var i=0;i<this.eventList.length;i++){
			this.eventAll[this.eventList[i]]=[];
		}
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
					this.eventAll[_event]=$.grep(this.eventAll[_event],function(key,i){
 						return key!==_function;
					});
					$(this).unbind(_event,_function);
				}
			}
		}
	},
	protected:{
		eventList:[],
		eventAll:{},
		dispatch:function(_event,_arr){
			var __arr=[];
			if(typeof _arr=="object"){
				__arr=_arr;
			}
			if(typeof _event=="string"){
				if(this.eventAll[_event]){
					$(this).trigger(_event,__arr);
				}
			}
		}
	}
});
Class({
	pack:tools,
	parent:tools.eventDispatcher,
	name:"Timer",
	constructor:function(delay,repeatCount){
		this.Super();
		if(typeof delay=="number"){
			this.delay=delay;
		}
		if(typeof repeatCount=="number"){
			this.repeatCount=repeatCount;
		}
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
		halt:function(){
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
				this.halt();
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
			if(arguments.length==1){
				if(this.ls[name]){
					return this.ls[name];
				}
				else{
					return null;
				}
			}
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
				if(typeof val.name=="string" && (typeof val=="string" || typeof val=="number") && this.cookieEnabled){
					this._add(val.name,val.val);
				}
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
			if(this.cookieEnabled){
				this._remove(val);
			}
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
							case "m":{
								endTime+=currentTimeInt*m;
							}
							break;
							case "h":{
								endTime+=currentTimeInt*h;
							}
							break;
							case "d":{
								endTime+=currentTimeInt*d;
							}
							break;
							case "w":{
								endTime+=currentTimeInt*w;
							}
							break;
							case "M":{
								for(var j=0;j<currentTimeInt;j++){
									var deltaDate=new Date(today.year,today.month+j);
									var maxDay=Date.prototype.lastMonthDay(deltaDate.getMonth()+1,deltaDate.getFullYear());
									endTime+=d*maxDay;
								}
							}
							break;
							case "Y":{
								for(var j=1;j<=currentTimeInt;j++){
									endTime+=d*Date.prototype.lastYearDay(today.year+j);
								}
							}
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