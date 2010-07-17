/**
* @fileoverview
* Пакет ООП утилит для jquery, в программе использован хак <a href="http://alex.dojotoolkit.org/08/jscript/lettable.html">dojo</a>.
* Тестируется в браузерах ie6, ie7, ie8, opera 10.60, chrome 4, firefox 3.6.6.
* @author <a href="mailto:zi.white.drago@gmail.com">Zi White</a>
* @version 0.0.3
*/
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
	error:[]
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
	IE:			window.ActiveXObject,
	/**
	* <b>Тип данных:</b> <i>Boolean</i>
	* <br/> Работаем в других браузерах
	*/
	MOZZILA:	Object.__defineSetter__ && Object.__defineGetter__
};
/**
* @class Это плагин для создания классического ООП в jquery
* @param {Object} object информация о методах и свойствах класса
* @throws <b>Exception</b> 0 Отсутствует или неверное имя класса
* @throws <b>Exception</b> 1 Отсутствует конструктор
* @throws <b>Exception</b> 2 Браузер не поддерживает не одну из прелогаемых моделей работы
* @throws <b>Exception</b> 3 Браузер семейства ie не поддерживает VBscript
* @throws <b>Exception</b> 4 Неверный тип свойства final
* @throws <b>Exception</b> 5 Некорректный сегмент public
* @throws <b>Exception</b> 6 Некорректный сегмент protected
* @example
* Class({
*	final:false,
*	extends:false,
* 	implements:false,
* 	name:"A",
*	constructor:function(a,b){},
*	public:{
*		sample:function(){}
*	},
*	protected:{},
*	private:{},
*	set:{},
*	get:{}
* }
* var instance=new A(123,123);
* instance.sample();
*/
Class=function(object){
	try{
		/**
		* @default <i>false</i>
		* @description
		* <b>Тип данных:</b> <i>Boolean</i>
		* <br/><b>Присутствие для нового класса:</b> <i>Необязательное</i>
		* <br/>Является ли класс финальным экземпляром, возможно ли его дальнейшее наследование 
		*/
		var final=false;
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
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/><b>Присутствие для нового класса:</b> <i>Обязательное</i>
		* <br/>Название класса, значение проверяется по regexp-маске /[a-z0-9_]/i
		*/
		var  name;
		if(!ClassModel.IE && !ClassModel.MOZZILA){
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
		else{
			throw({number:5,description:"Некорректный сегмент public"});
		}
		 if(typeof object.protected=="object"){
			 protected=object.protected;
		}
		else{
			throw({number:6,description:"Некорректный сегмент protected"});
		}
		for(var i=0;typeof object.implements=="array" && i<object.implements.length;i++){
			if(typeof object.implements[i]=="function"){
				implements.push(object.implements[i]);
			}
		}
// 		   
// 		    if(typeof object.private=="object")						private=object.private;
// 		    if(!window.__GLOBAL__ && model.IE){
// 				var VBClass_id=0;
// 		    }
// 		    if(window.__GLOBAL__ && model.IE){
// 				var VBClass_id=++window.__GLOBAL__.VBClass_id;
// 		    }
// 		    /**
// 		    *
// 		    *	Дополнительные переменные
// 		    *	Class - внутреня часть класса
// 		    *	i - итератор
// 		    *
// 		    **/
// 		    var	i=-1,
// 		    Class={},
// 		    publicClass={};
// 		    /**
// 		    *
// 		    *	Операции
// 		    *
// 		    **/
// 		    /**
// 		    *
// 		    *	Создаем глобальный объект с информацией о классе
// 		    *
// 		    **/
// 		    __GLOBAL__[name]={
// 		    public:public,
// 		    protected:protected,
// 		    private:private,
// 		    type:type,
// 		    final:final,
// 		    ext:ext,
// 		    name:name,
// 		    constructor:constructor
// 		    };
// 		    /**
// 		    *
// 		    *	ХАК для IE
// 		    *
// 		    **/
// 		    if(model.IE){
// 		    /**
// 		    *
// 		    *	Создаем iframe
// 		    *
// 		    **/
// 		    var	iframe=document.createElement("iframe"),
// 				ieFix={
// 					  iframeControl:null,
// 					  code:"",
// 					  evaluate:function(code, isObject){
// 						    return this.iframeControl.evaluate(code, !!isObject);
// 					  },
// 					  execute:function(code){
// 						    this.iframeControl.execute(code);
// 					  },
// 					  addProp:function(prop){
// 						    this.code="\tPublic "+prop;
// 					  },
// 					  addMethod:function(prop){
// 						    this.code="\tPublic "+prop;
// 					  },
// 					  addGet:function(prop){
// 						    this.code+=
// 						    "\tPublic Property Get "+prop+"\n"+
// 						    "\t\tDim proxy\n"+
// 						    "\t\tSet proxy = new TypeProxy\n"+
// 						    "\t\tproxy.load(get_"+prop+"(me))\n"+
// 						    "\t\tIf IsObject(proxy.value) Then\n"+
// 						    "\t\t\tSet "+prop+" = proxy.value\n"+
// 						    "\t\tElse\n"+
// 						    "\t\t\t"+prop+" = proxy.value\n"+
// 						    "\t\tEnd If\n"+
// 						    "\tEnd Property\n"+
// 						    "\tPublic get_"+prop+"\n";
// 					  },
// 					  addSet:function(prop){
// 						    this.code+=
// 						    "\tPublic Property Let "+prop+"(val)\n"+
// 						    "\t\tCall set_"+ prop +"(val)\n"+
// 						    "\tEnd Property\n"+
// 						    "\tPublic Property Set "+prop+"(val)\n"+
// 						    "\t\tCall set_"+prop+"(val)\n"+
// 						    "\tEnd Property\n"+
// 						    "\tPublic set_"+prop;
// 					  },
// 					  newVBClass:function(){
// 						    this.execute(
// 						    "Class Class_"+VBClass_id+"\n"+
// 						    this.code+
// 						    "\nEnd Class\n"
// 						    );
// 					  },
// 					  newIns:function(){
// 						    return this.evaluate("New Class_"+VBClass_id,true);
// 					  },
// 					  addTypeProxy:function(){
// 						    this.execute(
// 						    "Class TypeProxy\n"+
// 						    "\tPublic value\n"+
// 						    "\tPublic Function load(val)\n"+
// 						    "\t\tIf IsObject(val) Then\n"+
// 						    "\t\t\tSet value = val\n"+
// 						    "\t\tElse\n"+
// 						    "\t\t\tvalue = val\n"+
// 						    "\t\tEnd If\n"+
// 						    "\tEnd Function\n"+
// 						    "End Class\n"
// 						    );
// 					  }
// 				};
// 		    $(iframe).hide();
// 		    $("head").append(iframe);
// 		    ieFix.iframeControl=iframe.contentWindow;
// 		    ieFix.iframeControl.document.write(
// 		    "<html><head><title>VBiframe</title>\n"+
// 		    "<script type='text/vbscript'>\n"+
// 		    "Function execute(code)\nExecuteGlobal(code)\nEnd Function\n"+
// 		    "Function evaluate(code,isObject)\nIf isObject Then\nSet evaluate = Eval(code)\n"+
// 		    "Else\nevaluate = Eval(code)\nEnd If\nEnd Function\n"+
// 		    "</script>"+
// 		    "</head><body></body></html>"
// 		    );
// 		    ieFix.iframeControl.document.close();
// 		    ieFix.addTypeProxy();
// 		    try{
// 				ieFix.evaluate('true');
// 		    }
// 		    catch(e){
// 				throw(3);
// 		    }
// 		    }
// 		    /**
// 		    *
// 		    *	Создаем класс
// 		    *
// 		    **/
// 		    window[name]=function(){
// 		    if(model.IE){}
// 		    /**
// 		    *
// 		    *	Заполняем приватные свойства класса
// 		    *
// 		    **/
// 		    for(var key in private){
// 				if(typeof private[key]=="function"){
// 					  Class[key]=private[key];
// 				}
// 		    }
// 		    /**
// 		    *
// 		    *	Заполняем защищенные свойства классов
// 		    *
// 		    **/
// 		    for(var key in protected){
// 				if(typeof protected[key]=="function"){
// 					  Class[key]=protected[key];
// 				}
// 		    }
// 		    /**
// 		    *
// 		    *	Заполняем публичный свойства
// 		    *
// 		    **/
// 		    for(var key in public){
// 				if(typeof public[key]=="function"){
// 					  /**
// 					  *
// 					  *	Если модель поддерживает setter/getter в javascript, функции
// 					  *
// 					  **/
// 					  if(model.MOZZILA){
// 						    Class[key]=public[key];
// 						    var method=public[key];
// 						    window[name].prototype[key]=function(){
// 						    return method.apply(Class,arguments);
// 						    }
// 					  }
// 					  /**
// 					  *
// 					  *	если не поддерживает
// 					  *
// 					  **/
// 					  else{
// 						    Class[key]=public[key];
// 						    var method=public[key];
// 					  }
// 				}
// 				else{
// 					  /**
// 					  *
// 					  *	Если это свойство
// 					  *
// 					  **/
// 					  if(model.MOZZILA){
// 						    window[name].prototype[key]=public[key];
// 						    Class[key]=window[name].prototype[key];
// 						    /**
// 						    *
// 						    *	вешаем setter/getter в браузерах поддерживающих getter, setter
// 						    *
// 						    **/
// 						    (function(key,name,Class){
// 						    window[name].prototype.__defineGetter__(key,function(prop){
// 								if(__GLOBAL__[name].public[key] && typeof val!="function"){
// 									  return Class[key];
// 								}
// 						    });
// 						    window[name].prototype.__defineSetter__(key,function(val){
// 								if(__GLOBAL__[name].public[key] && typeof val!="function"){
// 									  Class[key]=val;
// 								}
// 						    });
// 						    })(key,name,Class);
// 					  }
// 					  /**
// 					  *
// 					  *	
// 					  *
// 					  **/
// 					  else{
// 					  }
// 				}
// 		    }
// 		    /**
// 		    *
// 		    *	
// 		    *
// 		    **/
// 		    constructor.apply(Class,arguments);
// 		    /**
// 		    *
// 		    *	
// 		    *
// 		    **/
// 		    window.__GLOBAL__=__GLOBAL__;
// 		    if(model.IE){
// 				ieFix.newVBClass();
// 		    }
// 		    }
	  }
	  catch(err){
		    __Class__.error.push(err);
		    if(console) console.log(__Class__.error);
	  }
}