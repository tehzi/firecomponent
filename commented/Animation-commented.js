/**
* @fileoverview
* Набор функционала для анимации свойств DOM-элементов с поддержкой относительных ускорения и траектории движения.
* @author <a href="mailto:Numinos@overkin.net">Numinos X</a>
* @version 0.0.1
*/
/**
* @name Animation
* @class
* Класс управления анимируемыми инстансами 
* @description
*/
Class({
	name : "Animation",
	/**
	* @name constructor
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor : function(object, params){
		object.each(function(){
			temp = new Animation.instance($(this), params);
		});
	},
	public : {},
	protected : {
		instances : {},
		animate : function(){
			
		},
		defaultInterval = 10,
		defaultDuration = 1000,
		update : function (targetObject, property, val){
			targetObject.css(property, val);
		}
		tweeningArray = function (first, last, step){
			var a = [];
			for (var i = first; i<=last, i += step){
				a[] = i;
			}
			return a;
		},
		step : function (first, last, interval, duration){
			var step = (last-first)*interval/duration;
			return step;
		}
	},
	private : {
		
	}
});
Class({
	name : "instance",
	pack : "Animation",
	parent : "Animation",
	constructor : function(object, params) {
		var prop = params.property;
		var initialValue = params.initialValue || object.css(prop);
		var finalValue = params.finalValue || console.log('Не задано финальное значение анимируемого свойства');
		var interval = params.interval || defaultInterval;
		var duration = params.duration || defaultDuration;
		
		this.targetObject = object;
		this.step = this.parent.step(initialValue, finalValue, interval, duration);
		this.array = this.parent.tweeningArray(initialValue, finalValue, this.step);
		this.timer = new Timer(interval, this.array.length);
		this.timer.bind('timer', this.tick());
	},
	private : {
		step : 0,
		array : [],
		nowAt : 0,
		timer : {},
		targetObject : {},
		tick : function (){
			this.parent.update(this.targetObject, this.property, this.array[this.nowAt]);
			this.nowAt += 1;
		}
	}
})