/**
* @fileoverview
* Набор функционала для анимации свойств DOM-элементов с поддержкой относительных ускорения и траектории движения.
* @author <a href="mailto:Numinos@overkin.net">Numinos X</a>
* @version 0.0.1
*/
/**
* @namespace
* Пакет предоставляет набор утилит для анимации свойств DOM-элементов с поддержкой относительных ускорения и траектории движения.
* @description
* <b>Тип данных:</b> <i>Object</i>
*/
var motion={};
/**
* @name Animation
* @class
* Класс управления анимируемыми инстансами 
* @memberOf animation
* @description
*/
Class({
	name : "Animator",
	pack : motion,
	/**
	* @name constructor
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor : function(object, params){
		object.each(function(){
			temp = new motion.Instance($(this), params);
		});
	},
	public : {},
	protected : {
		instances : {},
		animate : function(){
			
		},
		update : function (targetObject, property, val){
			console.log('changing '+property+' to '+val);
			targetObject.css(property, val);
		},
		tweeningArray : function (first, last, step){
			var a = [];
			for (var i = first; i<=last; i += step){
				a.push(i);
			}
			return a;
		},
		step : function (first, last, interval, duration){
			console.log(first+' '+last+' '+interval+' '+duration);
			var step = (last-first)*interval/duration;
			return step;
		}
	},
	private : {
		
	}
});
/**
* @name Intance
* @class
* Класс, отвечающий за анимацию определенного свойства.
* @memberOf animation
* @description
*/
Class({
	name : "Instance",
	pack : motion,
	parent : motion.Animator,
	constructor : function(object, params) {
		this.property = params.property;
		var initialValue = (params.initialValue == undefined) ? object.css(this.property) : params.initialValue;

		var finalValue = params.finalValue || console.log('Не задано финальное значение анимируемого свойства');
		var interval = params.interval || this.defaultInterval;
		var duration = params.duration || this.defaultDuration;
		
		this.targetObject = object;
		this.step = this.parent.step(initialValue, finalValue, interval, duration);
		this.array = this.parent.tweeningArray(initialValue, finalValue, this.step);
		console.log( this.array.length);
		this.timer = new tools.Timer(interval, this.array.length);
		this.timer.bind('timer', this.tick);
		this.timer.start();
	},
	private : {
		defaultInterval : 10,
		defaultDuration : 1000,
		step : 0,
		array : [],
		nowAt : 0,
		timer : {},
		targetObject : {},
		property : "",
		tick : function (){
			console.log('tick');
			this.parent.update(this.targetObject, this.property, this.array[this.nowAt]);
			this.nowAt++;
		}
	}
})