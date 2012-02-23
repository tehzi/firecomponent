/*
 * Classical | JavaScript Classical Inheritance
 *
 * Credits:
 * http://alex.dojotoolkit.org/08/jscript/lettable.html
 * http://trac.dojotoolkit.org/browser/dojox/trunk/lang/observable.js?rev=14129
 *
 */
 
//[TODO] explore constructor chain; properties of multiple inheritance; interfaces
 
(function () {
        /*
         * Class capabilities
         */
         
        // capabilities detection
        var capabilities = {
                gs: Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__,
                vb: window.ActiveXObject
        }
        // throw error if browser is incapable
        if (!capabilities.gs && !capabilities.vb)
                throw new Error('The current browser does not support classes.');
       
        /*
         * Hash function
         */
         
        // hash object
        var Hash = function (wrap) {
                var closure = this;
                if (wrap)
                        Hash.prototype.iterate.call(wrap, function (value, prop) {
                                closure[prop] = value;
                        });
        }
        Hash.prototype.iterate = function (callback) {
                // evaluate all defined properties
                for (var prop in this)
                        if (Object.prototype.hasOwnProperty.call(this, prop))
                                callback(this[prop], prop);
       
                // IE has dontEnum issues
                var dontenums = 'constructor|toString|valueOf|toLocaleString|isPrototypeOf|propertyIsEnumerable|hasOwnProperty'.split('|');
                for (var prop; prop = dontenums.pop(); )
                        if (Object.prototype.hasOwnProperty.call(this, prop) && !Object.prototype.propertyIsEnumerable.call(this, prop))
                                callback(this[prop], prop);
        }
       
        /*
         * Class modeling
         */

        // factory variables
//[TODO] uniqID
        var uniqID = 0;
       
        function Scope()
        {
                this.methods = new Hash();
                this.properties = new Hash();
                this.getters = new Hash();
                this.setters = new Hash();
        }

        function Implementation(classID, inherit)
        {
                this.classID = classID;
                this.scopes = {
                        'public': new Scope(),
                        'private': new Scope()
                };
                this.inherit = inherit;
                this.constructor = null;
                this.cast = null;
        }
       
        function Property(value)
        {
                this.generate = function (obj) {
                        // property wrapper
                        return value;
                }
        }
       
        function Method(func)
        {
                this.generate = function (obj) {
                        // method wrapper
                        return func;
                }
        }
       
        function DynamicMethod(func)
        {
                this.generate = function (obj) {
                        return func.call(null, obj);
                }
        }
       
        var scopeMethodCache = {}, scopeMethodCode = '';
       
        function scopeMethodGenerate() {
                // evaluate the code
                if (scopeMethodCode)
                        eval(scopeMethodCode);
                scopeMethodCode = '';
        }
       
        function ScopedMethod(func)
        {
                var id = 'method' + uniqID++;
               
                // add scope method
                scopeMethodCode += 'scopeMethodCache["' + id + '"] = (function (obj) { with (obj.scopes["private"]) with (obj.scopes["public"]) return (function () { return (' + func + ').apply(obj.scopes["public"], arguments); }); })\n';
               
                this.generate = function (obj) {
                        return scopeMethodCache[id](obj);
                }
        }
       
        function ObjectFactory(implementation)
        {
//[TODO] move this line elsewhere
                scopeMethodGenerate();
       
                // get a base factory
                var BaseFactory;
                if (capabilities.gs)
                {
                        // use a blank object to start
                        BaseFactory = function () { }
                       
                        // add public getters
                        implementation.scopes['public'].getters.iterate(function (value, prop) {
                                BaseFactory.prototype.__defineGetter__(prop, function () { return this['get_' + prop](); });
                        });
                        // add public setters
                        implementation.scopes['public'].setters.iterate(function (value, prop) {
                                BaseFactory.prototype.__defineSetter__(prop, function (val) { this['set_' + prop](val); });
                        });
                }
                else if (capabilities.vb)
                {
                        // initialize VBScript sandbox and builder
                        var vbBuilder = new VBClassBuilder();

                        // add public properties
                        implementation.scopes['public'].properties.iterate(function (value, prop) {
                                vbBuilder.defineProperty(prop);
                        });
                        // add public methods
                        implementation.scopes['public'].methods.iterate(function (value, prop) {
                                vbBuilder.defineMethod(prop);
                        });
                        // add public getters
                        implementation.scopes['public'].getters.iterate(function (value, prop) {
                                vbBuilder.defineGetter(prop);
                        });
                        // add public setters
                        implementation.scopes['public'].setters.iterate(function (value, prop) {
                                vbBuilder.defineSetter(prop);
                        });
                       
                        // get VBScript factory
                        BaseFactory = vbBuilder.generateFactory(implementation.classID);
                }
               
                this.generate = function generate()
                {      
                        // create return
                        var obj = new ClassObject(new BaseFactory(), implementation.inherit && implementation.inherit.generator.generate());
                        var propPrefixes = {getters: 'get_', setters: 'set_', methods: '', properties: ''};
                       
                        // add properties
                        for (var scope in implementation.scopes)
                                for (var type in implementation.scopes[scope])
                                        implementation.scopes[scope][type].iterate(function (value, prop) {
                                                obj.scopes[scope][propPrefixes[type] + prop] = value.generate(obj);
                                        });
                       
                        // add uber function
                        if (implementation.inherit)
                        {
                                // create uber function/object
                                var uber = function () {
                                        obj.parent.constructor.apply(obj.parent.object, arguments);
                                }
                                // add public methods
                                implementation.inherit.implementation.scopes['public'].methods.iterate(function (method, prop) {
                                        uber[method] = obj.parent.scopes['public'][method];
                                });
                                // add 'uber' keyword to private scope
                                obj.scopes['private'].uber = uber;
                        }
                        // scope constructor function
                        obj.constructor = implementation.constructor ?
                            implementation.constructor.generate(obj) :
                            obj.parent ? obj.parent.constructor : function () { };
               
                        // return class object
                        return obj;
                }
        }


        function ClassObject(obj, parent) {
//[TODO] what if we want private scope to have setters?
//[TODO] should private scope be its own object? so it can have setters/getters?
                this.scopes = {'private': {}, 'public': obj};
                this.object = obj;
                this.parent = parent || null;
                this.constructor = null;
               
        }
       
        /*
         * VBScript sandbox
         */
         
        function VBScriptSandbox() {                    
                // create an iframe sandbox (in head, as not to pollute the body)
                var frame = document.createElement('iframe');
                frame.style.display = 'none';
                document.getElementsByTagName('head')[0].appendChild(frame);
               
                // get variables
                this.global = frame.contentWindow;
                // write document
                this.global.document.write(['<html><head><title>VBScript Sandbox</title>',
                  '<script type="text/vbscript">',
                  'Function execute(code)\nExecuteGlobal(code)\nEnd Function',
                  'Function evaluate(code, isObject)\nIf isObject Then\nSet evaluate = Eval(code)\nElse\nevaluate = Eval(code)\nEnd If\nEnd Function',
                  '</script>',
                '</head><body></body></html>'].join('\n'));
                this.global.document.close();
               
                // evaluation functions
                this.evaluate = function (code, isObject) { return this.global.evaluate(code, !!isObject); }
                this.execute = function (code) { this.global.execute(code); }
               
                // verify VBScript is enabled
                try {
                        this.evaluate('true');
                } catch (e) {
                        throw new Error('This browser is not VBScript-capable.');
                }
        }
       
        /*
         * VBScript class constructor
         */
       
        function VBClassBuilder() {
                var code = [];
               
                this.defineProperty = function (prop) {
                        code = code.concat([
                            '\tPublic ' + prop
                        ]);
                }
                this.defineMethod = function (prop) {
                        code = code.concat([
                            '\tPublic ' + prop
                        ]);
                }
                this.defineGetter = function (prop) {
                        code = code.concat([
                            '\tPublic Property Get ' + prop,
                            '\t\tDim proxy',
                            '\t\tSet proxy = new TypeProxy',
                            '\t\tproxy.load(get_' + prop + '(me))',
                            '\t\tIf IsObject(proxy.value) Then',
                            '\t\t\tSet ' + prop + ' = proxy.value',
                            '\t\tElse',
                            '\t\t\t' + prop + ' = proxy.value',
                            '\t\tEnd If',
                            '\tEnd Property',
                            '\tPublic get_' + prop
                        ]);
                }
                this.defineSetter = function (prop) {
                        code = code.concat([
                            '\tPublic Property Let ' + prop + '(val)',
                            '\t\tCall set_' + prop + '(val)',
                            '\tEnd Property',
                            '\tPublic Property Set ' + prop + '(val)',
                            '\t\tCall set_' + prop + '(val)',
                            '\tEnd Property',
                            '\tPublic set_' + prop
                        ]);
                }
               
                this.generateFactory = function (classID) {
                        // get sandbox
                        var sandbox = VBClassBuilder.getSandbox();
                               
                        // evaluate class
//[TODO] evaluating bad property names will have to take here, and only in IE
                        sandbox.execute('Class Class_' + classID + '\n' + code.join('\n') + '\nEnd Class');
                       
                        // return factory method
                        return function () {
                                return sandbox.evaluate('New Class_' + classID, true);
                        }
                }
        }
       
        VBClassBuilder.sandbox = null;
        VBClassBuilder.getSandbox = function () {
                // check if this is cached
                if (VBClassBuilder.sandbox)
                        return VBClassBuilder.sandbox;
                       
                // create sandbox
                VBClassBuilder.sandbox = new VBScriptSandbox();        
                // add type proxy
                VBClassBuilder.sandbox.execute([
                    'Class TypeProxy',
                    '\tPublic value',
                    '\tPublic Function load(val)',
                    '\t\tIf IsObject(val) Then',
                    '\t\t\tSet value = val',
                    '\t\tElse',
                    '\t\t\tvalue = val',
                    '\t\tEnd If',
                    '\tEnd Function',
                    'End Class'
                ].join('\n'));
               
                // return it
                return VBClassBuilder.sandbox;
        }
       
        /*
         * Class api
         */
       
        // global classes array
        window.classes = new Hash();

        // class constructor
        window.Class = function (classID, properties, inherit)
        {
                // check that no class of this name exists
                if (Object.prototype.hasOwnProperty.call(window.classes, classID))
                        throw new Error('A class with id "' + classID + '" has already been defined.');
               
                // placeholder for generated factory
                var ClassFactory;
               
                // create a new implementation
                var implementation = new Implementation(classID, inherit);
                // add constructor and castor
                implementation.constructor = properties['[constructor]'] && new ScopedMethod(properties['[constructor]']);
                implementation.cast = properties['[cast]'] || (inherit && inherit.implementation.cast) || function () { throw new Error('Object cannot be cast'); };
               
                // add inheritance
                if (inherit)
                {
                        // inherit properties
//[TODO] protected?
                        var inheritScope = inherit.implementation.scopes['public'];
                        var scope = implementation.scopes['public'];
                        inheritScope.properties.iterate(function (value, prop) {
//[TODO] is this a good way to do this?
                                scope.getters[prop] = new DynamicMethod(function (obj) { return (function () { return obj.parent.scopes['public'][prop]; }); });
                                scope.setters[prop] = new DynamicMethod(function (obj) { return (function (val) { obj.parent.scopes['public'][prop] = val; }); });
                        });
                        // inherit methods
                        inheritScope.methods.iterate(function (method, prop) {
                                scope.methods[prop] = new DynamicMethod(function (obj) { return obj.parent.scopes['public'][prop]; });
                        });
                        // inherit getters
                        inheritScope.getters.iterate(function (method, prop) {
                                scope.getters[prop] = new DynamicMethod(function (obj) { return (function () { return obj.parent.scopes['public'][prop]; }); });
                        });
                        // inherit setters
                        inheritScope.setters.iterate(function (method, prop) {
                                scope.setters[prop] = new DynamicMethod(function (obj) { return (function (val) { obj.parent.scopes['public'][prop] = val; }); });
                        });
                }
       
                // add properties
                (new Hash(properties)).iterate(function (value, prop) {
                        // validate property name
                        if (!prop.match(/^(public |private )?([gs]et )?[a-zA-Z][\w\$_]*$/))
                                return;
                       
                        // get attributes
                        var visibility = prop.match(/^private /) ? 'private' : 'public';
                        var type = prop.match(/^(private |public )?get /) ? 'getters' :
                            prop.match(/^(private |public )?set /) ? 'setters' :
                            (typeof properties[prop]) == 'function' ? 'methods' :
                            'properties';
                        // add property
                        implementation.scopes[visibility][type][prop.replace(/^(public |private )?([gs]et )?/, '')] =
                            type == 'properties' ? new Property(value) : new ScopedMethod(value);
                });
                // initialize object-specific properties
                implementation.scopes['public'].getters.constructor = new Method(function () { return ClassFactory; });
//[TODO] this fails on IE
                implementation.scopes['public'].methods.toString =
                    implementation.scopes['public'].methods.valueOf =
                    new Method(function () { return '[object ' + classID + ']'; });
       
                // create static generator
                var generator = new ObjectFactory(implementation);
       
                // create class factory
                ClassFactory = function ClassFactory()
                {
                        // check if this be a cast
                        if (!(this instanceof ClassFactory))
                                return implementation.cast.apply(ClassFactory, arguments);


                        // construct object
                        var obj = generator.generate();
                        obj.constructor.apply(obj, arguments);
                        return obj.object;
                }      
                // add class information
                ClassFactory.generator = generator;
                ClassFactory.classID = classID;
                ClassFactory.implementation = implementation;
                ClassFactory.toString = function () { return '[class ' + classID + ']'; }
                // owner function
                ClassFactory.type = inherit ? [classID].concat(inherit.type) : [classID];
                ClassFactory.hasInstance = function (obj)
                {
                        if (!obj.constructor || !obj.constructor.type)
                                return false;
                        for (var i = 0; i < obj.constructor.type.length; i++)
                                if (obj.constructor.type[i] == ClassFactory.classID)
                                        return true;
                        return false;
                }
               
                // globalize class
                return window[classID] = window.classes[classID] = ClassFactory;
        }
})();
