if(typeof request=='undefined'){
	var request={};
}
Class({
	parent:tools.eventDispatcher,
	implements:[tools.browser],
	pack:request,
	name:'Ajax',
	constructor:function(url){
		this.url=url;
		this.Super();
		if(!this.requestObject){
			if((this.IEMask^this.IE9Id)&this.currentIEId){
				try{
					this.requestObject=new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(err){
					try{
						this.requestObject=new ActiveXObject("Msxml2.XMLHTTP");
					}
					catch(err){}
				}
			}
			else{
				try{
					this.requestObject=new XMLHttpRequest();
				}
				catch(err){
					try{
						this.requestObject=new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(err){
						try{
							this.requestObject=new ActiveXObject("Msxml2.XMLHTTP");
						}
						catch(err){}
					}
				}
			}
		}
	},
	public:{
		user:'',
		password:'',
		method:'POST',
		contentType:'application/x-www-form-urlencoded',
		url:'',
		async:true,
		run:false,
		headers:{
			'Content-Type':'application/x-www-form-urlencoded',
			'X-Requested-With':'XMLHttpRequest'
		},
		accepts:{
			xml:'application/xml, text/xml',
			html:'text/html',
			text:'text/plain',
			json:'application/json, text/javascript',
			all:'*/*'
		},
		acceptDefault:'~this.accepts.all~',
		connect:true,
		abort:function(){
			this.requestObject.abort();
		},
		send:function(param,callback,error,thisObject){
			this.funcList=[];
			this.thisObject=typeof thisObject=='object'?thisObject:null;
			this.run=this.requestObject.readyState!=0 && this.requestObject.readyState!=4;
			if(this.run){
				this.queue.push([param,callback,error,thisObject]);
				return;
			}
			if(this.requestObject) with(this){
				(user && password)?
					requestObject.open(method,url,async,user,password):
					requestObject.open(method,url,async);
				for(key in headers) requestObject.setRequestHeader(key,headers[key]);
				requestObject.setRequestHeader('Accept',acceptDefault);
				requestObject.onreadystatechange=readystate;
				try{
					if(typeof callback=='function') funcList[0]=callback;
					if(typeof error=='function') funcList[1]=error;
					run=true;
					this.dispatch("start");
					requestObject.send(serialize(param));
				}
				catch(err){
					connect=false;
					if(console && console.log) console.log(err);
					if(this.funcList[1]) this.funcList[1]();
				}
			}
		},
		serialize:function(param,prefix){
			var param_str='';
			if(typeof param!='object' && !prefix){
				return param_str;
			}
			else{
				return this.serializeCreate(param,'');
			}
		}
	},
	protected:{
		eventList:['start','stop'],
		requestObject:false,
		funcList:[],
		jsonpObj:{id:0,prefix:'__JSONP__',documentElement:false,doc:false},
		thisObject:null,
		queue:[],
		headerType:{
			json:/application\/json|text\/javascript/i,
			text:/text: "text\/plain"/i,
			xml:/application\/xml|text\/xml/i,
			html:/text\/html/i,
			none:/application\/octet-stream/i
		},
		success:function(){
			try{
				var status=this.requestObject.status && ((this.requestObject.status>=200 && this.requestObject.status<300) || [0,304,1223].indexOf(this.requestObject.status)>-1);
			}
			catch(error){
				status=true;
			}
			return ((this.async && this.requestObject.readyState==4 && status) || (!this.async && status));
		},
		readystate:function(){
			if(this.success()){
				if(this.funcList[0]){
					header:for(var key in this.headerType){
						if(this.requestObject.getResponseHeader('Content-Type').match(this.headerType[key])){
							switch(key){
								case 'json': this.thisObject?this.funcList[0].call(this.thisObject,eval(this.requestObject.responseText)):this.funcList[0](eval(this.requestObject.responseText));
								break header;
								case 'text': break header;
								case 'xml': break header;
								case 'html': break header;
								case 'none': this.thisObject?this.funcList[0].call(this.thisObject,this.requestObject.responseText):this.funcList[0](this.requestObject.responseText);
								break header;
							}
							break;
						}
					}
				}
				this.run=false;
				if(this.queue[0]) setTimeout(this.queueShift,100);
				this.dispatch("stop");
			}
		},
		queueShift:function(){
			this.send.apply(this,this.queue[0]);
			this.queue.shift();
		},
		serializeCreate:function(param,prefix){
			var param_str='';
			for(key in param){
				if(param_str){
					param_str+='&';
				}
				switch(typeof param[key]){
					case 'number': case 'string':{
						param_str+=encodeURIComponent(prefix?prefix+'['+key+']':key)+'='+encodeURIComponent(param[key]);
					}
					break;
					case 'boolean':{
						param_str+=encodeURIComponent(prefix?prefix+'['+key+']':key)+'='+encodeURIComponent(param[key]?'1':'0');
					}
					break;
					case 'object':{
						if(param[key] instanceof Array){
							for(var i=0;i<param[key].length;i++){
								param_str+=(i==0?'':'&')+encodeURIComponent(prefix?prefix+'['+key+']'+'[]':key+'[]')+'='+encodeURIComponent(param[key][i]);
							}
						}
						else if(param[key] instanceof Object){
							param_str+=this.serializeCreate(param[key],key);
						}
					}
					break;
					case 'undefined': break;
					default:
				}
			}
			return param_str;
		}
	}
});
Class({
	parent:request.Ajax,
	pack:request,
	name:'SimpleDriver',
	constructor:function(url){
		this.url=url;
		this.Super(this.url);
		this.timer.bind('timer',this.tail);
	},
	public:{
		url:'',
		time:1,
		param:{},
		response:{},
		connect:function(param){
			if(typeof param=='object'){
				this.param=param;
				this.timer.start();
				try{
					this.send(this.param,this.reply,this.error);
				}
				catch(error){
					this.dispatch("error",error);
				}
			}
		}
	},
	protected:{
		timer:'~new tools.Timer(this.time*500)~',
		eventList:['reply','error'],
		reply:function(r){
			if(r){
				this.response=r;
				if(!this.timer.running){
					this.timer.start();
				}
			}
		},
		tail:function(){
			this.dispatch("reply",this.response);
			this.timer.halt();
			try{
				this.send(this.param,this.reply,this.error);
			}
			catch(error){
				this.dispatch("error",error);
			}
		},
		error:function(){
			this.dispatch("error",error);
		}
	}
});
// Проект класса для вебсокетов
// Class({
// 	parent:tools.eventDispatcher,
// 	pack:request,
// 	name:'WebSocket',
// 	constructor:function(url){
// 		if(this.enable){
// 			this.url=url;
// 			this.copy=new WebSocket(this.url);
// 			this.enable=this.enable && this.copy;
// 		}
// 	},
// 	public:{
// 		url:'',
// 		copy:false,
// 		connect:function(){
// 			if(!this.enable) return;
// 			console.log(123)
// 			this.copy.onopen=function(){ console.log('open'); }
// 			this.copy.onclose=function(){ console.log('close'); }
// 			this.copy.onmessage=function(e){ console.log(e); }
// 		}
// 	},
// 	private:{
// 		enable:typeof WebSocket=="function"
// 	}
// });
Class({
	final:true,
	parent:tools.eventDispatcher,
	pack:request,
	name:'Socket',
	constructor:function(url){
		this.url=url;
		this.Super();
	},
	public:{
		url:'',
		driver:'~request.SimpleDriver~',
		addParam:function(name,param){
			this.copy.param[name]=param;
		},
		init:function(param){
			this.copy=new this.driver(this.url);
			this.copy.bind('reply',this.success);
			this.copy.bind('error',this.error);
			this.copy.time=this.timeCell;
			if(!param){
				param={};
			}
			if(this.copy){
				this.copy.connect(param);
			}
		}
	},
	protected:{
		eventList:['reply','error']
	},
	private:{
		copy:false,
		success:function(e,r){
			if(r){
				this.dispatch('reply',r);
			}
		},
		error:function(e,r){
			if(r){
				this.dispatch('error',r);
			}
		}
	}
});