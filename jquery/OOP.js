/**
* @projectDescription
* Пакет ООП утилит для jquery
* @author <a href="mailto:zi.white.drago@gmail.com">Zi White</a>
* @version 0.0.3
*/
(function($){
	/**
	* @class
	* Это плагин для создания классического ООП в jquery
	* @constructor
	*/
	$.Class=function(object){
		try{
			/**
			* Является ли класс финальным экземляром, возможно ли его 
			* дальнейшее наследование, по-умолчанию <i>false</i>
			*/
			var final=false;
			/**
			* Наследует ли класс 
			*/
			var extend=false;
			var implements=[],
				constructor,
				public={},
				protected={},
				private={},
				action={},
				type="class",
				__GLOBAL__={},
				name,
				model={
					IE:		window.ActiveXObject,
					MOZZILA:	Object.__defineSetter__ && Object.__defineGetter__
				};
			/**
			*
			*	Браузер не поддерживает ООП
			*
			**/
			if(!model.IE && !model.MOZZILA) throw(3);
			__GLOBAL__.__LOG__=[];
			if(!window.__GLOBAL__ && model.IE){
				var	VBClass_id=0;
			}
			if(window.__GLOBAL__ && model.IE){
				var	VBClass_id=++window.__GLOBAL__.VBClass_id;
			}
			/**
			*
			*	Проверка начальных условий
			*
			**/
			if(object.final)											final=object.final;
			if(object.type=="class" || object.type=="interface")			type=object.type;
			if(!object.name)										throw(0);
			else													name=object.name;
			if(typeof object.extend=="function")						extend=object.ext;
			for(var i=0;typeof object.implements=="array" && i<object.implements.length;i++)
				if(typeof object.implements[i]=="function") implements.push(object.implements[i]);
			if(!object.constructor || typeof object.constructor!="function")	throw(1);
			if(object.constructor)									constructor=object.constructor;
			if(typeof object.public=="object")							public=object.public;
			if(typeof object.protected=="object")						protected=object.protected;
			if(typeof object.private=="object")						private=object.private;
			/**
			*
			*	Дополнительные переменные
			*	Class - внутреня часть класса
			*	i - итератор
			*
			**/
			var	i=-1,
				Class={},
				publicClass={};
			/**
			*
			*	Операции
			*
			**/
			/**
			*
			*	Создаем глобальный объект с информацией о классе
			*
			**/
			__GLOBAL__[name]={
				public:public,
				protected:protected,
				private:private,
				type:type,
				final:final,
				ext:ext,
				name:name,
				constructor:constructor
			};
			/**
			*
			*	ХАК для IE
			*
			**/
			if(model.IE){
				/**
				*
				*	Создаем iframe
				*
				**/
				var	iframe=document.createElement("iframe"),
					ieFix={
						iframeControl:null,
						code:"",
						evaluate:function(code, isObject){
							return this.iframeControl.evaluate(code, !!isObject);
						},
						execute:function(code){
							this.iframeControl.execute(code);
						},
						addProp:function(prop){
							this.code="\tPublic "+prop;
						},
						addMethod:function(prop){
							this.code="\tPublic "+prop;
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
							"\tPublic set_"+prop;
						},
						newVBClass:function(){
							this.execute(
								"Class Class_"+VBClass_id+"\n"+
								this.code+
								"\nEnd Class\n"
							);
						},
						newIns:function(){
							return this.evaluate("New Class_"+VBClass_id,true);
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
				$(iframe).hide();
				$("head").append(iframe);
				ieFix.iframeControl=iframe.contentWindow;
				ieFix.iframeControl.document.write(
				"<html><head><title>VBiframe</title>\n"+
				"<script type='text/vbscript'>\n"+
				"Function execute(code)\nExecuteGlobal(code)\nEnd Function\n"+
				"Function evaluate(code,isObject)\nIf isObject Then\nSet evaluate = Eval(code)\n"+
				"Else\nevaluate = Eval(code)\nEnd If\nEnd Function\n"+
				"</script>"+
				"</head><body></body></html>"
				);
				ieFix.iframeControl.document.close();
				ieFix.addTypeProxy();
				try{
					ieFix.evaluate('true');
				}
				catch(e){
					throw(4);
				}
			}
			/**
			*
			*	Создаем класс
			*
			**/
			window[name]=function(){
				if(model.IE){}
				/**
				*
				*	Заполняем приватные свойства класса
				*
				**/
				for(var key in private){
					if(typeof private[key]=="function"){
						Class[key]=private[key];
					}
				}
				/**
				*
				*	Заполняем защищенные свойства классов
				*
				**/
				for(var key in protected){
					if(typeof protected[key]=="function"){
						Class[key]=protected[key];
					}
				}
				/**
				*
				*	Заполняем публичный свойства
				*
				**/
				for(var key in public){
					if(typeof public[key]=="function"){
						/**
						*
						*	Если модель поддерживает setter/getter в javascript, функции
						*
						**/
						if(model.MOZZILA){
							Class[key]=public[key];
							var method=public[key];
							window[name].prototype[key]=function(){
								return method.apply(Class,arguments);
							}
						}
						/**
						*
						*	если не поддерживает
						*
						**/
						else{
							Class[key]=public[key];
							var method=public[key];
						}
					}
					else{
						/**
						*
						*	Если это свойство
						*
						**/
						if(model.MOZZILA){
							window[name].prototype[key]=public[key];
							Class[key]=window[name].prototype[key];
							/**
							*
							*	вешаем setter/getter в браузерах поддерживающих getter, setter
							*
							**/
							(function(key,name,Class){
								window[name].prototype.__defineGetter__(key,function(prop){
									if(__GLOBAL__[name].public[key] && typeof val!="function"){
										return Class[key];
									}
								});
								window[name].prototype.__defineSetter__(key,function(val){
									if(__GLOBAL__[name].public[key] && typeof val!="function"){
										Class[key]=val;
									}
								});
							})(key,name,Class);
						}
						/**
						*
						*	
						*
						**/
						else{
						}
					}
				}
				/**
				*
				*	
				*
				**/
				constructor.apply(Class,arguments);
				/**
				*
				*	
				*
				**/
				window.__GLOBAL__=__GLOBAL__;
				if(model.IE){
					ieFix.newVBClass();
				}
			}
		}
		/**
		*
		*	Выполняем обработку ошибок
		*	0 - Отсутствует имя класса
		*	1 - Отсутствует конструктор
		*	3 - Не поддерживает классы
		*	4 - Браузер не поддерживает VBscript
		*
		**/
		catch(err){
			__GLOBAL__.__LOG__.push(err);
			window.__GLOBAL__=__GLOBAL__;
			if(console) console.log(__GLOBAL__.__LOG__);
		}
	}
})($);