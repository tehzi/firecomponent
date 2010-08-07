/**
* @fileoverview
* Пакет содержит набор утилит разработаных для проекта firecomponent
*/
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
		IE6:"~this.IE && this.intertrigoBrowserVersion()=='6.0'~",
		/**
		* @name IE7
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 7 версии
		*/
		IE7:"~this.IE && this.intertrigoBrowserVersion()=='7.0'~",
		/**
		* @name IE8
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 8 версии
		*/
		IE8:"~this.IE && this.intertrigoBrowserVersion()=='8.0'~",
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
		* @name browserVersion
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Возвращает строку c версией браузера
		*/
		browserVersion:"~this.intertrigoBrowserVersion()~"
	},
	protected:{
		/**
		* @name intertrigoBrowserVersion
		* @function
		* @memberOf tools.browser
		* @type String
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Определяет версию браузера
		*/
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
		* @param _event {String} Имя события
		* @param _function {Mixed} Ссылка на фунцию
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
		* @param _event {String} Имя события
		* @param _function {Mixed} Ссылка на фунцию
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
			}
		}
	},
	protected:{
		/**
		* @name eventList
		* @memberOf tools.eventDispatcher
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Список событий объекта
		*/
		eventList:[],
		/**
		* @name eventAll
		* @memberOf tools.eventDispatcher
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
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
	* @param delay Задержка в миллисекундах между событиями таймера.
	* @param repeatCount Общее число запусков, на которое настроен таймер.
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
		* <br/>Общее число срабатываний таймера с момента его запуска с нуля.
		*/
		currentCount:0,
		/**
		* @name delay
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Задержка в миллисекундах между событиями таймера.
		*/
		delay:0,
		/**
		* @name repeatCount
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Общее число запусков, на которое настроен таймер.
		*/
		repeatCount:0,
		/**
		* @name running
		* @memberOf tools.Timer
		* @default false
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Текущее состояние таймера: если таймер выполняется, то true, в противном случае false.
		*/
		running:false,
		/**
		* @name start
		* @memberOf tools.Timer
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
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
		* <br/>Список событий таймера
		*/
		eventList:["timer","timerComplete"]
	},
	private:{
		/**
		* @name eventList
		* @memberOf tools.Timer
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Номер Интервала
		*/
		timeLink:null,
		/**
		* @name timeExec
		* @function
		* @memberOf tools.eventDispatcher
		* <b>Область видимости</b> : <i>Приватная</i>
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