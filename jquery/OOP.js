/**
*
*	Плагин для создание классического ООП в JavaScript
*
**/
(function($){
	$.Class=function(object){
		/**
		*
		*	final : false,  Является ли класс финальным экземляром, возможно ли его дальнейшее наследование, по-умолчанию false
		*	type : "class", Определяет тип создаваемого объекта class или interface, по-умолчанию class
		*	name : "example", // Имя создаваемого обьекта
		*	extends : "B",  Класс родитель
		*	implements : [C,D,E],  Наследуемые интерфейсы
		*	constructor : function(){}, //Вызывается при создании класса
		*	public : {},  публичные переменные и методы
		*	protected : {},  Защищенные методы класса и его наследников
		*	private : {}  Защищенные методы класса
		*	action : {}  Объект действий с классами
		*	__GLOBAL__  : {} Объект содержащий информацию о всех классах
		*
		**/
		try{
			var	final=false,
				ext=false,
				implements=[],
				constructor,
				public={},
				protected={},
				private={},
				action={},
				type="class",
				__GLOBAL__={},
				IEfix=document.createElement("DIV"),
				name
				/*model={
					IE:		window.ActiveXObject,
					MOZZILA:	
				}*/;
			__GLOBAL__.__LOG__=[];
			IEfix.style.display="none";
			$("body").append(IEfix);
/**
*
*	Проверка начальных условий
*
**/
			if(object.final)											final=object.final;
			if(object.type=="class" || object.type=="interface")			type=object.type;
			if(!object.name)										throw(0);
			else													name=object.name;
			if(typeof object.ext=="function")							ext=object.ext;
			for(var i=0;typeof object.implements=="array" && i<object.implements.length;i++)
				if(typeof object.implements[i]=="function") implements.push(object.implements[i]);
			if(!object.constructor || typeof object.constructor!="function")	throw(1);
			if(object.constructor)									constructor=object.constructor;
			if(typeof object.public=="object")							public=object.public;
			if(typeof object.protected=="object")						protected=object.protected;
			if(typeof object.private=="object")						private=object.private;
/**
*
*	Eval-строки, дополнительные переменные
*
**/
			var	i=-1,
				Class={},
				toLocal={},
				__set=[];
/**
*
*	Операции
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
			toLocal=__GLOBAL__[name];
			window[name]=function(){
				if(!Object.__defineSetter__){
					var	div=document.createElement("DIV");
				}
				for(var key in private)
					if(typeof private[key]=="function"){
						Class[key]=private[key];
					}
				for(var key in protected)
					if(typeof protected[key]=="function"){
						Class[key]=protected[key];
					}
				for(var key in public){
					if(typeof public[key]=="function"){
						if(Object.__defineSetter__){
							Class[key]=public[key];
							var method=public[key];
							window[name].prototype[key]=function(){
								return method.apply(Class,arguments);
							}
						}
						else{
							Class[key]=public[key];
							var method=public[key];
							div[key]=function(){
								return method.apply(Class,arguments);
							}
						}
					}
					else{
						if(Object.__defineSetter__){
							window[name].prototype[key]=public[key];
							Class[key]=window[name].prototype[key];
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
						else{
							Class[key]=public[key];
							div[key]=(function(Class){
								return Class[key];
							})(Class,key);
						}
					}
				}
				constructor.apply(Class,arguments);
				if(!Object.__defineSetter__){
					$(IEfix).append(div);
					div.name=name;
					div.Class=Class;
					div.onpropertychange=function(){
						var 	key=window.event.propertyName,
							val=window.event.srcElement[window.event.propertyName],
							name=this.name,
							Class=this.Class;
						if(typeof val!="function" && __GLOBAL__[name].public[key]){
							Class[key]=val;
						}
					}
					return div;
				}
			}
			window.__GLOBAL__=__GLOBAL__;
		}
/**
*
*	Выполняем обработку ошибок
*	0 - Отсутствует имя класса
*	1 - Отсутствует конструктор
*
**/
		catch(err){
			__GLOBAL__.__LOG__.push(err);
			window.__GLOBAL__=__GLOBAL__;
		}
	}
})($);