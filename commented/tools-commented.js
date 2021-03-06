/**
* @fileoverview
* Пакет содержит набор утилит разработаных для проекта firecomponent
* @author <a href="mailto:zi.white.drago@gmail.com">zi white</a>
* @version 0.1.10, $Revision$
*/
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
if(!String.prototype.go){
	String.prototype.go=function(){
		location.href=this;
	}
}
if(!Array.prototype.fullMask){
	Array.prototype.fullMask=function(){
		var ret=0;
		for(var i=0;i<this.length;i++){
			if(typeof this[i]=="number"){
				ret|=this[i];
			}
		}
		return ret;
	}
}
if(!Array.prototype.forEach){
	Array.prototype.forEach=function(callback,object){
		for(var i=0;i<this.length && typeof callback=='function';i++) if(callback.call(typeof object=='object'?object:window,this[i],i,this));
	}
}
if(!Array.prototype.filter){
	Array.prototype.filter=function(callback,object){
		var arr=[];
		for(var i=0;i<this.length && typeof callback=='function';i++){
			if(callback.call(typeof object=='object'?object:window,this[i],i,this)){
				arr.push(this[i]);
			}
		}
		return arr;
	}
}
if(!Array.prototype.indexOf){
	Array.prototype.indexOf=function(elemToSearch,fromIndex){
		for(fromIndex=(fromIndex?fromIndex<0?Math.max(0,this.length+fromIndex):fromIndex:0);fromIndex<this.length;fromIndex++){
			if(fromIndex in this && this[fromIndex]===elemToSearch) return fromIndex;
		}
		return -1;
	}
}
/**
* @namespace
* Пакет предоставляет набор утилит для проекта firecomponent
* @description
* <b>Тип данных:</b> <i>Object</i>
*/
var tools={};
/**
* @name browser
* @class
* Интерфейс, предоставляющий информацию для работы с текущей версией браузера
* @memberOf tools
* @example
* 	Class({
*		name:"some",
*		implements:[tools.browser],
*		constructor:function(){}
*	});
*	alert(new some().IE)
* @description
*/
Class({
	name:"browser",
	type:"interface",
	pack:tools,
	/**
	* @name constructor
	* @memberOf tools.browser
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor:function(){},
	public:{
		/**
		* @name browser
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/><b>Значение:</b> <i>Another/Firefox/Opera/Safari/Chrome/Internet Explorer</i>
		* <br/>Возвращает строку с названием браузера
		*/
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
		/**
		* @name Opera
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Oper'ой
		*/
		Opera:"~this.browser=='Opera'~",
		/**
		* @name Firefox
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Firefox'ом
		*/
		Firefox:"~this.browser=='Firefox'~",
		/**
		* @name Chrome
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Chrome'ом
		*/
		Chrome:"~this.browser=='Chrome'~",
		/**
		* @name Safari
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Safari
		*/
		Safari:"~this.browser=='Safari'~",
		/**
		* @name IE
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер членом семейства Internet Explorer
		*/
		IE:"~this.browser=='Internet Explorer'~",
		/**
		* @name IE6
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 6 версии
		*/
		IE6:"~this.IE && this.intertrigoBrowserVersion()==6~",
		/**
		* @name IE7
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 7 версии
		*/
		IE7:"~this.IE && this.intertrigoBrowserVersion()==7~",
		/**
		* @name IE8
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 8 версии
		*/
		IE8:"~this.IE && this.intertrigoBrowserVersion()==8~",
		/**
		* @name IE9
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 9 версии
		*/
		IE9:"~this.IE && this.intertrigoBrowserVersion()==9~",
		/**
		* @name browserVersion
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Float</i>
		* <br/>Возвращает число с точкой аналогичное версии браузера
		*/
		browserVersion:"~this.intertrigoBrowserVersion()~",
		/**
		* @name v
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Float</i>
		* <br/>Возвращает число с точкой аналогичное версии браузера
		*/
		v:"~this.browserVersion~",
		/**
		* @name IEMask
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Array</i>
		* <br/>Число с битами всех поддерживаемых версий интернет эксплорера
		*/
		IEMask:"~this.IEMaskArray.fullMask()~",
		/**
		* @name IE6Id
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Итендификатор ie6
		*/
		IE6Id:"~this.IEMaskArray[0]~",
		/**
		* @name IE7Id
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Итендификатор ie7
		*/
		IE7Id:"~this.IEMaskArray[1]~",
		/**
		* @name IE8Id
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Итендификатор ie8
		*/
		IE8Id:"~this.IEMaskArray[2]~",
		/**
		* @name IE9Id
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Итендификатор ie9
		*/
		IE9Id:"~this.IEMaskArray[3]~",
		/**
		* @name currentIEId
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Текущий итендификатор ie
		*/
		currentIEId:"~this.detectIEId()~",
		/**
		* @name browser_engine
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Возвращает строку с версией браузера
		*/
		browser_engine:"~this.detect_browser_engine()~",
		/**
		* @name gecko
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Возвращает true, если движок gecko
		*/
		gecko:"~this.detect_browser_engine()=='gecko'~",
		/**
		* @name presto
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Возвращает true, если движок presto
		*/
		presto:"~this.detect_browser_engine()=='presto'~",
		/**
		* @name webkit
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Возвращает true, если движок webkit
		*/
		webkit:"~this.detect_browser_engine()=='webkit'~",
		/**
		* @name khtml
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Возвращает true, если движок khtml
		*/
		khtml:"~this.detect_browser_engine()=='khtml'~",
		/**
		* @name trident
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Возвращает true, если движок trident
		*/
		trident:"~this.detect_browser_engine()=='trident'~"
	},
	protected:{
		/**
		* @name IEMaskArray
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Array</i>
		* <br/>Массив данных содержащий битовые обозначения браузеров.
		* Первый эллемент ie6, второй ie7 и тд.
		*/
		IEMaskArray:[
			0x00000001,
			0x00000002,
			0x00000004,
			0x00000008
		],
		/**
		* @name intertrigoBrowserVersion
		* @function
		* @memberOf tools.browser
		* @type float
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Определяет версию браузера
		*/
		intertrigoBrowserVersion:function(){
			var version="None";
			var agent=navigator.userAgent.toLowerCase();
			if(this.IE){
				var version_detect=agent.match(/msie ([0-9]+\.[0-9]+)/i);
			}
			if(this.Opera){
				var version_detect=window.opera.version();
			}
			if(this.Firefox){
				var version_detect=agent.match(/firefox\/([0-9]+\.[0-9]+\.[0-9]+)/i);
				if(!version_detect){
					var version_detect=agent.match(/firefox\/([0-9]+\.[0-9]+)/i);
				}
			}
			if(this.Chrome){
				var version_detect=agent.match(/chrome\/([0-9]+\.[0-9]+)/i);
			}
			if(this.Safari){
				var version_detect=agent.match(/version\/([0-9]+\.[0-9]+)/i);
			}
			if(version_detect){
				if(version_detect[1] && typeof version_detect=="object"){
					version=version_detect[1].replace(/^([0-9]+\.[0-9]+)\.([0-9]+)/,"$100$2");
				}
				else{
					version=version_detect;
				}
			}
			return parseFloat(version);
		},
		/**
		* @name detectIEId
		* @function
		* @memberOf tools.browser
		* @type Number
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Определяет id Браузера ie
		*/
		detectIEId:function(){
			if(this.IE){
				if(this.IE9){
					return this.IEMaskArray[3];
				}
				if(this.IE8){
					return this.IEMaskArray[2];
				}
				if(this.IE7){
					return this.IEMaskArray[1];
				}
				if(this.IE6){
					return this.IEMaskArray[0];
				}
			}
			return 0;
		},
		/**
		* @name detect_browser_engine
		* @function
		* @memberOf tools.browser
		* @type String
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Опеределяет движок браузера
		*/
		detect_browser_engine:function(){
			var detect='none';
			if(detecting=navigator.userAgent.match(/(gecko|presto|webkit|khtml|trident)/i)){
				detect=detecting[0].toLowerCase();
			}
			return detect;
		}
	}
});
/**
* @name eventDispatcher
* @class
* Абстрактный класс для добавление в другие классы функций предоставляющих создание и обработку пользовательских событий
* @memberOf tools
* @description
*/
Class({
	pack:tools,
	name:"eventDispatcher",
	/**
	* @name constructor
	* @memberOf tools.eventDispatcher
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	* <br/>Заполняет внутренний объект содержащий информацию о событиях в классе
	*/
	constructor:function(){
		this.eventAll={};
		for(var i=0;i<this.eventList.length;i++){
			this.eventAll[this.eventList[i]]=[];
		}
	},
	public:{
		/**
		* @name bind
		* @function
		* @memberOf tools.eventDispatcher
		* @param {String} _event  Имя события
		* @param {Mixed} _function Ссылка на фунцию
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Добавляет обработчик события
		*/
		bind:function(_event,_function){
			if(typeof _event=="string" && typeof _function=="function"){
				if(this.eventAll[_event]){
					this.eventAll[_event].push(_function);
					$(this).bind(_event,_function);
				}
			}
		},
		/**
		* @name unbind
		* @function
		* @memberOf tools.eventDispatcher
		* @param {String} _event Имя события
		* @param {Mixed} _function Ссылка на фунцию
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/> Удаляет обработчик события
		*/
		unbind:function(_event,_function){
			if(typeof _event=="string" && typeof _function=="function"){
				if(this.eventAll[_event]){
					this.eventAll[_event]=$.grep(this.eventAll[_event],function(key,i){
 						return key!==_function;
					});
					$(this).unbind(_event,_function);
				}
				return;
			}
			if(typeof _event=="string" && arguments.length==1){
				$(this).unbind(_event);
			}
		}
	},
	protected:{
		/**
		* @name eventList
		* @memberOf tools.eventDispatcher
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Array</i>
		* <br/>Список событий объекта
		*/
		eventList:[],
		/**
		* @name eventAll
		* @memberOf tools.eventDispatcher
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Object</i>
		* <br/>Хранилище для событий
		*/
		eventAll:{},
		/**
		* @name dispatch
		* @function
		* @memberOf tools.eventDispatcher
		* @param {String} _event Название события
		* @param {Array} _arr Список аргументов функции
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Выбрасывает новое событие в поток событий
		*/
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
/**
* @name Timer
* @class
* Простой таймер облегчающий работу с периодичными функциями
* @memberOf tools
* @description
* <br/><b>Наследует</b> : <i>tools.eventDispatcher</i>
* <br/><b>Событие</b> : <i>timer</i>
* <br/>Срабатывает каждые this.delay миллисекунд
* <br/><b>Событие</b> : <i>timerComplete</i>
* <br/>Срабатывает когда таймер пройдет количество циклов указанной в переменной repeatCount
* @example
* // Таймер повторится 5 раз с интервало в 2 секунды
* var timer=new tools.Timer(2000,5);
* // Каждые 2 секунды
* timer.bind("timer",function(){
* 	//do somethink
* });
* // В конце 5-го цикла
* timer.bind("timerComplete",function(){
* 	//do somethink
* });
* timer.start();
*/
Class({
	pack:tools,
	parent:tools.eventDispatcher,
	name:"Timer",
	/**
	* @name constructor
	* @memberOf tools.Timer
	* @function
	* @param {Number} delay Задержка в миллисекундах между событиями таймера.
	* @param {Number} repeatCount Общее число запусков, на которое настроен таймер.
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
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
		/**
		* @name currentCount
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Int</i>
		* <br/>Общее число срабатываний таймера с момента его запуска с нуля.
		*/
		currentCount:0,
		/**
		* @name delay
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Int</i>
		* <br/>Задержка в миллисекундах между событиями таймера.
		*/
		delay:0,
		/**
		* @name repeatCount
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Int</i>
		* <br/>Общее число запусков, на которое настроен таймер.
		*/
		repeatCount:0,
		/**
		* @name running
		* @memberOf tools.Timer
		* @default false
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Текущее состояние таймера: если таймер выполняется, то true, в противном случае false.
		*/
		running:false,
		/**
		* @name start
		* @memberOf tools.Timer
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Запускает таймер
		*/
		start:function(){
			if(this.delay>0){
				this.currentCount=0;
				this.running=true;
				this.timeLink=setInterval(this.timeExec,this.delay);
			}
		},
		/**
		* @name halt
		* @memberOf tools.Timer
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Останавливает таймер
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/><i>Примечание: свойтсво stop недоступно в ie</i>
		*/
		halt:function(){
			this.running=false;
			clearInterval(this.timeLink);
		}
	},
	protected:{
		/**
		* @name eventList
		* @memberOf tools.Timer
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Array</i>
		* <br/>Список событий таймера
		*/
		eventList:["timer","timerComplete"]
	},
	private:{
		/**
		* @name timeLink
		* @memberOf tools.Timer
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Mixed</i>
		* <br/>Номер Интервала
		*/
		timeLink:null,
		/**
		* @name timeExec
		* @function
		* @memberOf tools.eventDispatcher
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Вызывается каждые delay милисекунд
		*/
		timeExec:function(){
			this.dispatch("timer",[++this.currentCount]);
			if(this.repeatCount>0 && this.currentCount==this.repeatCount){
				this.dispatch("timerComplete",[this.currentCount]);
				this.halt();
			}
		}
	}
});
/**
* @name CookieManager
* @class
* Управление cookie для проекта firecomponent
* @memberOf tools
* @description
* <br/><b>Наследует</b> : <i>tools.eventDispatcher</i>
* <br/><b>Событие</b> : <i>change</i>
* Срабатывает при внешнем изменение cookie
* <br/><b>Событие</b> : <i>add</i>
* Срабатывает при внутреннем добавлении cookie
* <br/><b>Событие</b> : <i>remove</i>
* Срабатывает при внутреннем удалении cookie
* @example
* // Создаем новую копию класса для управления cookie
* var cookie=new tools.CookieManager();
* // Добавляем событие прослушивающая внешние изменения cookie
* cookie.bind("change",function(e,newC,old){
*	//do somethink
* });
* // Внутренние добавление куки
* cookie.bind("add",function(e,key,val){
*	//do somethink
* });
* // Добавляем новую куки
* cookie.add("sample",123);
* cookie.val("sample1",123);
* // Управление датой m - минуты, h - часы, d - дни, w - недели, M - месяцы, Y - годы.
* cookie.add={name:"sample2",val:123,date:"+10h +5w",path:"/"};
* // Получаем значение
* cookie.val("sample1");
* cookie.ls["sample1"];
* // Удаляем куки
* cookie.remove("sample1");
* cookie.rm("sample");
*/
Class({
	name:"CookieManager",
	pack:tools,
	parent:tools.eventDispatcher,
	final:true,
	/**
	* @name constructor
	* @memberOf tools.CookieManager
	* @function
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	* Создает список куки, события и вызывает проверку на изменения куки каждую секунду.
	*/
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
		/**
		* @name ls
		* @memberOf tools.CookieManager
		* @default new Object()
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Object</i>
		* <br/>Список всех куки
		*/
		ls:{},
		/**
		* @name defaultTime
		* @memberOf tools.CookieManager
		* @default "Mon, 01-Jan-2020 00:00:00 GMT"
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Время, когда создаётся куки, по-умолчанию
		*/
		defaultTime:"Mon, 01-Jan-2020 00:00:00 GMT",
		/**
		* @name defaultPath
		* @memberOf tools.CookieManager
		* @default "/"
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Путь, где создаётся куки, по-умолчанию
		*/
		defaultPath:"/",
		/**
		* @name rm
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Синоним для this._remove
		* @see tools.CookieManager#_remove
		*/
		rm:"~this._remove~",
		/**
		* @name val^1
		* @memberOf tools.CookieManager
		* @function
		* @param {String} name Имя получаемой куки
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Null|String</i>
		* <br/> Получения значение куки с именем name
		*/
		/**
		* @name val^2
		* @memberOf tools.CookieManager
		* @function
		* @param {String} name Имя устанавливаемой куки
		* @param {String} val Значения устанавливаемой куки
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Null</i>
		* <br/>Сидоним для add
		* @see tools.CookieManager#add
		*/
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
		/**
		* @name add
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Возвращает приватный метод _add/Устанавливает куки из пользовательского объекта
		*/
		add:function(key){
			return this._add;
		},
		/**
		* @name remove
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Возвращает приватный метод _remove/Удаляет куки с именем key
		*/
		remove:function(key){
			return this._remove;
		},
		/**
		* @name cookieEnabled
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter</i>
		* <br/>Проверяет включены ли в браузере куки
		*/
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
		/**
		* @name eventList
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Array</i>
		* <br/>Список событий куки
		*/
		eventList:["change","add","remove"]
	},
	private:{
		/**
		* @name oldCookieString
		* @memberOf tools.CookieManager
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Строка со старым значением куки
		*/
		oldCookieString:"",
		/**
		* @name timer
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Timer</i>
		* <br/>Содержит инсталированный таймер
		*/
		timer:new tools.Timer(1000),
		/**
		* @name cookieEvent
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Событие срабатывающее каждую секунду и проверяющая валидность куки строке oldCookieString
		*/
		cookieEvent:function(e){
			if(this.oldCookieString!=document.cookie){
				this.dispatch("change",[document.cookie,this.oldCookieString]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		/**
		* @name _add
		* @memberOf tools.CookieManager
		* @function
		* @param {String} name Имя куки
		* @param {String} val Значение куки
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Добавляет куки
		*/
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
		/**
		* @name _remove
		* @memberOf tools.CookieManager
		* @function
		* @param {String} name Имя куки
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Удаляет куки
		*/
		_remove:function(name){
			if(typeof name=="string"){
				var expireAt = new Date(1970,1);
				document.cookie=unescape(name)+ "= 0;  path=/;  expires="+expireAt.toGMTString();
				this.dispatch("remove",[name]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		/**
		* @name lsCreate
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Создаёт список всех куки
		*/
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
		/**
		* @name parseTime
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Вычисляет время согласно внутреннем селекторам.
		*/
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
/**
* @name Url
* @class
* Управление адресом
* @memberOf tools
* @description
* <br/><b>Наследует</b> : <i>tools.eventDispatcher</i>
* <br/><b>Событие</b> : <i>hash</i>
* Срабатывает при изменение hash-адреса
* <br/>Парсинг и управление адресом страницы или пользовательским адресом,
* событие изменение hash адреса, переход на другие страницы
* @example
* // Создаем копию класса
* var url=new tools.Url("http://example.com/path/#.currentCount");
* // Меняем протокол
* url.scheme="ftp";
* // Переходим по адресу
* url.go();
*/
Class({
	name:"Url",
	pack:tools,
	parent:tools.eventDispatcher,
	final:true,
	/**
	* @name constructor^0
	* @memberOf tools.Url
	* @function
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*  Запускает проверку hash браузера, производит парсинг адреса страницы
	*/
	/**
	* @name constructor^1
	* @memberOf tools.Url
	* @function
	* @param {String} url Пользовательский url
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*  Запускает проверку hash браузера, производит парсинг пользовательского адреса
	*/
	constructor:function(url){
		this.Super();
		this._url=url || location.href;
		this.parseUrl();
		this.timer.bind("timer",this.hashEvent);
		this.timer.start();
	},
	public:{
		/**
		* @name go
		* @memberOf tools.Url
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		*/
		go:function(){
			if(this._url){
				location.href=this._url;
			}
		}
	},
	get:{
		/**
		* @name scheme
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _scheme
		*/
		scheme:function(key){
			return this._scheme;
		},
		/**
		* @name user
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _user
		*/
		user:function(key){
			return this._user;
		},
		/**
		* @name password
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _password
		*/
		password:function(key){
			return this._password;
		},
		/**
		* @name host
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _host
		*/
		host:function(key){
			return this._host;
		},
		/**
		* @name port
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _port
		*/
		port:function(key){
			return this._port;
		},
		/**
		* @name directory
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _directory
		*/
		directory:function(key){
			return this._directory;
		},
		/**
		* @name file
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _file
		*/
		file:function(key){
			return this._file;
		},
		/**
		* @name query
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _query
		*/
		query:function(key){
			return this._query;
		},
		/**
		* @name hash
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _hash
		*/
		hash:function(key){
			return this._hash;
		},
		/**
		* @name url
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Осуществляет доступ к приватному свойству _url
		*/
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
		/**
		* @name eventList
		* @memberOf tools.Url
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Array</i>
		* <br/>Список событий урл
		*/
		eventList:["hash"]
	},
	private:{
		/**
		* @name timer
		* @memberOf tools.Url
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Timer</i>
		* <br/>Таймер каждую секунду проверяющий соответствие хешь страницы значению сохраненному в строке класса
		*/
		timer:new tools.Timer(1000),
		/**
		* @name hashEvent
		* @memberOf tools.Url
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Событие срабатывающее каждую секунду и проверяющее хэш адреса страницы
		*/
		hashEvent:function(e){
			if(this.stdHash!=location.hash){
				this.dispatch("hash",[this.stdHash,location.hash]);
				this.stdHash=location.hash;
			}
		},
		/**
		* @name _scheme
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Строка содержащие информации о протоколе адреса
		*/
		_scheme:"",
		/**
		* @name _user
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Строка содержит или пустое значение или имя пользователя под которым он будет осуществлять вход в указанном адресе
		*/
		_user:"",
		/**
		* @name _password
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Пароль пользователя или пустая строка
		*/
		_password:"",
		/**
		* @name _host
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Информации о имени хоста
		*/
		_host:"",
		/**
		* @name _port
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Адрес порта, который указан в адресе урл
		*/
		_port:"",
		/**
		* @name _directory
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Часть отвечающая за папку в адресе
		*/
		_directory:"",
		/**
		* @name _file
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Часть отвечающая за файл в адресе или пустая строка
		*/
		_file:"",
		/**
		* @name _query
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Часть отвечающая за поиск в скрипте
		*/
		_query:"",
		/**
		* @name _hash
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Хэш пользовательского урл
		*/
		_hash:"",
		/**
		* @name _url
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Полный урл
		*/
		_url:"",
		/**
		* @name stdHash
		* @memberOf tools.Url
		* @default zero string
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Содержит начальный хэш страницы
		*/
		stdHash:location.hash,
		/**
		* @name parseUrl
		* @memberOf tools.Url
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Заполняет объект this значениями урл
		*/
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
		/**
		* @name urlReload
		* @memberOf tools.Url
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Перезагружает значение урл
		*/
		urlReload:function(){
			this._url=
				this._scheme+"://"+
				(!!this._user && !!this._password ? this._user+":"+this._password+"@" : "")+
				this._host+this._directory+this._file+
				(!!this._query ? "?"+this._query : "")+
				(this._hash ? "#"+this._hash : "");
		}
	}
});
/**
* @name Platform
* @class
* Информации о платформе на которой запущен скрипт
* @memberOf tools
* @example
* // return name of user platform
* alert(tools.Platform.name);
* @description
*/
Class({
	name:"Platform",
	type:"interface",
	pack:tools,
	/**
	* @name constructor
	* @memberOf tools.Platform
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor:function(){},
	public:{
		/**
		* @name name
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/><b>Значение:</b> <i>Linux/FreeBSD/Mac/Win/SunOS/iPod/Other</i>
		* <br/>Возвращает имя пользовательской оси или строку Other
		*/
		name:(function(){
			var name=navigator.platform.match(/(Linux|FreeBSD|Mac|Win|SunOS)/i);
			if(name[1]){
				return name[1];
			}
			else{
				return (window.orientation != undefined) ? "iPod" : "Other";
			}
		})(),
		/**
		* @name linux
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>true, если линукс
		*/
		linux:(navigator.platform.indexOf("Linux") != -1),
		/**
		* @name freebsd
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>true, если freebsd
		*/
		freebsd:(navigator.platform.indexOf("FreeBSD") != -1),
		/**
		* @name mac
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>true, если mac
		*/
		mac: (navigator.platform.indexOf("Mac") != -1),
		/**
		* @name windows
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>true, если windows
		*/
		windows:(navigator.platform.indexOf("Win") != -1),
		/**
		* @name ipod
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>true, если ipod
		*/
		ipod:(window.orientation != undefined),
		/**
		* @name other
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>true, если не одна из осей включенных в интерфейс
		*/
		other:"~!(this.linux || this.freebsd || this.mac || this.windows || this.ipod || this.sun)~",
		/**
		* @name sun
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>true, если sun
		*/
		sun:(navigator.platform.indexOf("SunOS") != -1),
		/**
		* @name arch
		* @memberOf tools.Platform
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/><b>Значение:</b> <i>i586/x86_64/Other</i>
		* <br/>Значение архитектуры пользовательской машины
		*/
		arch:(function(){
			switch(true){
				case !!(navigator.platform.match(/32|i586/i)):{
					return "i586";
				}
				break;
				case !!(navigator.platform.match(/64/i)):{
					return "x86_64";
				}
				break;
				default:{
					return "Other";
				}
			}
			console.log(arch32,arch64)
		})()
	}
});
/**
* @name Flash
* @class
* Информация о поддержки flash в браузере
* @memberOf tools
* @example
* // return boolean-like information about enable flash in browser
* alert(tools.Flash.enable);
* @description
*/
Class({
	name:"Flash",
	type:"interface",
	pack:tools,
	/**
	* @name constructor
	* @memberOf tools.Flash
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor:function(){},
	public:{
		/**
		* @name enable
		* @memberOf tools.Flash
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Возвращает true, если в браузере включен flash player
		*/
		enable:(function(){
			try{
				if(tools.browser.IE){
					if(!!(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'))){
						return true;
					}
				}
				else{
					return !!(navigator.plugins['Shockwave Flash']);
				}
			}
			catch(err){
				return false;
			}
		})(),
		/**
		* @name version
		* @memberOf tools.Flash
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Вызывает защищенную функцию данного объекта и возвращает версию флэш плэйера
		*/
		version:"~this._version()~"
	},
	protected:{
		/**
		* @name _version
		* @memberOf tools.Flash
		* @function
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/><b>Тип данных:</b> <i>Number</i>
		* <br/>Возвращает версию флэш плэйера
		*/
		_version:function(){
			if(this.enable){
				if(tools.browser.IE){
					var ActiveX=new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').match(/\d+/g);
					if(ActiveX[0] && ActiveX[1]){
						return parseFloat(ActiveX[0]+"."+ActiveX[1]);
					}
					else{
						return ActiveX[0];
					}
				}
				else{
					var StdX=navigator.plugins['Shockwave Flash'].description.match(/\d+/g);
					if(StdX[0] && StdX[1]){
						return parseFloat(StdX[0]+"."+StdX[1]);
					}
					else{
						return StdX[0];
					}
				}
			}
			else{
				return 0;
			}
		}
	}
});