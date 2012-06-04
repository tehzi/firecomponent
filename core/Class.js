/**
* @fileoverview
* Package OOP utilites for javascript.
* In programm used dojo hack  <a href="http://alex.dojotoolkit.org/08/jscript/lettable.html">dojo</a>.
* Testing in ie6+, opera 9.5+, google chrome, safari, android browser, firefox 3+ and some khtml and webkit browser.
* @author <a href="mailto:zi.white.drago@gmail.com">zi white</a>
* @version 0.1.24
*/
var Class;
function getClassName(Class){
	if(typeof Class=="function"){
		var name=new Class("@!!").typeString().match(/^\[(?:class|interface)\s([a-z0-9_]+)\]$/i);
		if(name[1]) return name[1];
	}
	if(typeof Class=="object" && Class.typeString){
		var name=Class.typeString().match(/^\[(?:class|interface)\s([a-z0-9_]+)\]$/i);
		if(name[1]) return name[1];
	}
}
(function(){
	if(!Array.prototype.forEach) Array.prototype.forEach=function(callback,thisObject){ for(var i=0;i<this.length && typeof callback=='function';i++) if(callback.call(typeof thisObject=='object'?thisObject:window,this[i],i,this)); };
	if(!Array.prototype.every) Array.prototype.every=function(callback,thisObject){ var passed=true; try{ this.forEach(function(elem,i,arr){ passed=!!callback.call(thisObject,elem,i,arr); if(!passed) throw true; },thisObject); } catch(err){}; return everyReturn; };
	if(!Array.prototype.filter) Array.prototype.filter=function(callback,thisObject){ var filtered=[]; [].forEach.call(this,function(elem,i,arr){ if(callback.call(thisObject,elem,i,arr)); filtered.push(elem); },thisObject); return filtered; };
	if(!Array.prototype.indexOf) Array.prototype.indexOf=function(elemToSearch,fromIndex){ for(fromIndex=(fromIndex?fromIndex<0?Math.max(0,this.length+fromIndex):fromIndex:0);fromIndex<this.length;fromIndex++) if(fromIndex in this && this[fromIndex]===elemToSearch) return fromIndex; return -1; };
	if(!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf=function(elemToSearch,fromIndex){ var arr=this.slice.apply(this,(fromIndex!==undefined && fromIndex>0)?[0,fromIndex+1]:[0]); for(var i=arr.length-1;i>-1;i--) if(arr[i]===elemToSearch) return i; };
	if(!Array.prototype.map) Array.prototype.map=function(callback,thisObject){ var passed=[]; [].forEach.call(this,function(elem,i,arr){ passed.push(callback.call(thisObject,elem,i,arr)); },thisObject); return passed; };
	if(!Array.prototype.some) Array.prototype.some=function(callback,thisObject){ var passed=false;[].forEach.call(this,function(elem,i,arr){ if(callback.call(thisObject,elem,i,arr)) passed=true; },thisObject); return passed; };
	if(!Array.prototype.fullMask) Array.prototype.fullMask=function(){ var mask=0; [].forEach.call(this,function(elem){ mask|=elem; }); return mask; };
	if(!String.prototype.go) String.prototype.go=function(){ location.href=this; };
	if(!Date.prototype.lastMonthDay) Date.prototype.lastMonthDay=function(){ return new Date(this.getFullYear(),this.getMonth(),0).getDate(); };
	if(!Date.prototype.lastYearDay) Date.prototype.lastYearDay=function(){ return new Date(this.getFullYear(),2).lastMonthDay()==28?365:366; };
	try{
		var __Class__={
			error:[],
			VBid:0
		};
		var ClassModel={
			IE:!!window.ActiveXObject,
			OTHER:	!!(Object.__defineSetter__ && Object.__defineGetter__)
		};
		if(ClassModel.IE){
			var ieFix={
				iframe:document.createElement("iframe"),
				code:"",
				evaluate:function(code, isObject){
					return this.iframe.contentWindow.evaluate(code, !!isObject);
				},
				execute:function(code){
					this.iframe.contentWindow.execute(code);
				},
				addProp:function(prop){
					this.code+="\tPublic ["+prop+"]\n";
				},
				addMethod:function(prop){
					this.code+="\tPublic ["+prop+"]\n";
				},
				addGet:function(prop){
					this.code+="\tPublic Property Get ["+prop+"]\n\
					\t\tDim proxy\n\
					\t\tSet proxy = new TypeProxy\n\
					\t\tproxy.load(get_"+prop+"(me))\n\
					\t\tIf IsObject(proxy.value) Then\n\
					\t\t\tSet ["+prop+"] = proxy.value\n\
					\t\tElse\n\
					\t\t\t"+prop+" = proxy.value\n\
					\t\tEnd If\n\
					\tEnd Property\n\
					\tPublic get_"+prop+"\n";
				},
				addSet:function(prop){
					this.code+="\tPublic Property Let ["+prop+"](val)\n\
					\t\tCall set_"+ prop +"(val)\n\
					\tEnd Property\n\
					\tPublic Property Set ["+prop+"](val)\n\
					\t\tCall set_"+prop+"(val)\n\
					\tEnd Property\n\
					\tPublic set_"+prop+"\n";
				},
				newVBClass:function(VBid){
					this.execute("Class Class_"+VBid+"\n"+this.code+"\nEnd Class\n");
					this.code="";
				},
				newIns:function(VBid){
					return this.evaluate("New Class_"+VBid,true);
				},
				addTypeProxy:function(){
					this.execute(
						"Class TypeProxy\n\
						\tPublic value\n\
						\tPublic Function load(val)\n\
						\t\tIf IsObject(val) Then\n\
						\t\t\tSet value = val\n\
						\t\tElse\n\
						\t\t\tvalue = val\n\
						\t\tEnd If\n\
						\tEnd Function\n\
						End Class\n"
					);
				}
			};
			$(ieFix.iframe).hide();
			$("head").append(ieFix.iframe);
			ieFix.iframe.contentWindow.document.write(
				"<html><head><title>VBiframe</title>\n\
				<script type='text/vbscript'>\n\
				Function execute(code)\nExecuteGlobal(code)\nEnd Function\n\
				Function evaluate(code,isObject)\nIf isObject Then\nSet evaluate = Eval(code)\n\
				Else\nevaluate = Eval(code)\nEnd If\nEnd Function\n\
				</script>\
				</head><body></body></html>"
			);
			ieFix.iframe.contentWindow.document.close();
			ieFix.addTypeProxy();
			try{
				ieFix.evaluate('true');
			}
			catch(err){
				throw({number:2,description:"Browser does not support vbscript"});
			}
		}
		else{
			var ieFix={};
		}
		Class=function(object){
			var final=false;
			var pack;
			var parent=false;
			var implements=[];
			var constructor;
			var public={};
			var protected={};
			var private={};
			var type="class";
			var get={};
			var set={};
			var name;
			var className;
			var parentObject;
			var childObject;
			var history=[[],[]];
			if(!ClassModel.IE && !ClassModel.OTHER){
				throw({number:2,description:" Browser does not support no one model of work"});
			}
			if(object.type=="class" || object.type=="interface"){
				type=object.type;
			}
			if(object.final && typeof object.final=="boolean"){
				final=object.final;
			}
			if(object.name && /[a-z0-9_]/i.test(object.name)){
				name=object.name;
			}
			else{
				throw({number:0,description:"No or wrong name of class"});
			}
			if(typeof object.parent=="function"){
				parent=object.parent;
			}
			if(!object.constructor || typeof object.constructor!="function"){
				throw({number:1,description:"No constructor"});
			}
			else{
				constructor=object.constructor;
			}
			if(typeof object.public=="object"){
				public=object.public;
			}
			if(typeof object.protected=="object"){
				protected=object.protected;
			}
			if(typeof object.private=="object"){
				private=object.private;
			}
			if(typeof object.get=="object"){
				get=object.get;
			}
			if(typeof object.set=="object"){
				set=object.set;
			}
			for(var i=0;typeof object.implements=="object" && i<object.implements.length;i++){
				if(typeof object.implements[i]=="object"){
					implements.push(object.implements[i]);
				}
			}
			if(typeof object.pack=="object"){
				pack=object.pack;
			}
			__Class__[name]={
				public:(function(public,implements,parent){
					var object={};
					var name;
					for(var key in public){
						object[key]=public[key];
					}
					if(parent){
						name=getClassName(parent);
						for(var key in __Class__[name].public){
							if(!object[key]){
								object[key]=__Class__[name].public[key];
							}
						}
					}
					if(implements.length>0){
						for(var i=0;i<implements.length;i++){
							for(var key in implements[i].public){
								if(!object[key]){
									object[key]=implements[i].public[key];
								}
							}
						}
					}
					return object;
				})(public,implements,parent),
				protected:(function(protected,implements,parent){
					var object={};
					var name;
					for(var key in protected){
						object[key]=protected[key];
					}
					if(parent){
						name=getClassName(parent);
						for(var key in __Class__[name].protected){
							if(!object[key]){
								object[key]=__Class__[name].protected[key];
							}
						}
					}
					if(implements.length>0){
						for(var i=0;i<implements.length;i++){
							for(var key in implements[i].protected){
								if(!object[key]){
									object[key]=implements[i].protected[key];
								}
							}
						}
					}
					return object;
				})(protected,implements,parent),
				private:private,
				get:get,
				set:set,
				type:type,
				final:final,
				parent:parent,
				implements:implements,
				name:name,
				pack:pack,
				constructor:constructor,
				VBid: ++__Class__.VBid
			};
			if(parent){
				className=getClassName(parent);
				parentObject=__Class__[className];
				implementsLoop:for(var i=0;i<parentObject.implements.length;i++){
					for(var i1=0;i1<implements.length;i1++){
						if(parentObject.implements[i]===implements[i1]){
							continue implementsLoop;
						}
					}
					implements.push(parentObject.implements[i]);
				}
			}
			if(ClassModel.IE){
				ieFix.addMethod("typeString");
				ieFix.addMethod("getClone");
				childObject=__Class__[name];
				if(parent){
					className=getClassName(parent);
					parentObject=__Class__[className];
					if(parentObject && !parentObject.final){
						for(var key in parentObject.public){
							if(!(public[key] || private[key] || protected[key]) && $.inArray(key,history[0])==-1){
								history[0].push(key);
								if(typeof parentObject.public[key]=="function"){
									ieFix.addMethod(key);
								}
								else{
									ieFix.addGet(key);
									ieFix.addSet(key);
								}
							}
						}
					}
				}
				for(var i=0;i<implements.length;i++){
					className=getClassName(implements[i]);
					if(__Class__[className]){
						parentObject=__Class__[className];
						if(parentObject.public){
							for(var key in parentObject.public){
								if(!(public[key] || private[key] || protected[key]) && $.inArray(key,history[0])==-1){
									history[0].push(key);
									if(typeof parentObject.public[key]=="function"){
										ieFix.addMethod(key);
									}
									else{
										ieFix.addGet(key);
										ieFix.addSet(key);
									}
								}
							}
						}
					}
				}
				for(var key in public){
					if(typeof public[key]=="function" && $.inArray(key,history[0])==-1){
						ieFix.addMethod(key);
					}
					else if($.inArray(key,history[0])==-1){
						ieFix.addGet(key);
						ieFix.addSet(key);
					}
				}
				for(var key in get){
					if($.inArray(key,history[0])==-1){
						ieFix.addGet(key);
					}
				}
				for(var key in set){
					if($.inArray(key,history[0])==-1){
						ieFix.addSet(key);
					}
				}
				ieFix.newVBClass(__Class__[name].VBid);
			}
			var abstract;
			if(type=="class"){
				abstract=function(){
					history=[[],[]];
					var instance={public:{}};
					var getClone=(function(){
						return function(){
							var name=getClassName(this);
							if(arguments[0]){
								var cloneFrom=arguments[0];
								for(key in cloneFrom){
									if(typeof cloneFrom[key]!="function"){
										this[key]=cloneFrom[key];
									}
								}
								return false;
							}
							else{
								var cloneClassInfo=__Class__[name];
								var cloneClass=!cloneClassInfo.pack ? eval("new "+name+"('@!!')") : new cloneClassInfo.pack[className]("@!!");
								cloneClass.getClone(this);
								return cloneClass;
							}
						}
					}).call(instance);
					childObject=__Class__[name];
					if(ClassModel.IE){
						instance.public=ieFix.newIns(__Class__[name].VBid);
						instance.public["typeString"]=function(){ return "[class "+name+"]"; }
						instance.public["getClone"]=getClone;
					}
					if(ClassModel.OTHER){
						instance.public={};
						instance.public["typeString"]=function(){ return "[class "+name+"]"; }
						instance.public["getClone"]=getClone;
					}
					if(parent){
						className=getClassName(parent);
						parentObject=__Class__[className];
						if(!parentObject.final){
							instance.parent={};
							for(var key in parentObject.protected){
								if(typeof parentObject.protected[key]=="function"){
									(function(key,parentObject,instance){
										instance.parent[key]=function(){
											return parentObject.protected[key].apply(instance,arguments);
										}
									})(key,parentObject,instance);
								}
								else{
									if(parentObject.protected[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(parentObject.protected[key].constructor)>-1){
										var copy=function(){}
										copy.prototype=parentObject.protected[key];
										instance.parent[key]=(parentObject.protected[key] instanceof Array)?parentObject.protected[key].slice(0):ClassModel.IE?parentObject.protected[key]:new copy();
									}
									else{
										instance.parent[key]=parentObject.protected[key];
									}
								}
							}
							for(var key in parentObject.public){
								if(typeof parentObject.public[key]=="function"){
									(function(key,parentObject,instance){
										instance.parent[key]=function(){
											return parentObject.public[key].apply(instance,arguments);
										}
									})(key,parentObject,instance);
								}
								else{
									if(parentObject.public[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(parentObject.public[key].constructor)>-1){
										var copy=function(){}
										copy.prototype=parentObject.public[key];
										instance.parent[key]=(parentObject.public[key] instanceof Array)?parentObject.public[key].slice(0):ClassModel.IE?parentObject.public[key]:new copy();
									}
									else{
										instance.parent[key]=parentObject.public[key];
									}
								}
							}
							(function(parentObject,instance,parentClassName,name){
								var i=0;
								var rName=name;
								var method;
								instance.Super=function(){
									i++;
									rName=name;
									if(i<2 || !instance.Super.prototype.times){
										parentObject.constructor.apply(instance,arguments);
									}
									else{
										for(var S=1;S<=i;S++){
											if(getClassName(__Class__[rName].parent)){
												rName=getClassName(__Class__[rName].parent);
											}
											else{
												break;
											}
											if(S==i){
												__Class__[rName].constructor.apply(instance,arguments);
											}
										}
									}
								}
								instance.Super.prototype.times=true;
							})(parentObject,instance,className,name);
							if(parentObject){
								if(parentObject.protected){
									for(var key in parentObject.protected){
										if(!(public[key] || private[key] || protected[key]) && $.inArray(key,history[1])==-1){
											history[1].push(key);
											(function(instance,key,parentObject){
												if(typeof parentObject.protected[key]=="function"){
													instance[key]=function(){
														return parentObject.protected[key].apply(instance,arguments);
													}
												}
												else{
													if(parentObject.protected[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(parentObject.protected[key].constructor)>-1){
														var copy=function(){}
														copy.prototype=parentObject.protected[key];
														instance[key]=(parentObject.protected[key] instanceof Array)?parentObject.protected[key].slice(0):ClassModel.IE?parentObject.protected[key]:new copy();
													}
													else{
														instance[key]=parentObject.protected[key];
													}
												}
											})(instance,key,parentObject);
										}
									}
								}
								if(parentObject.public){
									for(var key in parentObject.public){
										if(!(public[key] || private[key] || protected[key]) && $.inArray(key,history[1])==-1){
											history[1].push(key);
											if(typeof parentObject.public[key]=="function"){
												var method=parentObject.public[key];
												(function(method,instance,key){
													instance[key]=function(){
														return method.apply(instance,arguments);
													}
													if(ClassModel.OTHER){
														instance.public[key]=function(){
															return method.apply(instance,arguments);
														}
													}
													if(ClassModel.IE){
														instance.public[key]=function(){
															return method.apply(instance,arguments);
														}
													}
												})(method,instance,key);
											}
											else{
												instance[key]=parentObject.public[key];
												if(ClassModel.OTHER){
													(function(public,key,instance,name){
														public.__defineGetter__(key,function(prop){
															return instance[key];
														});
													})(public,key,instance,name);
													(function(public,key,instance,name){
														public.__defineSetter__(key,function(val){
															if(typeof val=='object'){
																var copy=function(){}
																copy.prototype=val;
																instance[key]=(val instanceof Array)?val.slice(0):ClassModel.IE?val:new copy();
															}
															else{
																instance[key]=val;
															}
														});
													})(instance.public,key,instance,name);
												}
												if(ClassModel.IE){
													(function(public,key,instance,name){
														public["get_"+key]=function(){
															return instance[key];
														}
													})(instance.public,key,instance,name);
													(function(public,key,instance,name){
														public["set_"+key]=function(val){
															if(typeof val=='object'){
																var copy=function(){}
																copy.prototype=val;
																instance[key]=(val instanceof Array)?val.slice(0):ClassModel.IE?val:new copy();
															}
															else{
																instance[key]=val;
															}
														}
													})(instance.public,key,instance,name);
												}
											}
										}
									}
								}
							}
						}
						instance.parents={};
						do{
							var granny_name=granny_name?getClassName(__Class__[granny_name].parent):className;
							var granny=__Class__[granny_name];
							instance.parents[granny_name]={};
							for(var key in granny.protected){
								if(typeof granny.protected[key]=="function"){
									(function(key,granny,instance){
										instance.parents[granny_name][key]=function(){
											return granny.protected[key].apply(instance,arguments);
										}
									})(key,granny,instance);
								}
								else{
									if(granny.protected[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(granny.protected[key].constructor)>-1){
										var copy=function(){}
										copy.prototype=granny.protected[key];
										instance.parents[granny_name][key]=(granny.protected[key] instanceof Array)?granny.protected[key].slice(0):ClassModel.IE?granny.protected[key]:new copy();
									}
									else{
										instance.parents[granny_name][key]=granny.protected[key];
									}
								}
							}
							for(var key in granny.public){
								if(typeof granny.public[key]=="function"){
									(function(key,granny,instance){
										instance.parents[granny_name][key]=function(){
											return granny.public[key].apply(instance,arguments);
										}
									})(key,granny,instance);
								}
								else{
									if(granny.public[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(granny.public[key].constructor)>-1){
										var copy=function(){}
										copy.prototype=granny.public[key];
										instance.parents[granny_name][key]=(granny.public[key] instanceof Array)?granny.public[key].slice(0):ClassModel.IE?granny.public[key]:new copy();
									}
									else{
										instance.parents[granny_name][key]=parentObject.public[key];
									}
								}
							}
						}
						while(typeof __Class__[granny_name].parent=="function");
					}
					for(var i=0;i<implements.length;i++){
						className=getClassName(implements[i]);
						if(__Class__[className]){
							parentObject=__Class__[className];
							if(parentObject.constructor){
								parentObject.constructor();
							}
							if(parentObject.protected){
								for(var key in parentObject.protected){
									if(!(public[key] || private[key] || protected[key]) && $.inArray(key,history[1])==-1){
										history[1].push(key);
										(function(instance,key,parentObject){
											if(typeof parentObject.protected[key]=="function"){
												var method=parentObject.protected[key];
												instance[key]=function(){
													return method.apply(instance,arguments);
												}
											}
											else{
												if(parentObject.protected[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(parentObject.protected[key].constructor)>-1){
													var copy=function(){}
													copy.prototype=parentObject.protected[key];
													instance[key]=(parentObject.protected[key] instanceof Array)?parentObject.protected[key].slice(0):ClassModel.IE?parentObject.protected[key]:new copy();
												}
												else{
													instance[key]=parentObject.protected[key];
												}
											}
										})(instance,key,parentObject);
									}
								}
							}
							if(parentObject.public){
								for(var key in parentObject.public){
									if(!(public[key] || private[key] || protected[key]) && $.inArray(key,history[1])==-1){
										history[1].push(key);
										if(typeof parentObject.public[key]=="function"){
											var method=parentObject.public[key];
											(function(method,instance,key){
												instance[key]=function(){
													return method.apply(instance,arguments);
												}
												if(ClassModel.OTHER){
													instance.public[key]=function(){
														return method.apply(instance,arguments);
													}
												}
												if(ClassModel.IE){
													instance.public[key]=function(){
														return method.apply(instance,arguments);
													}
												}
											})(method,instance,key);
										}
										else{
											instance[key]=parentObject.public[key];
											if(ClassModel.OTHER){
												(function(public,key,instance,name){
													public.__defineGetter__(key,function(prop){
														return instance[key];
													});
												})(instance.public,key,instance,name);
												(function(public,key,instance,name){
													public.__defineSetter__(key,function(val){
														if(typeof val=='object'){
															var copy=function(){}
															copy.prototype=val;
															instance[key]=(val instanceof Array)?val.slice(0):ClassModel.IE?val:new copy();
														}
														else{
															instance[key]=val;
														}
													});
												})(instance.public,key,instance,name);
											}
											if(ClassModel.IE){
												(function(public,key,instance,name){
													public["get_"+key]=function(){
														return instance[key];
													}
												})(instance.public,key,instance,name);
												(function(public,key,instance,name){
													public["set_"+key]=function(val){
														if(typeof val=='object'){
															var copy=function(){}
															copy.prototype=val;
															instance[key]=(val instanceof Array)?val.slice(0):ClassModel.IE?val:new copy();
														}
														else{
															instance[key]=val;
														}
													}
												})(instance.public,key,instance,name);
											}
										}
									}
								}
							}
						}
					}
					for(var key in private){
						if(typeof private[key]=="function"){
							(function(method,instance){
								instance[key]=function(){
									return method.apply(instance,arguments);
								}
							})(private[key],instance);
						}
						else{
							
							if(private[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(private[key].constructor)>-1){
								var copy=function(){}
								copy.prototype=private[key];
								instance[key]=(private[key] instanceof Array)?private[key].slice(0):ClassModel.IE?private[key]:new copy();
							}
							else{
								instance[key]=private[key];
							}
						}
					}
					for(var key in protected){
						if(typeof protected[key]=="function"){
							(function(method,instance){
								instance[key]=function(){
									return method.apply(instance,arguments);
								}
							})(protected[key],instance);
						}
						else{
							if(protected[key]!==null && [(new Object).constructor,(new Array).constructor].indexOf(protected[key].constructor)>-1){
								var copy=function(){}
								copy.prototype=protected[key];
								instance[key]=(protected[key] instanceof Array)?protected[key].slice(0):ClassModel.IE?protected[key]:new copy();
							}
							else{
								instance[key]=protected[key];
							}
						}
					}
					for(var key in public){
						if(typeof public[key]=="function"){
							var method=public[key];
							(function(method,instance,key,public){
								instance[key]=function(){
									return method.apply(instance,arguments);
								}
								public[key]=function(){
									return method.apply(instance,arguments);
								}
							})(method,instance,key,instance.public);
						}
						else{
							instance[key]=public[key];
							if(ClassModel.OTHER){
								(function(public,key,instance,name){
									public.__defineGetter__(key,function(prop){
										return instance[key];
									});
								})(instance.public,key,instance,name);
								(function(public,key,instance,name){
									public.__defineSetter__(key,function(val){
										if(typeof val=='object'){
											var copy=function(){}
											copy.prototype=val;
											instance[key]=(val instanceof Array)?val.slice(0):ClassModel.IE?val:new copy();
										}
										else{
											instance[key]=val;
										}
									});
								})(instance.public,key,instance,name);
							}
							if(ClassModel.IE){
								(function(public,key,instance,name){
									public["get_"+key]=function(){
										return instance[key];
									}
								})(instance.public,key,instance,name);
								(function(public,key,instance,name){
									public["set_"+key]=function(val){
										if(typeof val=='object'){
											var copy=function(){}
											copy.prototype=val;
											instance[key]=(val instanceof Array)?val.slice(0):ClassModel.IE?val:new copy();
										}
										else{
											instance[key]=val;
										}
									}
								})(instance.public,key,instance,name);
							}
						}
					}
					for(var key in get){
						instance[key]=get[key].call(instance,key);
						if(ClassModel.IE){
							(function(public,key,instance,name){
								public["get_"+key]=function(){
									return get[key].call(instance,key);
								}
							})(instance.public,key,instance,name);
						}
						if(ClassModel.OTHER){
							(function(public,key,instance,name){
								public.__defineGetter__(key,function(){
									return get[key].call(instance,key);
								});
							})(instance.public,key,instance,name);
						}
					}
					for(var key in set){
						if(ClassModel.IE){
							(function(public,key,instance,name){
								public["set_"+key]=function(val){
									return set[key].call(instance,key,val);
								}
							})(instance.public,key,instance);
						}
						if(ClassModel.OTHER){
							(function(public,key,instance,name){
								public.__defineSetter__(key,function(val){
									return set[key].call(instance,key,val);
								});
							})(instance.public,key,instance,name);
						}
					}
					for(var key in instance){
						if(typeof instance[key]=="string"){
							var match=instance[key].match(/^~([^~]+)~$/i);
							var match1;
							var match2;
							if(match){
								match1=match[1].match(/^(.*)$/i);
								match2=match[1].match(/^this$/i);
								if(match1){
									instance[key]=eval(match1[0].replace(/this/g,"instance"));
								}
								if(match2){
									instance[key]=interface;
								}
							}
						}
					}
					if(arguments[0]!="@!!"){
						var _constructor=constructor;
						_constructor.apply(instance,arguments);
					}
					return instance.public;
				}
				if(pack){
					pack[name]=abstract;
				}
				else{
					window[name]=abstract
				}
				return abstract;
			}
			if(type=="interface"){
				var abstract=(function(private,protected,public,name,constructor){
					var interface={};
					abstract={};
					if(ClassModel.IE){
						var IEobject=ieFix.newIns(__Class__[name].VBid);
						IEobject["typeString"]=function(){
							return "[interface "+name+"]";
						}
					}
					if(ClassModel.OTHER){
						var OTHERobject={};
						abstract["typeString"]=function(){
							return "[interface "+name+"]";
						}
					}
					for(var key in private){
						interface[key]=private[key];
					}
					for(var key in protected){
						interface[key]=protected[key];
					}
					for(var key in public){
						if(typeof public[key]=="function"){
							interface[key]=public[key];
							var method=public[key];
							(function(interface,key,method,IEobject,abstract,ClassModel){
								if(ClassModel.IE){
									IEobject[key]=function(){
										return method.apply(interface,arguments);
									}
								}
								if(ClassModel.OTHER){
									abstract[key]=function(){
										return method.apply(interface,arguments);
									}
								}
							})(interface,key,method,IEobject,abstract,ClassModel);
						}
						else{
							interface[key]=public[key];
							if(ClassModel.IE){
								(function(IEobject,key,interface,name){
									IEobject["get_"+key]=function(){
										return interface[key];
									}
								})(IEobject,key,interface,name);
								(function(IEobject,key,interface,name){
									IEobject["set_"+key]=function(val){
										interface[key]=val;
									}
								})(IEobject,key,interface,name);
							}
							if(ClassModel.OTHER){
								(function(OTHERobject,key,interface,name){
									OTHERobject.__defineGetter__(key,function(val){
										return interface[key];
									});
								})(abstract,key,interface,name);
								(function(OTHERobject,key,interface,name){
									OTHERobject.__defineSetter__(key,function(val){
										interface[key]=val;
									});
								})(abstract,key,interface,name);
							}
						}
					}
					for(var key in interface){
						if(typeof interface[key]=="string"){
							var match=interface[key].match(/^~([^~]+)~$/i);
							var match1;
							var match2;
							if(match){
								match1=match[1].match(/^(.*)$/i);
								match2=match[1].match(/^this$/i);
								if(match1){
									interface[key]=eval(match1[0].replace(/this/g,"interface"));
								}
								if(match2){
									interface[key]=interface;
								}
							}
						}
					}
					if(ClassModel.IE){
						abstract=IEobject;
					}
					return abstract;
				})(private,protected,public,name,constructor);
				if(pack){
					pack[name]=abstract;
				}
				else{
					window[name]=abstract
				}
				return abstract;
			}
		}
	}
	catch(err){
		__Class__.error.push(err);
		if(console){
			console.log(__Class__.error);
		}
	}
})();
