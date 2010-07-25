try{
	var __Class__={
		error:[],
		VBid:0
	};
	var ClassModel={
		IE:		!!window.ActiveXObject,
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
				this.code+="\tPublic "+prop+"\n";
			},
			addMethod:function(prop){
				this.code+="\tPublic "+prop+"\n";
			},
			addGet:function(prop){
				this.code+=
				"\tPublic Property Get "+prop+"\n"+
				"\t\tDim proxy\n"+
				"\t\tSet proxy = new TypeProxy\n"+
				"\t\tproxy.load(get_"+prop+"(me))\n"+
				"\t\tIf IsObject(proxy.value) Then\n"+
				"\t\t\tSet "+prop+" = proxy.value\n"+
				"\t\tElse\n"+
				"\t\t\t"+prop+" = proxy.value\n"+
				"\t\tEnd If\n"+
				"\tEnd Property\n"+
				"\tPublic get_"+prop+"\n";
			},
			addSet:function(prop){
				this.code+=
				"\tPublic Property Let "+prop+"(val)\n"+
				"\t\tCall set_"+ prop +"(val)\n"+
				"\tEnd Property\n"+
				"\tPublic Property Set "+prop+"(val)\n"+
				"\t\tCall set_"+prop+"(val)\n"+
				"\tEnd Property\n"+
				"\tPublic set_"+prop+"\n";
			},
			newVBClass:function(VBid){
				this.execute(
					"Class Class_"+VBid+"\n"+
					this.code+
					"\nEnd Class\n"
				);
				this.code="";
			},
			newIns:function(VBid){
				return this.evaluate("New Class_"+VBid,true);
			},
			addTypeProxy:function(){
				this.execute(
					"Class TypeProxy\n"+
					"\tPublic value\n"+
					"\tPublic Function load(val)\n"+
					"\t\tIf IsObject(val) Then\n"+
					"\t\t\tSet value = val\n"+
					"\t\tElse\n"+
					"\t\t\tvalue = val\n"+
					"\t\tEnd If\n"+
					"\tEnd Function\n"+
					"End Class\n"
				);
			}
		};
		$(ieFix.iframe).hide();
		$("head").append(ieFix.iframe);
		ieFix.iframe.contentWindow.document.write(
			"<html><head><title>VBiframe</title>\n"+
			"<script type='text/vbscript'>\n"+
			"Function execute(code)\nExecuteGlobal(code)\nEnd Function\n"+
			"Function evaluate(code,isObject)\nIf isObject Then\nSet evaluate = Eval(code)\n"+
			"Else\nevaluate = Eval(code)\nEnd If\nEnd Function\n"+
			"</script>"+
			"</head><body></body></html>"
		);
		ieFix.iframe.contentWindow.document.close();
		ieFix.addTypeProxy();
		try{
			ieFix.evaluate('true');
		}
		catch(err){
			throw({number:2,description:"Браузер семейства ie не поддерживает VBscript"});
		}
	}
	else{
		var ieFix={};
	}
      function getClassName(Class){
		if(typeof Class=="function"){
			var name=new Class("@!!").typeString().match(/^\[(?:class|interface)\s([a-z0-9_]+)\]$/i);
			if(name[1]) return name[1];
		}
		if(typeof Class=="object"){
			var name=Class.typeString().match(/^\[(?:class|interface)\s([a-z0-9_]+)\]$/i);
			if(name[1]) return name[1];
		}
      }
	Class=function(object){
			var final=false;
			var parent=false;
			var implements=[];
			var constructor;
			var  public={};
			var  protected={};
			var  private={};
			var  type="class";
			var get={};
			var set={};
			var  name;
			var className;
			var parentObject;
			var childObject;
			var history=[[],[]];
			{
				if(!ClassModel.IE && !ClassModel.OTHER){
					throw({number:2,description:" Браузер не поддерживает не одну из прелогаемых моделей работы"});
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
					throw({number:0,description:"Отсутствует или неверное имя класса"});
				}
				if(typeof object.parent=="function"){
					parent=object.parent;
				}
				if(!object.constructor || typeof object.constructor!="function"){
					throw({number:1,description:"Отсутствует конструктор"});
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
			}
			__Class__[name]={
				public:public,
				protected:protected,
				private:private,
				get:get,
				set:set,
				type:type,
				final:final,
				parent:parent,
				name:name,
				constructor:constructor,
				VBid: ++__Class__.VBid
			};
			if(ClassModel.IE){
				ieFix.addMethod("typeString");
				childObject=__Class__[name];
				if(parent){
					ieFix.addMethod("super");
					className=getClassName(parent);
					parentObject=__Class__[className];
					if(parentObject){
						for(var key in parentObject.public){
							if(!(childObject.public[key] || childObject.private[key] || childObject.protected[key]) && $.inArray(key,history[0])==-1){
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
								if(!(childObject.public[key] || childObject.private[key] || childObject.protected[key]) && $.inArray(key,history[0])==-1){
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
					if(typeof public[key]=="function"){
						ieFix.addMethod(key);
					}
					else{
						ieFix.addGet(key);
						ieFix.addSet(key);
					}
				}
				for(var key in get){
					ieFix.addGet(key);
				}
				for(var key in set){
					ieFix.addSet(key);
				}
				ieFix.newVBClass(__Class__[name].VBid);
			}
			if(type=="class"){
				window[name]=function(){
					var instance={};
					childObject=__Class__[name];
					if(ClassModel.IE){
						var IEprototype=ieFix.newIns(__Class__[name].VBid);
						IEprototype["typeString"]=function(){
							return "[class "+name+"]";
						}
					}
					if(ClassModel.OTHER){
						var OTHERprototype={};
						OTHERprototype["typeString"]=function(){
							return "[class "+name+"]";
						}
					}
					if(parent){
						className=getClassName(parent);
						parentObject=__Class__[className];
						(function(parentObject,instance){
							instance.Super=function(){
								parentObject.constructor.apply(instance,arguments);
							}
						})(parentObject,instance);
						if(parentObject){
							if(parentObject.protected){
								for(var key in parentObject.protected){
									if(!(childObject.public[key] || childObject.private[key] || childObject.protected[key]) && $.inArray(key,history[1])==-1){
										history[1].push(key);
										(function(instance,key,parentObject){
											instance[key]=function(){
												parentObject.protected[key].apply(instance,arguments);
											}
										})(instance,key,parentObject);
									}
								}
							}
							if(parentObject.public){
								for(var key in parentObject.public){
									if(!(childObject.public[key] || childObject.private[key] || childObject.protected[key]) && $.inArray(key,history[1])==-1){
										history[1].push(key);
										if(typeof parentObject.public[key]=="function"){
											var method=parentObject.public[key];
											(function(method,instance,key){
												instance[key]=function(){
													return method.apply(instance,arguments);
												}
												if(ClassModel.OTHER){
													OTHERprototype[key]=function(){
														return method.apply(instance,arguments);
													}
												}
												if(ClassModel.IE){
													IEprototype[key]=function(){
														return method.apply(instance,arguments);
													}
												}
											})(method,instance,key);
										}
										else{
											instance[key]=parentObject.public[key];
											if(ClassModel.OTHER){
												(function(OTHERprototype,key,instance,name){
													OTHERprototype.__defineGetter__(key,function(prop){
														return instance[key];
													});
												})(OTHERprototype,key,instance,name);
												(function(OTHERprototype,key,instance,name){
													OTHERprototype.__defineSetter__(key,function(val){
														instance[key]=val;
													});
												})(OTHERprototype,key,instance,name);
											}
											if(ClassModel.IE){
												(function(IEprototype,key,instance,name){
													IEprototype["get_"+key]=function(){
														return instance[key];
													}
												})(IEprototype,key,instance,name);
												(function(IEprototype,key,instance,name){
													IEprototype["set_"+key]=function(val){
														instance[key]=val;
													}
												})(IEprototype,key,instance,name);
											}
										}
									}
								}
							}
						}
					}
					for(var i=0;i<implements.length;i++){
						className=getClassName(implements[i]);
						if(__Class__[className]){
							parentObject=__Class__[className];
							if(parentObject.protected){
								for(var key in parentObject.protected){
									if(!(childObject.public[key] || childObject.private[key] || childObject.protected[key]) && $.inArray(key,history[1])==-1){
										history[1].push(key);
										(function(instance,key,parentObject){
											instance[key]=function(){
												parentObject.protected[key].apply(instance,arguments);
											}
										})(instance,key,parentObject);
									}
								}
							}
							if(parentObject.public){
								for(var key in parentObject.public){
									if(!(childObject.public[key] || childObject.private[key] || childObject.protected[key]) && $.inArray(key,history[1])==-1){
										history[1].push(key);
										if(typeof parentObject.public[key]=="function"){
											var method=parentObject.public[key];
											(function(method,instance,key){
												instance[key]=function(){
													return method.apply(instance,arguments);
												}
												if(ClassModel.OTHER){
													OTHERprototype[key]=function(){
														return method.apply(instance,arguments);
													}
												}
												if(ClassModel.IE){
													IEprototype[key]=function(){
														return method.apply(instance,arguments);
													}
												}
											})(method,instance,key);
										}
										else{
											instance[key]=parentObject.public[key];
											if(ClassModel.OTHER){
												(function(OTHERprototype,key,instance,name){
													OTHERprototype.__defineGetter__(key,function(prop){
														return instance[key];
													});
												})(OTHERprototype,key,instance,name);
												(function(OTHERprototype,key,instance,name){
													OTHERprototype.__defineSetter__(key,function(val){
														instance[key]=val;
													});
												})(OTHERprototype,key,instance,name);
											}
											if(ClassModel.IE){
												(function(IEprototype,key,instance,name){
													IEprototype["get_"+key]=function(){
														return instance[key];
													}
												})(IEprototype,key,instance,name);
												(function(IEprototype,key,instance,name){
													IEprototype["set_"+key]=function(val){
														instance[key]=val;
													}
												})(IEprototype,key,instance,name);
											}
										}
									}
								}
							}
						}
					}
					for(var key in private){
						instance[key]=private[key];
					}
					for(var key in protected){
						instance[key]=protected[key];
					}
					for(var key in public){
						if(typeof public[key]=="function"){
							var method=public[key];
							(function(method,instance,key,OTHERprototype,IEprototype){
								instance[key]=function(){
									return method.apply(instance,arguments);
								}
								if(ClassModel.OTHER){
									OTHERprototype[key]=function(){
										return method.apply(instance,arguments);
									}
								}
								if(ClassModel.IE){
									IEprototype[key]=function(){
										return method.apply(instance,arguments);
									}
								}
							})(method,instance,key,OTHERprototype,IEprototype);
						}
						else{
							instance[key]=public[key];
							if(ClassModel.OTHER){
								(function(OTHERprototype,key,instance,name){
									OTHERprototype.__defineGetter__(key,function(prop){
										return instance[key];
									});
								})(OTHERprototype,key,instance,name);
								(function(OTHERprototype,key,instance,name){
									OTHERprototype.__defineSetter__(key,function(val){
										instance[key]=val;
									});
								})(OTHERprototype,key,instance,name);
							}
							if(ClassModel.IE){
								(function(IEprototype,key,instance,name){
									IEprototype["get_"+key]=function(){
										return instance[key];
									}
								})(IEprototype,key,instance,name);
								(function(IEprototype,key,instance,name){
									IEprototype["set_"+key]=function(val){
										instance[key]=val;
									}
								})(IEprototype,key,instance,name);
							}
						}
					}
					for(var key in get){
						if(ClassModel.IE){
							(function(IEprototype,key,instance,name){
								IEprototype["get_"+key]=function(){
									return get[key].call(instance,key);
								}
							})(IEprototype,key,instance,name);
						}
						if(ClassModel.OTHER){
							(function(OTHERprototype,key,instance,name){
								OTHERprototype.__defineGetter__(key,function(){
									return get[key].call(instance,key);
								});
							})(OTHERprototype,key,instance,name);
						}
					}
					for(var key in set){ 
						if(ClassModel.IE){
							(function(IEprototype,key,instance,name){
								IEprototype["set_"+key]=function(val){
									return set[key].call(instance,key,val);
								}
							})(IEprototype,key,instance);
						}
						if(ClassModel.OTHER){
							(function(OTHERprototype,key,instance,name){
								OTHERprototype.__defineSetter__(key,function(val){
									return set[key].call(instance,key,val);
								});
							})(OTHERprototype,key,instance,name);
						}
					}
					if(arguments[0]!="@!!"){
						constructor.apply(instance,arguments);
					}
					if(ClassModel.IE){
						return IEprototype;
					}
					if(ClassModel.OTHER){
						return OTHERprototype;
					}
				}
				return window[name];
			}
			if(type=="interface"){
				(function(private,protected,public,name){
					var interface={};
					window[name]={};
					if(ClassModel.IE){
						var IEobject=ieFix.newIns(__Class__[name].VBid);
						IEobject["typeString"]=function(){
							return "[interface "+name+"]";
						}
					}
					if(ClassModel.OTHER){
						var OTHERobject={};
						window[name]["typeString"]=function(){
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
							if(ClassModel.IE){
								IEobject[key]=function(){
									return method.apply(interface,arguments);
								}
							}
							if(ClassModel.OTHER){
								window[name][key]=function(){
									return method.apply(interface,arguments);
								}
							}
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
								})(window[name],key,interface,name);
								(function(OTHERobject,key,interface,name){
									OTHERobject.__defineSetter__(key,function(val){
										interface[key]=val;
									});
								})(window[name],key,interface,name);
							}
						}
					}
					if(ClassModel.IE){
						window[name]=IEobject;
					}
				})(private,protected,public,name);
				return window[name];
			}
		}
	}
catch(err){
	__Class__.error.push(err);
	if(console){
		console.log(__Class__.error);
	}
}