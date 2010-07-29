/**
* @fileoverview
* Пакет ООП утилит для jquery, в программе использован хак <a href="http://alex.dojotoolkit.org/08/jscript/lettable.html">dojo</a>.
* Тестируется в браузерах ie6, ie7, ie8, opera 10.60, chrome 4, firefox 3.6.6.
* @author <a href="mailto:zi.white.drago@gmail.com">Zi White</a>
* @version 0.0.3
*/
try{
	/**
	* Информация о содержимом и работе классов
	* @namespace
	* @example
	* __Class__.имя класса.public.метод();
	*/
	var __Class__={
		/**
		* @default <i>false</i>
		* @description
		* <b>Тип данных:</b> <i>Array</i>
		* <br/>Массив с ошибками, возникающими при работе с классами
		*/
		error:[],
		/**
		* @default <i>0</i>
		* <b>Тип данных:</b> <i>Number</i>
		* <br/>Номер последнего созданного класса в VBscript
		*/
		VBid:0
	};
	/**
	* Модель работы классов
	* @namespace
	*/
	var ClassModel={
		/**
		* <b>Тип данных:</b> <i>Boolean</i>
		* <br/> Работаем в ie
		*/
		IE:		!!window.ActiveXObject,
		/**
		* <b>Тип данных:</b> <i>Boolean</i>
		* <br/> Работаем в других браузерах
		*/
		OTHER:	!!(Object.__defineSetter__ && Object.__defineGetter__)
	};
	/**  Объявляем переменные только для IE */
	if(ClassModel.IE){
		/**
		* @namespace
		* @description
		* Управление VB-классом в javascript
		* <br/><i>Присутствует только в IE</i>
		*/
		var ieFix={
			/**
			* @default <i>document.createElement("iframe")</i>
			* @description
			* <b>Тип данных:</b> <i>DomNode</i>
			* <br/> Создаёт новый dom-узел IFRAME
			*/
			iframe:document.createElement("iframe"),
			/**
			* @default <i>new String()</i>
			* @description
			* <br/><b>Тип данных:</b> <i>String</i>
			* <br/>VBscript-строка
			*/
			code:"",
			/**
			* @param {String} code  Строка с кодом VBscript
			* @param {Mixed} isObject При создании объекта в языка VBscript данная 
			* переменная отвечает за создания свойства содержащего объект
			* @type Object
			* @description
			* Возвращает VBscript-объект c возможностью установки и получения
			* свойств
			*/
			evaluate:function(code, isObject){
				return this.iframe.contentWindow.evaluate(code, !!isObject);
			},
			/**
			* @param {String} code  Строка с кодом VBscript
			* @type Void
			* @description
			* Выполняет строку в области видимости VBscript
			*/
			execute:function(code){
				this.iframe.contentWindow.execute(code);
			},
			/**
			* @param {String} prop Название свойства
			* @type Void
			* @description
			* Добавляет публичное свойство для нового класса
			*/
			addProp:function(prop){
				this.code+="\tPublic "+prop+"\n";
			},
			/**
			* @param {String} prop Название метода
			* @type Void
			* @description
			* Добавляет новый метод.
			*/
			addMethod:function(prop){
				this.code+="\tPublic "+prop+"\n";
			},
			/**
			* @param {String} prop Название Getter'а
			* @type Void
			* @description
			* Добавляет новый Getter.
			*/
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
			/**
			* @param {String} prop Название Setter'а
			* @type Void
			* @description
			* Добавляет новый Setter.
			*/
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
			/**
			* @type Void
			* @param {Number} VBid Номер класса
			* @description
			* Создаёт новый класс
			*/
			newVBClass:function(VBid){
				this.execute(
					"Class Class_"+VBid+"\n"+
					this.code+
					"\nEnd Class\n"
				);
				this.code="";
			},
			/**
			* @type Mixed
			* @param {Number} VBid Номер класса
			* @description
			* Возращает новую копию класса
			*/
			newIns:function(VBid){
				return this.evaluate("New Class_"+VBid,true);
			},
			/**
			* @type Void
			* @description
			* Добавляет в область видимости VBscript класс прокси
			*/
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
		/** Добавляем фрейм в документ */
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
		/** Добавляем прокси */
		ieFix.addTypeProxy();
		/** Проверяем работает ли вызов функции из области видимости VBscript */
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
	/**
	* @param {Mixed} Class Ссылка на класс
	* @returns {String}
	* @description
	* Функция возвращает строку с названием класса
	*/
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
/**
* @class Это плагин для создания классического ООП в jquery
* @param {Object} object информация о методах и свойствах класса
* @throws <b>Exception</b> 0 Отсутствует или неверное имя класса
* @throws <b>Exception</b> 1 Отсутствует конструктор
* @throws <b>Exception</b> 2 Браузер не поддерживает не одну из прелогаемых моделей работы
* @throws <b>Exception</b> 3 Браузер семейства ie не поддерживает VBscript
* @throws <b>Exception</b> 4 Неверный тип свойства final
* @example
* Class({
*	final<a href="#-final">[1]</a>:false<sup></sup>,
*	pack<sup><a href="#-pack">[2]</a></sup>:tools,
*	parent<sup><a href="#-parent">[3]</a></sup>:false,
* 	implements<sup><a href="#-implements">[4]</a></sup>:false,
* 	name<sup><a href="#-name">[5]</a></sup>:"A",
*	constructor<sup><a href="#-constructor">[6]</a></sup>:function(a,b){},
*	public<sup><a href="#-public">[7]</a></sup>:{
*		sample:function(){},
*		sample2:"~this.sample==123~"
*	},
*	protected<sup><a href="#-protected">[8]</a></sup>:{},
*	private<sup><a href="#-private">[9]</a></sup>:{},
*	set<sup><a href="#-set">[10]</a></sup>:{},
*	get<sup><a href="#-get">[11]</a></sup>:{}
* }
* var instance=new A(123,123);
* instance.sample();
*/
	Class=function(object){
			/**
			* @default <i>false</i>
			* @description
			* <b>Тип данных:</b> <i>Boolean</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Является ли класс финальным экземпляром, возможно ли его дальнейшее наследование 
			*/
			var final=false;
			/**
			* @description
			* <b>Тип данных:</b> <i>Object</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Добавляет класс в пакет
			*/
			var pack;
			/**
			* @default <i>false</i>
			* @description
			* <br/><b>Тип данных:</b> <i>Boolean</i>|<i>Mixed</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Родительский класс
			*/
			var parent=false;
			/**
			* @default <i>new Array()</i>
			* @description
			* <br/><b>Тип данных:</b> <i>Array</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Наследуемые Интерфейсы данного класса
			*/
			var implements=[];
			/**
			* <br/><b>Тип данных:</b> <i>Mixed</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Обязательное</i>
			* <br/>Указывает конструктор нового класса
			*/
			var constructor;
			/**
			* @default <i>new Object()</i>
			* @description
			*  <br/><b>Тип данных:</b> <i>Object</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/> Набор публичных свойств и методов нового класса
			*/
			var  public={};
			/**
			* @default <i>new Object()</i>
			* @description
			* <br/><b>Тип данных:</b> <i>Object</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/> Набор защищенных свойств и методов нового класса
			*/
			var  protected={};
			/**
			* @default <i>new Object()</i>
			* @description
			* <br/><b>Тип данных:</b> <i>Object</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/> Набор приватных свойств и методов нового класса
			*/
			var  private={};
			/** 
			* @default <i>class</i>
			* @description
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/><b>Тип данных:</b> <i>String</i>
			* <br/><b>Возможные значения:</b> <i>class</i>, <i>interface</i>
			* <br/>Тип создаваемого объекта класс или интерфейс
			*/
			var  type="class";
			/**
			* @default <i>new Object()</i>
			* @description
			* <br/><b>Тип данных:</b> <i>Object</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Набор Getter'ов нового класса
			*/
			var get={};
			/**
			* @default <i>new Object()</i>
			* @description
			* <br/><b>Тип данных:</b> <i>Object</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Набор Setter'ов нового класса
			*/
			var set={};
			/**
			* <br/><b>Тип данных:</b> <i>String</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Обязательное</i>
			* <br/>Название класса, значение проверяется по regexp-маске /[a-z0-9_]/i
			*/
			var  name;
			/**
			* <br/><b>Тип данных:</b> <i>String</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Название интерфейса
			*/
			var className;
			/**
			* <br/><b>Тип данных:</b> <i>Mixed</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Наследуемый объект в истории
			*/
			var parentObject;
			/**
			* <br/><b>Тип данных:</b> <i>Mixed</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Текущий класс в истории
			*/
			var childObject;
			/**
			* @default <i>new Array(new Array(),new Array())</i>
			* <br/><b>Тип данных:</b> <i>Array</i>
			* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
			* <br/>Содержит все уже используемые наследуемые методы и свойства
			*/
			var history=[[],[]];
			/** Проверяем валидность всех условий */
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
				if(typeof object.pack=="object"){
					pack=object.pack;
				}
			}
			/** Добавляем новый класс в историю */
			__Class__[name]={
				public:(function(public,implements,parent){
					var object={};
					for(var key in public){
						object[key]=public[key];
					}
					if(parent){
						for(var key in parent.public){
							if(!object[key]){
								object[key]=parent.public[key];
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
					for(var key in protected){
						object[key]=protected[key];
					}
					if(parent){
						for(var key in parent.protected){
							if(!object[key]){
								object[key]=protected.protected[key];
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
				name:name,
				constructor:constructor,
				VBid: ++__Class__.VBid
			};
			/** Создаем класс для IE */
			if(ClassModel.IE){
				ieFix.addMethod("typeString");
				childObject=__Class__[name];
				/** Наследование в IE */
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
				/** Интерфейсы в IE */
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
				/** Заполнение в IE */
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
			/** Абстрактное представление объекта */ 
			var abstract;
			/** Создаем Javascript класс */
			if(type=="class"){
				abstract=function(){
					/** 
					* @ignore
					* Создаем область видимости для класса 
					*/
					var instance={};
					childObject=__Class__[name];
					if(ClassModel.IE){
						var IEprototype=ieFix.newIns(__Class__[name].VBid);
						IEprototype["typeString"]=function(){
							return "[class "+name+"]";
						}
					}
					/** Если не IE создаем новую копию класса */
					if(ClassModel.OTHER){
						var OTHERprototype={};
						OTHERprototype["typeString"]=function(){
							return "[class "+name+"]";
						}
					}
					/** Наследование */
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
											if(typeof parentObject.protected[key]=="function"){
												instance[key]=function(){
													parentObject.protected[key].apply(instance,arguments);
												}
											}
											else{
												if(typeof parentObject.protected[key]=="string"){
													var match=parentObject.protected[key].match(/^~([^~]+)~$/i);
													var match1;
													var match2;
													if(match){
														match1=match[1].match(/^(.*)$/i);
														match2=match[1].match(/^this$/i);
														if(match1){
															instance[key]=eval(match1[0].replace(/this/g,"instance"));
														}
														if(match2){
															instance[key]=instance;
														}
													}
													else{
														instance[key]=parentObject.protected[key];
													}
												}
												else{
													instance[key]=parentObject.public[key];
												}
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
											if(typeof parentObject.public[key]=="string"){
												var match=parentObject.public[key].match(/^~([^~]+)~$/i);
												var match1;
												var match2;
												if(match){
													match1=match[1].match(/^(.*)$/i);
													match2=match[1].match(/^this$/i);
													if(match1){
														instance[key]=eval(match1[0].replace(/this/g,"instance"));
													}
													if(match2){
														instance[key]=instance;
													}
												}
												else{
													instance[key]=parentObject.public[key];
												}
											}
											else{
												instance[key]=parentObject.public[key];
											}
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
					/**
					* @ignore
					* Интерфейсы 
					*/
					for(var i=0;i<implements.length;i++){
						className=getClassName(implements[i]);
						if(__Class__[className]){
							parentObject=__Class__[className];
							if(parentObject.constructor){
								parentObject.constructor();
							}
							if(parentObject.protected){
								for(var key in parentObject.protected){
									if(!(childObject.public[key] || childObject.private[key] || childObject.protected[key]) && $.inArray(key,history[1])==-1){
										history[1].push(key);
										(function(instance,key,parentObject){
											if(typeof parentObject.protected[key]=="function"){
												var method=parentObject.protected[key];
												instance[key]=function(){
													return method.apply(instance,arguments);
												}
											}
											else{
												if(typeof parentObject.protected[key]=="string"){
													var match=parentObject.protected[key].match(/^~([^~]+)~$/i);
													var match1;
													var match2;
													if(match){
														match1=match[1].match(/^(.*)$/i);
														match2=match[1].match(/^this$/i);
														if(match1){
															instance[key]=eval(match1[0].replace(/this/g,"instance"));
														}
														if(match2){
															instance[key]=instance;
														}
													}
													else{
														instance[key]=parentObject.protected[key];
													}
												}
												else{
													instance[key]=parentObject.public[key];
												}
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
											if(typeof parentObject.public[key]=="string"){
												var match=parentObject.public[key].match(/^~([^~]+)~$/i);
												var match1;
												var match2;
												if(match){
													match1=match[1].match(/^(.*)$/i);
													match2=match[1].match(/^this$/i);
													if(match1){
														instance[key]=eval(match1[0].replace(/this/g,"instance"));
													}
													if(match2){
														instance[key]=instance;
													}
												}
												else{
													instance[key]=parentObject.public[key];
												}
											}
											else{
												instance[key]=parentObject.public[key];
											}
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
					/** Заполняем область видимости */
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
					/** Вызываем конструктор */
					if(arguments[0]!="@!!"){
						constructor.apply(instance,arguments);
					}
					/** 
					* Если это IE, тогда возвращаем новую копию класса из области видимости 
					* VBscript
					*/
					if(ClassModel.IE){
						return IEprototype;
					}
					/** 
					* Если это не IE, тогда возвращаем новую копию класса из области видимости 
					* Javascript
					*/
					if(ClassModel.OTHER){
						return OTHERprototype;
					}
				}
				/** Добавляем класс в пакет */
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
					/** Если не IE создаем новую копию класса */
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
					/** Объект в теле window равен объекту созданным при помощи IE */
					if(ClassModel.IE){
						abstract=IEobject;
					}
// 					if(constructor) constructor.call(interface);
					return abstract;
				})(private,protected,public,name,constructor);
				/** Добавляем интерфейс в пакет */
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