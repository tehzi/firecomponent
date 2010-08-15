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