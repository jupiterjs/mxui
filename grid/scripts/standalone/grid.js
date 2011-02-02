(function( $ ) {
	// Several of the methods in this plugin use code adapated from Prototype
	//  Prototype JavaScript framework, version 1.6.0.1
	//  (c) 2005-2007 Sam Stephenson
	var regs = {
		undHash: /_|-/,
		colons: /::/,
		words: /([A-Z]+)([A-Z][a-z])/g,
		lowerUpper: /([a-z\d])([A-Z])/g,
		dash: /([a-z\d])([A-Z])/g,
		replacer: /\{([^\}]+)\}/g
	},
		getObject = function( objectName, currentin, add ) {
			var current = currentin || window,
				parts = objectName ? objectName.split(/\./) : [],
				ret, 
				i = 0;
			for (; i < parts.length - 1 && current; i++ ) {
				current = current[parts[i]] || ( add && (current[parts[i]] = {}) );
			}
			if(parts.length == 0){
				return currentin;
			}
			ret = current[parts[i]] || ( add && (current[parts[i]] = {}) );
			if ( add === false ) {
				delete current[parts[i]];
			}
			return ret;
		},

		/** 
		 * @class jQuery.String
		 */
		str = ($.String = {
			getObject : getObject,
			/**
			 * @function strip
			 * @param {String} s returns a string with leading and trailing whitespace removed.
			 */
			strip: function( string ) {
				return string.replace(/^\s+/, '').replace(/\s+$/, '');
			},
			/**
			 * Capitalizes a string
			 * @param {String} s the string to be lowercased.
			 * @return {String} a string with the first character capitalized, and everything else lowercased
			 */
			capitalize: function( s, cache ) {
				return s.charAt(0).toUpperCase() + s.substr(1);
			},

			/**
			 * Returns if string ends with another string
			 * @param {String} s String that is being scanned
			 * @param {String} pattern What the string might end with
			 * @return {Boolean} true if the string ends wtih pattern, false if otherwise
			 */
			endsWith: function( s, pattern ) {
				var d = s.length - pattern.length;
				return d >= 0 && s.lastIndexOf(pattern) === d;
			},
			/**
			 * Capitalizes a string from something undercored. Examples:
			 * @codestart
			 * jQuery.String.camelize("one_two") //-> "oneTwo"
			 * "three-four".camelize() //-> threeFour
			 * @codeend
			 * @param {String} s
			 * @return {String} a the camelized string
			 */
			camelize: function( s ) {
				var parts = s.split(regs.undHash),
					i = 1;
				parts[0] = parts[0].charAt(0).toLowerCase() + parts[0].substr(1);
				for (; i < parts.length; i++ ) {
					parts[i] = str.capitalize(parts[i]);
				}

				return parts.join('');
			},
			/**
			 * Like camelize, but the first part is also capitalized
			 * @param {String} s
			 * @return {String} the classized string
			 */
			classize: function( s ) {
				var parts = s.split(regs.undHash),
					i = 0;
				for (; i < parts.length; i++ ) {
					parts[i] = str.capitalize(parts[i]);
				}

				return parts.join('');
			},
			/**
			 * Like [jQuery.String.classize|classize], but a space separates each 'word'
			 * @codestart
			 * jQuery.String.niceName("one_two") //-> "One Two"
			 * @codeend
			 * @param {String} s
			 * @return {String} the niceName
			 */
			niceName: function( s ) {
				var parts = s.split(regs.undHash),
					i = 0;
				for (; i < parts.length; i++ ) {
					parts[i] = str.capitalize(parts[i]);
				}

				return parts.join(' ');
			},

			/**
			 * Underscores a string.
			 * @codestart
			 * jQuery.String.underscore("OneTwo") //-> "one_two"
			 * @codeend
			 * @param {String} s
			 * @return {String} the underscored string
			 */
			underscore: function( s ) {
				return s.replace(regs.colons, '/').replace(regs.words, '$1_$2').replace(regs.lowerUpper, '$1_$2').replace(regs.dash, '_').toLowerCase();
			},
			/**
			 * Returns a string with {param} replaced with parameters
			 * from data.
			 *     $.String.sub("foo {bar}",{bar: "far"})
			 *     //-> "foo far"
			 * @param {String} s
			 * @param {Object} data
			 */
			sub: function( s, data, remove ) {
				return s.replace(regs.replacer, function( whole, inside ) {
					//convert inside to type
					return getObject(inside, data, !remove).toString(); //gets the value in options
				});
			}
		});

})(jQuery);
(function( $ ) {

	// if we are initializing a new class
	var initializing = false,
		makeArray = $.makeArray,
		isFunction = $.isFunction,
		isArray = $.isArray,
		concatArgs = function(arr, args){
			return arr.concat(makeArray(args));
		},
		// tests if we can get super in .toString()
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/,

		// overwrites an object with methods, sets up _super
		inheritProps = function( newProps, oldProps, addTo ) {
			addTo = addTo || newProps
			for ( var name in newProps ) {
				// Check if we're overwriting an existing function
				addTo[name] = isFunction(newProps[name]) && 
							  isFunction(oldProps[name]) && 
							  fnTest.test(newProps[name]) ? (function( name, fn ) {
					return function() {
						var tmp = this._super,
							ret;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = oldProps[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(name, newProps[name]) : newProps[name];
			}
		},


	/**
	 * @class jQuery.Class
	 * @plugin jquery/class
	 * @tag core
	 * @download dist/jquery/jquery.class.js
	 * @test jquery/class/qunit.html
	 * Class provides simulated inheritance in JavaScript. Use clss to bridge the gap between
	 * jQuery's functional programming style and Object Oriented Programming.
	 * It is based off John Resig's [http://ejohn.org/blog/simple-javascript-inheritance/|Simple Class]
	 * Inheritance library.  Besides prototypal inheritance, it includes a few important features:
	 * <ul>
	 *     <li>Static inheritance</li>
	 *     <li>Introspection</li>
	 *     <li>Namespaces</li>
	 *     <li>Setup and initialization methods</li>
	 *     <li>Easy callback function creation</li>
	 * </ul>
	 * <h2>Static v. Prototype</h2>
	 * <p>Before learning about Class, it's important to
	 * understand the difference between
	 * a class's <b>static</b> and <b>prototype</b> properties.
	 * </p>
	 * @codestart
	 * //STATIC
	 * MyClass.staticProperty  //shared property
	 *
	 * //PROTOTYPE
	 * myclass = new MyClass()
	 * myclass.prototypeMethod() //instance method
	 * @codeend
	 * <p>A static (or class) property is on the Class constructor
	 * function itself
	 * and can be thought of being shared by all instances of the Class.
	 * Prototype propertes are available only on instances of the Class.
	 * </p>
	 * <h2>A Basic Class</h2>
	 * <p>The following creates a Monster class with a
	 * name (for introspection), static, and prototype members.
	 * Every time a monster instance is created, the static
	 * count is incremented.
	 *
	 * </p>
	 * @codestart
	 * $.Class.extend('Monster',
	 * /* @static *|
	 * {
	 *   count: 0
	 * },
	 * /* @prototype *|
	 * {
	 *   init: function( name ) {
	 *
	 *     // saves name on the monster instance
	 *     this.name = name;
	 *
	 *     // sets the health
	 *     this.health = 10;
	 *
	 *     // increments count
	 *     this.Class.count++;
	 *   },
	 *   eat: function( smallChildren ){
	 *     this.health += smallChildren;
	 *   },
	 *   fight: function() {
	 *     this.health -= 2;
	 *   }
	 * });
	 *
	 * hydra = new Monster('hydra');
	 *
	 * dragon = new Monster('dragon');
	 *
	 * hydra.name        // -> hydra
	 * Monster.count     // -> 2
	 * Monster.shortName // -> 'Monster'
	 *
	 * hydra.eat(2);     // health = 12
	 *
	 * dragon.fight();   // health = 8
	 *
	 * @codeend
	 *
	 * <p>
	 * Notice that the prototype <b>init</b> function is called when a new instance of Monster is created.
	 * </p>
	 * <h2>Inheritance</h2>
	 * <p>When a class is extended, all static and prototype properties are available on the new class.
	 * If you overwrite a function, you can call the base class's function by calling
	 * <code>this._super</code>.  Lets create a SeaMonster class.  SeaMonsters are less
	 * efficient at eating small children, but more powerful fighters.
	 * </p>
	 * @codestart
	 * Monster.extend("SeaMonster",{
	 *   eat: function( smallChildren ) {
	 *     this._super(smallChildren / 2);
	 *   },
	 *   fight: function() {
	 *     this.health -= 1;
	 *   }
	 * });
	 *
	 * lockNess = new SeaMonster('Lock Ness');
	 * lockNess.eat(4);   //health = 12
	 * lockNess.fight();  //health = 11
	 * @codeend
	 * <h3>Static property inheritance</h3>
	 * You can also inherit static properties in the same way:
	 * @codestart
	 * $.Class.extend("First",
	 * {
	 *     staticMethod: function() { return 1;}
	 * },{})
	 *
	 * First.extend("Second",{
	 *     staticMethod: function() { return this._super()+1;}
	 * },{})
	 *
	 * Second.staticMethod() // -> 2
	 * @codeend
	 * <h2>Namespaces</h2>
	 * <p>Namespaces are a good idea! We encourage you to namespace all of your code.
	 * It makes it possible to drop your code into another app without problems.
	 * Making a namespaced class is easy:
	 * </p>
	 * @codestart
	 * $.Class.extend("MyNamespace.MyClass",{},{});
	 *
	 * new MyNamespace.MyClass()
	 * @codeend
	 * <h2 id='introspection'>Introspection</h2>
	 * Often, it's nice to create classes whose name helps determine functionality.  Ruby on
	 * Rails's [http://api.rubyonrails.org/classes/ActiveRecord/Base.html|ActiveRecord] ORM class
	 * is a great example of this.  Unfortunately, JavaScript doesn't have a way of determining
	 * an object's name, so the developer must provide a name.  Class fixes this by taking a String name for the class.
	 * @codestart
	 * $.Class.extend("MyOrg.MyClass",{},{})
	 * MyOrg.MyClass.shortName //-> 'MyClass'
	 * MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
	 * @codeend
	 * The fullName (with namespaces) and the shortName (without namespaces) are added to the Class's
	 * static properties.
	 *
	 *
	 * <h2>Setup and initialization methods</h2>
	 * <p>
	 * Class provides static and prototype initialization functions.
	 * These come in two flavors - setup and init.
	 * Setup is called before init and
	 * can be used to 'normalize' init's arguments.
	 * </p>
	 * <div class='whisper'>PRO TIP: Typically, you don't need setup methods in your classes. Use Init instead.
	 * Reserve setup methods for when you need to do complex pre-processing of your class before init is called.
	 *
	 * </div>
	 * @codestart
	 * $.Class.extend("MyClass",
	 * {
	 *   setup: function() {} //static setup
	 *   init: function() {} //static constructor
	 * },
	 * {
	 *   setup: function() {} //prototype setup
	 *   init: function() {} //prototype constructor
	 * })
	 * @codeend
	 *
	 * <h3>Setup</h3>
	 * <p>Setup functions are called before init functions.  Static setup functions are passed
	 * the base class followed by arguments passed to the extend function.
	 * Prototype static functions are passed the Class constructor function arguments.</p>
	 * <p>If a setup function returns an array, that array will be used as the arguments
	 * for the following init method.  This provides setup functions the ability to normalize
	 * arguments passed to the init constructors.  They are also excellent places
	 * to put setup code you want to almost always run.</p>
	 * <p>
	 * The following is similar to how [jQuery.Controller.prototype.setup]
	 * makes sure init is always called with a jQuery element and merged options
	 * even if it is passed a raw
	 * HTMLElement and no second parameter.
	 * </p>
	 * @codestart
	 * $.Class.extend("jQuery.Controller",{
	 *   ...
	 * },{
	 *   setup: function( el, options ) {
	 *     ...
	 *     return [$(el),
	 *             $.extend(true,
	 *                this.Class.defaults,
	 *                options || {} ) ]
	 *   }
	 * })
	 * @codeend
	 * Typically, you won't need to make or overwrite setup functions.
	 * <h3>Init</h3>
	 *
	 * <p>Init functions are called after setup functions.
	 * Typically, they receive the same arguments
	 * as their preceding setup function.  The Foo class's <code>init</code> method
	 * gets called in the following example:
	 * </p>
	 * @codestart
	 * $.Class.Extend("Foo", {
	 *   init: function( arg1, arg2, arg3 ) {
	 *     this.sum = arg1+arg2+arg3;
	 *   }
	 * })
	 * var foo = new Foo(1,2,3);
	 * foo.sum //-> 6
	 * @codeend
	 * <h2>Callbacks</h2>
	 * <p>Similar to jQuery's proxy method, Class provides a
	 * [jQuery.Class.static.callback callback]
	 * function that returns a callback to a method that will always
	 * have
	 * <code>this</code> set to the class or instance of the class.
	 * </p>
	 * The following example uses this.callback to make sure
	 * <code>this.name</code> is available in <code>show</code>.
	 * @codestart
	 * $.Class.extend("Todo",{
	 *   init: function( name ) { this.name = name }
	 *   get: function() {
	 *     $.get("/stuff",this.callback('show'))
	 *   },
	 *   show: function( txt ) {
	 *     alert(this.name+txt)
	 *   }
	 * })
	 * new Todo("Trash").get()
	 * @codeend
	 * <p>Callback is available as a static and prototype method.</p>
	 * <h2>Demo</h2>
	 * @demo jquery/class/class.html
	 *
	 * @constructor Creating a new instance of an object that has extended jQuery.Class
	 *     calls the init prototype function and returns a new instance of the class.
	 *
	 */

	clss = $.Class = function() {
		if (arguments.length) {
			clss.extend.apply(clss, arguments);
		}
	};

	/* @Static*/
	$.extend(clss, {
		/**
		 * @function callback
		 * Returns a callback function for a function on this Class.
		 * The callback function ensures that 'this' is set appropriately.  
		 * @codestart
		 * $.Class.extend("MyClass",{
		 *     getData: function() {
		 *         this.showing = null;
		 *         $.get("data.json",this.callback('gotData'),'json')
		 *     },
		 *     gotData: function( data ) {
		 *         this.showing = data;
		 *     }
		 * },{});
		 * MyClass.showData();
		 * @codeend
		 * <h2>Currying Arguments</h2>
		 * Additional arguments to callback will fill in arguments on the returning function.
		 * @codestart
		 * $.Class.extend("MyClass",{
		 *    getData: function( <b>callback</b> ) {
		 *      $.get("data.json",this.callback('process',<b>callback</b>),'json');
		 *    },
		 *    process: function( <b>callback</b>, jsonData ) { //callback is added as first argument
		 *        jsonData.processed = true;
		 *        callback(jsonData);
		 *    }
		 * },{});
		 * MyClass.getData(showDataFunc)
		 * @codeend
		 * <h2>Nesting Functions</h2>
		 * Callback can take an array of functions to call as the first argument.  When the returned callback function
		 * is called each function in the array is passed the return value of the prior function.  This is often used
		 * to eliminate currying initial arguments.
		 * @codestart
		 * $.Class.extend("MyClass",{
		 *    getData: function( callback ) {
		 *      //calls process, then callback with value from process
		 *      $.get("data.json",this.callback(['process2',callback]),'json') 
		 *    },
		 *    process2: function( type,jsonData ) {
		 *        jsonData.processed = true;
		 *        return [jsonData];
		 *    }
		 * },{});
		 * MyClass.getData(showDataFunc);
		 * @codeend
		 * @param {String|Array} fname If a string, it represents the function to be called.  
		 * If it is an array, it will call each function in order and pass the return value of the prior function to the
		 * next function.
		 * @return {Function} the callback function.
		 */
		callback: function( funcs ) {

			//args that should be curried
			var args = makeArray(arguments),
				self;

			funcs = args.shift();

			if (!isArray(funcs) ) {
				funcs = [funcs];
			}

			self = this;
			
			return function class_cb() {
				var cur = concatArgs(args, arguments),
					isString, 
					length = funcs.length,
					f = 0,
					func;

				for (; f < length; f++ ) {
					func = funcs[f];
					if (!func ) {
						continue;
					}

					isString = typeof func == "string";
					if ( isString && self._set_called ) {
						self.called = func;
					}
					cur = (isString ? self[func] : func).apply(self, cur || []);
					if ( f < length - 1 ) {
						cur = !isArray(cur) || cur._use_call ? [cur] : cur
					}
				}
				return cur;
			}
		},
		/**
		 *   @function getObject 
		 *   Gets an object from a String.
		 *   If the object or namespaces the string represent do not
		 *   exist it will create them.  
		 *   @codestart
		 *   Foo = {Bar: {Zar: {"Ted"}}}
		 *   $.Class.getobject("Foo.Bar.Zar") //-> "Ted"
		 *   @codeend
		 *   @param {String} objectName the object you want to get
		 *   @param {Object} [current=window] the object you want to look in.
		 *   @return {Object} the object you are looking for.
		 */
		getObject: $.String.getObject,
		/**
		 * @function newInstance
		 * Creates a new instance of the class.  This method is useful for creating new instances
		 * with arbitrary parameters.
		 * <h3>Example</h3>
		 * @codestart
		 * $.Class.extend("MyClass",{},{})
		 * var mc = MyClass.newInstance.apply(null, new Array(parseInt(Math.random()*10,10))
		 * @codeend
		 * @return {class} instance of the class
		 */
		newInstance: function() {
			var inst = this.rawInstance(),
				args;
			if ( inst.setup ) {
				args = inst.setup.apply(inst, arguments);
			}
			if ( inst.init ) {
				inst.init.apply(inst, isArray(args) ? args : arguments);
			}
			return inst;
		},
		/**
		 * Copy and overwrite options from old class
		 * @param {Object} oldClass
		 * @param {String} fullName
		 * @param {Object} staticProps
		 * @param {Object} protoProps
		 */
		setup: function( oldClass, fullName ) {
			this.defaults = $.extend(true, {}, oldClass.defaults, this.defaults);
			return arguments;
		},
		rawInstance: function() {
			initializing = true;
			var inst = new this();
			initializing = false;
			return inst;
		},
		/**
		 * Extends a class with new static and prototype functions.  There are a variety of ways
		 * to use extend:
		 * @codestart
		 * //with className, static and prototype functions
		 * $.Class.extend('Task',{ STATIC },{ PROTOTYPE })
		 * //with just classname and prototype functions
		 * $.Class.extend('Task',{ PROTOTYPE })
		 * //With just a className
		 * $.Class.extend('Task')
		 * @codeend
		 * @param {String} [fullName]  the classes name (used for classes w/ introspection)
		 * @param {Object} [klass]  the new classes static/class functions
		 * @param {Object} [proto]  the new classes prototype functions
		 * @return {jQuery.Class} returns the new class
		 */
		extend: function( fullName, klass, proto ) {
			// figure out what was passed
			if ( typeof fullName != 'string' ) {
				proto = klass;
				klass = fullName;
				fullName = null;
			}
			if (!proto ) {
				proto = klass;
				klass = null;
			}

			proto = proto || {};
			var _super_class = this,
				_super = this.prototype,
				name, shortName, namespace, prototype;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			prototype = new this();
			initializing = false;
			// Copy the properties over onto the new prototype
			inheritProps(proto, _super, prototype);

			// The dummy class constructor

			function Class() {
				// All construction is actually done in the init method
				if ( initializing ) return;

				if ( this.constructor !== Class && arguments.length ) { //we are being called w/o new
					return arguments.callee.extend.apply(arguments.callee, arguments)
				} else { //we are being called w/ new
					return this.Class.newInstance.apply(this.Class, arguments)
				}
			}
			// Copy old stuff onto class
			for ( name in this ) {
				if ( this.hasOwnProperty(name) && $.inArray(name, ['prototype', 'defaults', 'getObject']) == -1 ) {
					Class[name] = this[name];
				}
			}

			// do static inheritance
			inheritProps(klass, this, Class);

			// do namespace stuff
			if ( fullName ) {

				var parts = fullName.split(/\./),
					shortName = parts.pop(),
					current = clss.getObject(parts.join('.'), window, true),
					namespace = current;

				
				current[shortName] = Class;
			}

			// set things that can't be overwritten
			$.extend(Class, {
				prototype: prototype,
				namespace: namespace,
				shortName: shortName,
				constructor: Class,
				fullName: fullName
			});

			//make sure our prototype looks nice
			Class.prototype.Class = Class.prototype.constructor = Class;


			/**
			 * @attribute fullName 
			 * The full name of the class, including namespace, provided for introspection purposes.
			 * @codestart
			 * $.Class.extend("MyOrg.MyClass",{},{})
			 * MyOrg.MyClass.shortName //-> 'MyClass'
			 * MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
			 * @codeend
			 */

			var args = Class.setup.apply(Class, concatArgs([_super_class],arguments));

			if ( Class.init ) {
				Class.init.apply(Class, args || []);
			}

			/* @Prototype*/
			return Class;
			/** 
			 * @function setup
			 * Called with the same arguments as new Class(arguments ...) when a new instance is created.
			 * @codestart
			 * $.Class.extend("MyClass",
			 * {
			 *    setup: function( val ) {
			 *       this.val = val;
			 *    }
			 * })
			 * var mc = new MyClass("Check Check")
			 * mc.val //-> 'Check Check'
			 * @codeend
			 * 
			 * <div class='whisper'>PRO TIP: 
			 * Setup functions are used to normalize constructor arguments and provide a place for
			 * setup code that extending classes don't have to remember to call _super to
			 * run.
			 * </div>
			 * 
			 * @return {Array|undefined} If an array is return, [jQuery.Class.prototype.init] is 
			 * called with those arguments; otherwise, the original arguments are used.
			 */
			//break up
			/** 
			 * @function init
			 * Called with the same arguments as new Class(arguments ...) when a new instance is created.
			 * @codestart
			 * $.Class.extend("MyClass",
			 * {
			 *    init: function( val ) {
			 *       this.val = val;
			 *    }
			 * })
			 * var mc = new MyClass("Check Check")
			 * mc.val //-> 'Check Check'
			 * @codeend
			 */
			//Breaks up code
			/**
			 * @attribute Class
			 * References the static properties of the instance's class.
			 * <h3>Quick Example</h3>
			 * @codestart
			 * // a class with a static classProperty property
			 * $.Class.extend("MyClass", {classProperty : true}, {});
			 * 
			 * // a new instance of myClass
			 * var mc1 = new MyClass();
			 * 
			 * //
			 * mc1.Class.classProperty = false;
			 * 
			 * // creates a new MyClass
			 * var mc2 = new mc.Class();
			 * @codeend
			 * Getting static properties via the Class property, such as it's 
			 * [jQuery.Class.static.fullName fullName] is very common.
			 */
		}

	})





	clss.prototype.
	/**
	 * @function callback
	 * Returns a callback function.  This does the same thing as and is described better in [jQuery.Class.static.callback].
	 * The only difference is this callback works
	 * on a instance instead of a class.
	 * @param {String|Array} fname If a string, it represents the function to be called.  
	 * If it is an array, it will call each function in order and pass the return value of the prior function to the
	 * next function.
	 * @return {Function} the callback function
	 */
	callback = clss.callback;


})(jQuery);
(function( $ ) {
	/**
	 * @attribute destroyed
	 * @parent specialevents
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/destroyed/destroyed.js
	 * @test jquery/event/destroyed/qunit.html
	 * Provides a destroyed event on an element.
	 * <p>
	 * The destroyed event is called when the element
	 * is removed as a result of jQuery DOM manipulators like remove, html,
	 * replaceWith, etc. Destroyed events do not bubble, so make sure you don't use live or delegate with destroyed
	 * events.
	 * </p>
	 * <h2>Quick Example</h2>
	 * @codestart
	 * $(".foo").bind("destroyed", function(){
	 *    //clean up code
	 * })
	 * @codeend
	 * <h2>Quick Demo</h2>
	 * @demo jquery/event/destroyed/destroyed.html 
	 * <h2>More Involved Demo</h2>
	 * @demo jquery/event/destroyed/destroyed_menu.html 
	 */

	var oldClean = jQuery.cleanData;

	$.cleanData = function( elems ) {
		for ( var i = 0, elem;
		(elem = elems[i]) !== undefined; i++ ) {
			$(elem).triggerHandler("destroyed");
			//$.event.remove( elem, 'destroyed' );
		}
		oldClean(elems);
	};

})(jQuery);
(function( $ ) {

	// ------- helpers  ------
	// Binds an element, returns a function that unbinds
	var bind = function( el, ev, callback ) {
		var wrappedCallback;
		//this is for events like >click.
		if ( ev.indexOf(">") === 0 ) {
			ev = ev.substr(1);
			wrappedCallback = function( event ) {
				if ( event.target === el ) {
					callback.apply(this, arguments);
				} else {
					event.handled = null;
				}
			};
		}
		$(el).bind(ev, wrappedCallback || callback);
		// if ev name has >, change the name and bind
		// in the wrapped callback, check that the element matches the actual element
		return function() {
			$(el).unbind(ev, wrappedCallback || callback);
			el = ev = callback = wrappedCallback = null;
		};
	},
		makeArray = $.makeArray,
		isFunction = $.isFunction,
		// Binds an element, returns a function that unbinds
		delegate = function( el, selector, ev, callback ) {
			$(el).delegate(selector, ev, callback);
			return function() {
				$(el).undelegate(selector, ev, callback);
				el = ev = callback = selector = null;
			};
		},
		binder = function( el, ev, callback, selector ) {
			return selector ? delegate(el, selector, ev, callback) : bind(el, ev, callback);
		},
		/**
		 * moves 'this' to the first argument 
		 */
		shifter = function shifter(cb) {
			return function() {
				return cb.apply(null, [$(this)].concat(Array.prototype.slice.call(arguments, 0)));
			};
		},
		// matches dots
		dotsReg = /\./g,
		// matches controller
		controllersReg = /_?controllers?/ig,
		//used to remove the controller from the name
		underscoreAndRemoveController = function( className ) {
			return $.String.underscore(className.replace("jQuery.", "").replace(dotsReg, '_').replace(controllersReg, ""));
		},
		// checks if it looks like an action
		actionMatcher = /[^\w]/,
		// gets jus the event
		eventCleaner = /^(>?default\.)|(>)/,
		// handles parameterized action names
		parameterReplacer = /\{([^\}]+)\}/g,
		breaker = /^(?:(.*?)\s)?([\w\.\:>]+)$/,
		basicProcessor;
	/**
	 * @tag core
	 * @plugin jquery/controller
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/controller/controller.js
	 * @test jquery/controller/qunit.html
	 * 
	 * Controllers organize event handlers using event delegation. 
	 * If something happens in your application (a user click or a [jQuery.Model|Model] instance being updated), 
	 * a controller should respond to it.  
	 * 
	 * Controllers make your code deterministic, reusable, organized and can tear themselves 
	 * down auto-magically. Read about [http://jupiterjs.com/news/writing-the-perfect-jquery-plugin 
	 * the theory behind controller] and 
	 * a [http://jupiterjs.com/news/organize-jquery-widgets-with-jquery-controller walkthrough of its features]
	 * on Jupiter's blog.
	 * 
	 * 
	 * ## Basic Example
	 * 
	 * Instead of
	 * 
	 * @codestart
	 * $(function(){
	 *   $('#tabs').click(someCallbackFunction1)
	 *   $('#tabs .tab').click(someCallbackFunction2)
	 *   $('#tabs .delete click').click(someCallbackFunction3)
	 * });
	 * @codeend
	 * 
	 * do this
	 * 
	 * @codestart
	 * $.Controller('Tabs',{
	 *   click: function() {...},
	 *   '.tab click' : function() {...},
	 *   '.delete click' : function() {...}
	 * })
	 * $('#tabs').tabs();
	 * @codeend
	 * 
	 * ## Tabs Example
	 * 
	 * @demo jquery/controller/controller.html
	 * 
	 * 
	 * ## Using Controller
	 * 
	 * Controller helps you build and organize jQuery plugins.  It can be used
	 * to build simple widgets, like a slider, or organize multiple
	 * widgets into something greater.
	 * 
	 * To understand how to use Controller, you need to understand 
	 * the typical lifecycle of a jQuery widget and how that maps to
	 * controller's functionality:
	 * 
	 * ### A controller class is created.
	 *       
	 *     $.Controller("MyWidget",
	 *     {
	 *       defaults :  {
	 *         message : "Remove Me"
	 *       }
	 *     },
	 *     {
	 *       init : function(rawEl, rawOptions){ 
	 *         this.element.append(
	 *            "<div>"+this.options.message+"</div>"
	 *           );
	 *       },
	 *       "div click" : function(div, ev){ 
	 *         div.remove();
	 *       }  
	 *     }) 
	 *     
	 * This creates a <code>$.fn.my_widget</code> [jquery.controller.plugin jQuery helper function]
	 * that can be used to create a new controller instance on an element.
	 *       
	 * ### An instance of controller is created on an element
	 * 
	 *     $('.thing').my_widget(options) // calls new MyWidget(el, options)
	 * 
	 * This calls <code>new MyWidget(el, options)</code> on 
	 * each <code>'.thing'</code> element.  
	 *     
	 * When a new [jQuery.Class Class] instance is created, it calls the class's
	 * prototype setup and init methods. Controller's [jQuery.Controller.prototype.setup setup]
	 * method:
	 *     
	 *  - Sets [jQuery.Controller.prototype.element this.element] and adds the controller's name to element's className.
	 *  - Merges passed in options with defaults object and sets it as [jQuery.Controller.prototype.options this.options]
	 *  - Saves a reference to the controller in <code>$.data</code>.
	 *  - [jquery.controller.listening Binds all event handler methods].
	 *   
	 * 
	 * ### The controller responds to events
	 * 
	 * Typically, Controller event handlers are automatically bound.  However, there are
	 * multiple ways to [jquery.controller.listening listen to events] with a controller.
	 * 
	 * Once an event does happen, the callback function is always called with 'this' 
	 * referencing the controller instance.  This makes it easy to use helper functions and
	 * save state on the controller.
	 * 
	 * 
	 * ### The widget is destroyed
	 * 
	 * If the element is removed from the page, the 
	 * controller's [jQuery.Controller.prototype.destroy] method is called.
	 * This is a great place to put any additional teardown functionality.
	 * 
	 * You can also teardown a controller programatically like:
	 * 
	 *     $('.thing').my_widget('destroy');
	 * 
	 * ## Todos Example
	 * 
	 * Lets look at a very basic example - 
	 * a list of todos and a button you want to click to create a new todo.
	 * Your HTML might look like:
	 * 
	 * @codestart html
	 * &lt;div id='todos'>
	 *  &lt;ol>
	 *    &lt;li class="todo">Laundry&lt;/li>
	 *    &lt;li class="todo">Dishes&lt;/li>
	 *    &lt;li class="todo">Walk Dog&lt;/li>
	 *  &lt;/ol>
	 *  &lt;a class="create">Create&lt;/a>
	 * &lt;/div>
	 * @codeend
	 * 
	 * To add a mousover effect and create todos, your controller might look like:
	 * 
	 * @codestart
	 * $.Controller.extend('Todos',{
	 *   ".todo mouseover" : function( el, ev ) {
	 *    el.css("backgroundColor","red")
	 *   },
	 *   ".todo mouseout" : function( el, ev ) {
	 *    el.css("backgroundColor","")
	 *   },
	 *   ".create click" : function() {
	 *    this.find("ol").append("&lt;li class='todo'>New Todo&lt;/li>"); 
	 *   }
	 * })
	 * @codeend
	 * 
	 * Now that you've created the controller class, you've must attach the event handlers on the '#todos' div by
	 * creating [jQuery.Controller.prototype.setup|a new controller instance].  There are 2 ways of doing this.
	 * 
	 * @codestart
	 * //1. Create a new controller directly:
	 * new Todos($('#todos'));
	 * //2. Use jQuery function
	 * $('#todos').todos();
	 * @codeend
	 * 
	 * ## Controller Initialization
	 * 
	 * It can be extremely useful to add an init method with 
	 * setup functionality for your widget.
	 * 
	 * In the following example, I create a controller that when created, will put a message as the content of the element:
	 * 
	 * @codestart
	 * $.Controller.extend("SpecialController",
	 * {
	 *   init: function( el, message ) {
	 *      this.element.html(message)
	 *   }
	 * })
	 * $(".special").special("Hello World")
	 * @codeend
	 * 
	 * ## Removing Controllers
	 * 
	 * Controller removal is built into jQuery.  So to remove a controller, you just have to remove its element:
	 * 
	 * @codestart
	 * $(".special_controller").remove()
	 * $("#containsControllers").html("")
	 * @codeend
	 * 
	 * It's important to note that if you use raw DOM methods (<code>innerHTML, removeChild</code>), the controllers won't be destroyed.
	 * 
	 * If you just want to remove controller functionality, call destroy on the controller instance:
	 * 
	 * @codestart
	 * $(".special_controller").controller().destroy()
	 * @codeend
	 * 
	 * ## Accessing Controllers
	 * 
	 * Often you need to get a reference to a controller, there are a few ways of doing that.  For the 
	 * following example, we assume there are 2 elements with <code>className="special"</code>.
	 * 
	 * @codestart
	 * //creates 2 foo controllers
	 * $(".special").foo()
	 * 
	 * //creates 2 bar controllers
	 * $(".special").bar()
	 * 
	 * //gets all controllers on all elements:
	 * $(".special").controllers() //-> [foo, bar, foo, bar]
	 * 
	 * //gets only foo controllers
	 * $(".special").controllers(FooController) //-> [foo, foo]
	 * 
	 * //gets all bar controllers
	 * $(".special").controllers(BarController) //-> [bar, bar]
	 * 
	 * //gets first controller
	 * $(".special").controller() //-> foo
	 * 
	 * //gets foo controller via data
	 * $(".special").data("controllers")["FooController"] //-> foo
	 * @codeend
	 * 
	 * ## Calling methods on Controllers
	 * 
	 * Once you have a reference to an element, you can call methods on it.  However, Controller has
	 * a few shortcuts:
	 * 
	 * @codestart
	 * //creates foo controller
	 * $(".special").foo({name: "value"})
	 * 
	 * //calls FooController.prototype.update
	 * $(".special").foo({name: "value2"})
	 * 
	 * //calls FooController.prototype.bar
	 * $(".special").foo("bar","something I want to pass")
	 * @codeend
	 */
	$.Class.extend("jQuery.Controller",
	/** 
	 * @Static
	 */
	{
		/**
		 * Does 3 things:
		 * <ol>
		 *     <li>Creates a jQuery helper for this controller.</li>
		 *     <li>Calculates and caches which functions listen for events.</li>
		 *     <li> and attaches this element to the documentElement if onDocument is true.</li>
		 * </ol>   
		 * <h3>jQuery Helper Naming Examples</h3>
		 * @codestart
		 * "TaskController" -> $().task_controller()
		 * "Controllers.Task" -> $().controllers_task()
		 * @codeend
		 */
		init: function() {
			// if you didn't provide a name, or are controller, don't do anything
			if (!this.shortName || this.fullName == "jQuery.Controller" ) {
				return;
			}
			// cache the underscored names
			this._fullName = underscoreAndRemoveController(this.fullName);
			this._shortName = underscoreAndRemoveController(this.shortName);

			var controller = this,
				pluginname = this.pluginName || this._fullName,
				funcName, forLint;

			// create jQuery plugin
			if (!$.fn[pluginname] ) {
				$.fn[pluginname] = function( options ) {

					var args = makeArray(arguments),
						//if the arg is a method on this controller
						isMethod = typeof options == "string" && isFunction(controller.prototype[options]),
						meth = args[0];
					this.each(function() {
						//check if created
						var controllers = $.data(this, "controllers"),
							//plugin is actually the controller instance
							plugin = controllers && controllers[pluginname];

						if ( plugin ) {
							if ( isMethod ) {
								// call a method on the controller with the remaining args
								plugin[meth].apply(plugin, args.slice(1));
							} else {
								// call the plugin's update method
								plugin.update.apply(plugin, args);
							}

						} else {
							//create a new controller instance
							controller.newInstance.apply(controller, [this].concat(args));
						}
					});
					//always return the element
					return this;
				};
			}

			// make sure listensTo is an array
			
			// calculate and cache actions
			this.actions = {};

			for ( funcName in this.prototype ) {
				if (!isFunction(this.prototype[funcName]) ) {
					continue;
				}
				if ( this._isAction(funcName) ) {
					this.actions[funcName] = this._getAction(funcName);
				}
			}

			/**
			 * @attribute onDocument
			 * Set to true if you want to automatically attach this element to the documentElement.
			 */
			if ( this.onDocument ) {
				forLint = new controller(document.documentElement);
			}
		},
		hookup: function( el ) {
			return new this(el);
		},

		/**
		 * @hide
		 * @param {String} methodName a prototype function
		 * @return {Boolean} truthy if an action or not
		 */
		_isAction: function( methodName ) {
			if ( actionMatcher.test(methodName) ) {
				return true;
			} else {
				var cleanedEvent = methodName.replace(eventCleaner, "");
				return $.inArray(cleanedEvent, this.listensTo) > -1 || $.event.special[cleanedEvent] || $.Controller.processors[cleanedEvent];
			}

		},
		/**
		 * @hide
		 * @param {Object} methodName the method that will be bound
		 * @param {Object} [options] first param merged with class default options
		 * @return {Object} null or the processor and pre-split parts.  
		 * The processor is what does the binding/subscribing.
		 */
		_getAction: function( methodName, options ) {
			//if we don't have a controller instance, we'll break this guy up later
			parameterReplacer.lastIndex = 0;
			if (!options && parameterReplacer.test(methodName) ) {
				return null;
			}
			var convertedName = options ? $.String.sub(methodName, options) : methodName,
				parts = convertedName.match(breaker),
				event = parts[2],
				processor = this.processors[event] || basicProcessor;
			return {
				processor: processor,
				parts: parts
			};
		},
		/**
		 * @attribute processors
		 * An object of {eventName : function} pairs that Controller uses to hook up events
		 * auto-magically.  A processor function looks like:
		 * 
		 *     jQuery.Controller.processors.
		 *       myprocessor = function( el, event, selector, cb, controller ) {
		 *          //el - the controller's element
		 *          //event - the event (myprocessor)
		 *          //selector - the left of the selector
		 *          //cb - the function to call
		 *          //controller - the binding controller
		 *       };
		 * 
		 * This would bind anything like: "foo~3242 myprocessor".
		 * 
		 * The processor must return a function that when called, 
		 * unbinds the event handler.
		 * 
		 * Controller already has processors for the following events:
		 * 
		 *   - change 
		 *   - click 
		 *   - contextmenu 
		 *   - dblclick 
		 *   - focusin
		 *   - focusout
		 *   - keydown 
		 *   - keyup 
		 *   - keypress 
		 *   - mousedown 
		 *   - mouseenter
		 *   - mouseleave
		 *   - mousemove 
		 *   - mouseout 
		 *   - mouseover 
		 *   - mouseup 
		 *   - reset 
		 *   - resize 
		 *   - scroll 
		 *   - select 
		 *   - submit  
		 * 
		 * The following processors always listen on the window or document:
		 * 
		 *   - windowresize
		 *   - windowscroll
		 *   - load
		 *   - unload
		 *   - hashchange
		 *   - ready
		 *   
		 * Which means anytime the window is resized, the following controller will listen to it:
		 *  
		 *     $.Controller('Sized',{
		 *       windowresize : function(){
		 *         this.element.width(this.element.parent().width() / 2);
		 *       }
		 *     });
		 *     
		 *     $('.foo').sized();
		 */
		processors: {},
		/**
		 * @attribute listensTo
		 * A list of special events this controller listens too.  You only need to add event names that
		 * are whole words (ie have no special characters).
		 * 
		 *     $.Controller('TabPanel',{
		 *       listensTo : ['show']
		 *     },{
		 *       'show' : function(){
		 *         this.element.show();
		 *       }
		 *     })
		 *     
		 *     $('.foo').tab_panel().trigger("show");
		 */
		listensTo: [],
		/**
		 * @attribute defaults
		 * A object of name-value pairs that act as default values for a controller's 
		 * [jQuery.Controller.prototype.options options].
		 * 
		 *     $.Controller("Message",
		 *     {
		 *       defaults : {
		 *         message : "Hello World"
		 *       }
		 *     },{
		 *       init : function(){
		 *         this.element.text(this.options.message);
		 *       }
		 *     })
		 *     
		 *     $("#el1").message(); //writes "Hello World"
		 *     $("#el12").message({message: "hi"}); //writes hi
		 */
		defaults: {}
	},
	/** 
	 * @Prototype
	 */
	{
		/**
		 * Setup is where most of controller's magic happens.  It does the following:
		 * 
		 * ### Sets this.element
		 * 
		 * The first parameter passed to new Controller(el, options) is expected to be 
		 * an element.  This gets converted to a jQuery wrapped element and set as
		 * [jQuery.Controller.prototype.element this.element].
		 * 
		 * ### Adds the controller's name to the element's className.
		 * 
		 * Controller adds it's plugin name to the element's className for easier 
		 * debugging.  For example, if your Controller is named "Foo.Bar", it adds
		 * "foo_bar" to the className.
		 * 
		 * ### Saves the controller in $.data
		 * 
		 * A reference to the controller instance is saved in $.data.  You can find 
		 * instances of "Foo.Bar" like: 
		 * 
		 *     $("#el").data("controllers")['foo_bar'].
		 * 
		 * ### Binds event handlers
		 * 
		 * Setup does the event binding described in [jquery.controller.listening Listening To Events].
		 * 
		 * ## API
		 * @param {HTMLElement} element the element this instance operates on.
		 * @param {Object} [options] option values for the controller.  These get added to
		 * this.options.
		 */
		setup: function( element, options ) {
			var funcName, ready, cls = this.Class;

			//want the raw element here
			element = element.jquery ? element[0] : element;

			//set element and className on element
			this.element = $(element).addClass(cls._fullName);

			//set in data
			($.data(element, "controllers") || $.data(element, "controllers", {}))[cls._fullName] = this;

			//adds bindings
			this._bindings = [];
			/**
			 * @attribute options
			 * Options is [jQuery.Controller.static.defaults] merged with the 2nd argument
			 * passed to a controller (or the first argument passed to the 
			 * [jquery.controller.plugin controller's jQuery plugin]).
			 * 
			 * For example:
			 * 
			 *     $.Controller("Tabs", 
			 *     {
			 *        defaults : {
			 *          activeClass: "ui-active-state"
			 *        }
			 *     },
			 *     {
			 *        init : function(){
			 *          this.element.addClass(this.options.activeClass);
			 *        }
			 *     })
			 *     
			 *     $("#tabs1").tabs()                         // adds 'ui-active-state'
			 *     $("#tabs2").tabs({activeClass : 'active'}) // adds 'active'
			 *     
			 *  
			 */
			this.options = $.extend($.extend(true, {}, cls.defaults), options);

			//go through the cached list of actions and use the processor to bind
			for ( funcName in cls.actions ) {
				if ( cls.actions.hasOwnProperty(funcName) ) {
					ready = cls.actions[funcName] || cls._getAction(funcName, this.options);
					this._bindings.push(
					ready.processor(element, ready.parts[2], ready.parts[1], this.callback(funcName), this));
				}
			}


			/**
			 * @attribute called
			 * String name of current function being called on controller instance.  This is 
			 * used for picking the right view in render.
			 * @hide
			 */
			this.called = "init";

			//setup to be destroyed ... don't bind b/c we don't want to remove it
			//this.element.bind('destroyed', this.callback('destroy'))
			var destroyCB = shifter(this.callback("destroy"));
			this.element.bind("destroyed", destroyCB);
			this._bindings.push(function( el ) {
				destroyCB.removed = true;
				$(element).unbind("destroyed", destroyCB);
			});

			/**
			 * @attribute element
			 * The controller instance's delegated element. This 
			 * is set by [jQuery.Controller.prototype.setup setup]. It 
			 * is a jQuery wrapped element.
			 * 
			 * For example, if I add MyWidget to a '#myelement' element like:
			 * 
			 *     $.Controller("MyWidget",{
			 *       init : function(){
			 *         this.element.css("color","red")
			 *       }
			 *     })
			 *     
			 *     $("#myelement").my_widget()
			 * 
			 * MyWidget will turn #myelement's font color red.
			 * 
			 * ## Using a different element.
			 * 
			 * Sometimes, you want a different element to be this.element.  A
			 * very common example is making progressively enhanced form widgets.
			 * 
			 * To change this.element, overwrite Controller's setup method like:
			 * 
			 *     $.Controller("Combobox",{
			 *       setup : function(el, options){
			 *          this.oldElement = $(el);
			 *          var newEl = $('<div/>');
			 *          this.oldElement.wrap(newEl);
			 *          this._super(newEl, options);
			 *       },
			 *       init : function(){
			 *          this.element //-> the div
			 *       },
			 *       ".option click" : function(){
			 *         // event handler bound on the div
			 *       },
			 *       destroy : function(){
			 *          var div = this.element; //save reference
			 *          this._super();
			 *          div.replaceWith(this.oldElement);
			 *       }
			 *     }
			 */
			return this.element;
		},
		/**
		 * Bind attaches event handlers that will be removed when the controller is removed.  
		 * This is a good way to attach to an element not in the controller's element.
		 * <br/>
		 * <h3>Examples:</h3>
		 * @codestart
		 * init: function() {
		 *    // calls somethingClicked(el,ev)
		 *    this.bind('click','somethingClicked') 
		 * 
		 *    // calls function when the window is clicked
		 *    this.bind(window, 'click', function(ev){
		 *      //do something
		 *    })
		 * },
		 * somethingClicked: function( el, ev ) {
		 *   
		 * }
		 * @codeend
		 * @param {HTMLElement|jQuery.fn} [el=this.element] The element to be bound
		 * @param {String} eventName The event to listen for.
		 * @param {Function|String} func A callback function or the String name of a controller function.  If a controller
		 * function name is given, the controller function is called back with the bound element and event as the first
		 * and second parameter.  Otherwise the function is called back like a normal bind.
		 * @return {Integer} The id of the binding in this._bindings
		 */
		bind: function( el, eventName, func ) {
			if ( typeof el == 'string' ) {
				func = eventName;
				eventName = el;
				el = this.element;
			}
			return this._binder(el, eventName, func);
		},
		_binder: function( el, eventName, func, selector ) {
			if ( typeof func == 'string' ) {
				func = shifter(this.callback(func));
			}
			this._bindings.push(binder(el, eventName, func, selector));
			return this._bindings.length;
		},
		/**
		 * Delegate will delegate on an elememt and will be undelegated when the controller is removed.
		 * This is a good way to delegate on elements not in a controller's element.<br/>
		 * <h3>Example:</h3>
		 * @codestart
		 * // calls function when the any 'a.foo' is clicked.
		 * this.delegate(document.documentElement,'a.foo', 'click', function(ev){
		 *   //do something
		 * })
		 * @codeend
		 * @param {HTMLElement|jQuery.fn} [element=this.element] the element to delegate from
		 * @param {String} selector the css selector
		 * @param {String} eventName the event to bind to
		 * @param {Function|String} func A callback function or the String name of a controller function.  If a controller
		 * function name is given, the controller function is called back with the bound element and event as the first
		 * and second parameter.  Otherwise the function is called back like a normal bind.
		 * @return {Integer} The id of the binding in this._bindings
		 */
		delegate: function( element, selector, eventName, func ) {
			if ( typeof element == 'string' ) {
				func = eventName;
				eventName = selector;
				selector = element;
				element = this.element;
			}
			return this._binder(element, eventName, func, selector);
		},
		/**
		 * Called if an controller's [jquery.controller.plugin jQuery helper] is called on an element that already has a controller instance
		 * of the same type.  Extends [jQuery.Controller.prototype.options this.options] with the options passed in.  If you overwrite this, you might want to call
		 * this._super.
		 * <h3>Examples</h3>
		 * @codestart
		 * $.Controller.extend("Thing",{
		 * init: function( el, options ) {
		 *    alert('init')
		 * },
		 * update: function( options ) {
		 *    this._super(options);
		 *    alert('update')
		 * }
		 * });
		 * $('#myel').thing(); // alerts init
		 * $('#myel').thing(); // alerts update
		 * @codeend
		 * @param {Object} options
		 */
		update: function( options ) {
			$.extend(this.options, options);
		},
		/**
		 * Destroy unbinds and undelegates all event handlers on this controller, 
		 * and prevents memory leaks.  This is called automatically
		 * if the element is removed.  You can overwrite it to add your own
		 * teardown functionality:
		 * 
		 *     $.Controller("ChangeText",{
		 *       init : function(){
		 *         this.oldText = this.element.text();
		 *         this.element.text("Changed!!!")
		 *       },
		 *       destroy : function(){
		 *         this.element.text(this.oldText);
		 *         this._super(); //Always call this!
		 *     })
		 * 
		 * You could call destroy manually on an element with ChangeText
		 * added like:
		 * 
		 *     $("#changed").change_text("destroy");
		 *     
		 * ### API
		 */
		destroy: function() {
			if ( this._destroyed ) {
				throw this.Class.shortName + " controller instance has been deleted";
			}
			var self = this,
				fname = this.Class._fullName,
				controllers;
			this._destroyed = true;
			this.element.removeClass(fname);

			$.each(this._bindings, function( key, value ) {
				if ( isFunction(value) ) {
					value(self.element[0]);
				}
			});

			delete this._actions;
			controllers = this.element.data("controllers");
			if ( controllers && controllers[fname] ) {
				delete controllers[fname];
			}
			$(this).triggerHandler("destroyed"); //in case we want to know if the controller is removed
			this.element = null;
		},
		/**
		 * Queries from the controller's element.
		 * @codestart
		 * ".destroy_all click" : function() {
		 *    this.find(".todos").remove();
		 * }
		 * @codeend
		 * @param {String} selector selection string
		 * @return {jQuery.fn} returns the matched elements
		 */
		find: function( selector ) {
			return this.element.find(selector);
		},
		//tells callback to set called on this.  I hate this.
		_set_called: true
	});


	//------------- PROCESSSORS -----------------------------
	//processors do the binding.  They return a function that
	//unbinds when called.
	//the basic processor that binds events
	basicProcessor = function( el, event, selector, cb, controller ) {
		var c = controller.Class;

		// document controllers use their name as an ID prefix.
		if ( c.onDocument && !/^Main(Controller)?$/.test(c.shortName) ) { //prepend underscore name if necessary
			selector = selector ? "#" + c._shortName + " " + selector : "#" + c._shortName;
		}
		return binder(el, event, shifter(cb), selector);
	};

	var processors = $.Controller.processors,

		//a window event only happens on the window
		windowEvent = function( el, event, selector, cb ) {
			return binder(window, event.replace(/window/, ""), shifter(cb));
		};

	//set commong events to be processed as a basicProcessor
	$.each("change click contextmenu dblclick keydown keyup keypress mousedown mousemove mouseout mouseover mouseup reset resize scroll select submit focusin focusout mouseenter mouseleave".split(" "), function( i, v ) {
		processors[v] = basicProcessor;
	});
	$.each(["windowresize", "windowscroll", "load", "unload", "hashchange"], function( i, v ) {
		processors[v] = windowEvent;
	});
	//the ready processor happens on the document
	processors.ready = function( el, event, selector, cb ) {
		$(shifter(cb)); //cant really unbind
	};
	/**
	 *  @add jQuery.fn
	 */

	//used to determine if a controller instance is one of controllers
	//controllers can be strings or classes
	var i, isAControllerOf = function( instance, controllers ) {
		for ( i = 0; i < controllers.length; i++ ) {
			if ( typeof controllers[i] == 'string' ? instance.Class._shortName == controllers[i] : instance instanceof controllers[i] ) {
				return true;
			}
		}
		return false;
	};

	/**
	 * @function controllers
	 * Gets all controllers in the jQuery element.
	 * @return {Array} an array of controller instances.
	 */
	$.fn.controllers = function() {
		var controllerNames = makeArray(arguments),
			instances = [],
			controllers;
		//check if arguments
		this.each(function() {
			var c, cname;

			controllers = $.data(this, "controllers");
			if (!controllers ) {
				return;
			}
			for ( cname in controllers ) {
				if ( controllers.hasOwnProperty(cname) ) {
					c = controllers[cname];
					if (!controllerNames.length || isAControllerOf(c, controllerNames) ) {
						instances.push(c);
					}
				}
			}
		});
		return instances;
	};
	/**
	 * @function controller
	 * Gets a controller in the jQuery element.  With no arguments, returns the first one found.
	 * @param {Object} controller (optional) if exists, the first controller instance with this class type will be returned.
	 * @return {jQuery.Controller} the first controller.
	 */
	$.fn.controller = function( controller ) {
		return this.controllers.apply(this, arguments)[0];
	};

})(jQuery);
(function( $ ) {

	// converts to an ok dom id
	var toId = function( src ) {
		return src.replace(/^\/\//, "").replace(/[\/\.]/g, "_");
	},
		// used for hookup ids
		id = 1;

	/**
	 * @class jQuery.View
	 * @tag core
	 * @plugin jquery/view
	 * @test jquery/view/qunit.html
	 * @download dist/jquery.view.js
	 * 
	 * View provides a uniform interface for using templates with 
	 * jQuery. When template engines [jQuery.View.register register] 
	 * themselves, you are able to:
	 * 
	 *  - Use views with jQuery extensions [jQuery.fn.after after], [jQuery.fn.append append],
	 *   [jQuery.fn.before before], [jQuery.fn.html html], [jQuery.fn.prepend prepend],
	 *      [jQuery.fn.replace replace], [jQuery.fn.replaceWith replaceWith], [jQuery.fn.text text].
	 *  - Template loading from html elements and external files.
	 *  - Synchronous and asynchronous template loading.
	 *  - Template caching.
	 *  - Bundling of processed templates in production builds.
	 *  - Hookup jquery plugins directly in the template.
	 *  
	 * ## Use
	 * 
	 * 
	 * When using views, you're almost always wanting to insert the results 
	 * of a rendered template into the page. jQuery.View overwrites the 
	 * jQuery modifiers so using a view is as easy as: 
	 * 
	 *     $("#foo").html('mytemplate.ejs',{message: 'hello world'})
	 *
	 * This code:
	 * 
	 *  - Loads the template a 'mytemplate.ejs'. It might look like:
	 *    <pre><code>&lt;h2>&lt;%= message %>&lt;/h2></pre></code>
	 *  
	 *  - Renders it with {message: 'hello world'}, resulting in:
	 *    <pre><code>&lt;div id='foo'>"&lt;h2>hello world&lt;/h2>&lt;/div></pre></code>
	 *  
	 *  - Inserts the result into the foo element. Foo might look like:
	 *    <pre><code>&lt;div id='foo'>&lt;h2>hello world&lt;/h2>&lt;/div></pre></code>
	 * 
	 * ## jQuery Modifiers
	 * 
	 * You can use a template with the following jQuery modifiers:
	 * 
	 * <table>
	 * <tr><td>[jQuery.fn.after after]</td><td> <code>$('#bar').after('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.after append] </td><td>  <code>$('#bar').append('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.after before] </td><td> <code>$('#bar').before('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.after html] </td><td> <code>$('#bar').html('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.after prepend] </td><td> <code>$('#bar').prepend('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.after replace] </td><td> <code>$('#bar').replace('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.after replaceWith] </td><td> <code>$('#bar').replaceWidth('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.after text] </td><td> <code>$('#bar').text('temp.jaml',{});</code></td></tr>
	 * </table>
	 * 
	 * You always have to pass a string and an object (or function) for the jQuery modifier 
	 * to user a template.
	 * 
	 * ## Template Locations
	 * 
	 * View can load from script tags or from files. 
	 * 
	 * ## From Script Tags
	 * 
	 * To load from a script tag, create a script tag with your template and an id like: 
	 * 
	 * <pre><code>&lt;script type='text/ejs' id='recipes'>
	 * &lt;% for(var i=0; i &lt; recipes.length; i++){ %>
	 *   &lt;li>&lt;%=recipes[i].name %>&lt;/li>
	 * &lt;%} %>
	 * &lt;/script></code></pre>
	 * 
	 * Render with this template like: 
	 * 
	 * @codestart
	 * $("#foo").html('recipes',recipeData)
	 * @codeend
	 * 
	 * Notice we passed the id of the element we want to render.
	 * 
	 * ## From File
	 * 
	 * You can pass the path of a template file location like:
	 * 
	 *     $("#foo").html('templates/recipes.ejs',recipeData)
	 * 
	 * However, you typically want to make the template work from whatever page they 
	 * are called from.  To do this, use // to look up templates from JMVC root:
	 * 
	 *     $("#foo").html('//app/views/recipes.ejs',recipeData)
	 *     
	 * Finally, the [jQuery.Controller.prototype.view controller/view] plugin can make looking
	 * up a thread (and adding helpers) even easier:
	 * 
	 *     $("#foo").html( this.view('recipes', recipeData) )
	 * 
	 * ## Packaging Templates
	 * 
	 * If you're making heavy use of templates, you want to organize 
	 * them in files so they can be reused between pages and applications.
	 * 
	 * But, this organization would come at a high price 
	 * if the browser has to 
	 * retrieve each template individually. The additional 
	 * HTTP requests would slow down your app. 
	 * 
	 * Fortunately, [steal.static.views steal.views] can build templates 
	 * into your production files. You just have to point to the view file like: 
	 * 
	 *     steal.views('path/to/the/view.ejs');
     *
	 * ## Asynchronous
	 * 
	 * By default, retrieving requests is done synchronously. This is 
	 * fine because StealJS packages view templates with your JS download. 
	 * 
	 * However, some people might not be using StealJS or want to delay loading 
	 * templates until necessary. If you have the need, you can 
	 * provide a callback paramter like: 
	 * 
	 *     $("#foo").html('recipes',recipeData, function(result){
	 *       this.fadeIn()
	 *     });
	 * 
	 * The callback function will be called with the result of the 
	 * rendered template and 'this' will be set to the original jQuery object.
	 * 
	 * ## Just Render Templates
	 * 
	 * Sometimes, you just want to get the result of a rendered 
	 * template without inserting it, you can do this with $.View: 
	 * 
	 *     var out = $.View('path/to/template.jaml',{});
	 *     
     * ## Preloading Templates
	 * 
	 * You can preload templates asynchronously like:
	 * 
	 *     $.View('path/to/template.jaml',{}, function(){});
	 * 
	 * ## Supported Template Engines
	 * 
	 * JavaScriptMVC comes with the following template languages:
	 * 
	 *   - EmbeddedJS
	 *     <pre><code>&lt;h2>&lt;%= message %>&lt;/h2></code></pre>
	 *     
	 *   - JAML
	 *     <pre><code>h2(data.message);</code></pre>
	 *     
	 *   - Micro
	 *     <pre><code>&lt;h2>{%= message %}&lt;/h2></code></pre>
	 *     
	 *   - jQuery.Tmpl
	 *     <pre><code>&lt;h2>${message}&lt;/h2></code></pre>

	 * 
	 * The popular <a href='http://awardwinningfjords.com/2010/08/09/mustache-for-javascriptmvc-3.html'>Mustache</a> 
	 * template engine is supported in a 2nd party plugin.
	 * 
	 * ## Using other Template Engines
	 * 
	 * It's easy to integrate your favorite template into $.View and Steal.  Read 
	 * how in [jQuery.View.register].
	 * 
	 * @constructor
	 * 
	 * Looks up a template, processes it, caches it, then renders the template
	 * with data and optional helpers.
	 * 
	 * With [stealjs StealJS], views are typically bundled in the production build.
	 * This makes it ok to use views synchronously like:
	 * 
	 * @codestart
	 * $.View("//myplugin/views/init.ejs",{message: "Hello World"})
	 * @codeend
	 * 
	 * If you aren't using StealJS, it's best to use views asynchronously like:
	 * 
	 * @codestart
	 * $.View("//myplugin/views/init.ejs",
	 *        {message: "Hello World"}, function(result){
	 *   // do something with result
	 * })
	 * @codeend
	 * 
	 * @param {String} view The url or id of an element to use as the template's source.
	 * @param {Object} data The data to be passed to the view.
	 * @param {Object} [helpers] Optional helper functions the view might use. Not all
	 * templates support helpers.
	 * @param {Object} [callback] Optional callback function.  If present, the template is 
	 * retrieved asynchronously.  This is a good idea if you aren't compressing the templates
	 * into your view.
	 * @return {String} The rendered result of the view.
	 */

	var $view, render, checkText, get;

	$view = $.View = function( view, data, helpers, callback ) {
		var suffix = view.match(/\.[\w\d]+$/),
			type, el, id, renderer, url = view;
                // if we have an inline template, derive the suffix from the 'text/???' part
                // this only supports '<script></script>' tags
                if ( el = document.getElementById(view)) {
                  suffix = el.type.match(/\/[\d\w]+$/)[0].replace(/^\//, '.');
                }
		if ( typeof helpers === 'function' ) {
			callback = helpers;
			helpers = undefined;
		}
		//if there is no suffix, add one
		if (!suffix ) {
			suffix = $view.ext;
			url = url + $view.ext;
		}

		//convert to a unique and valid id
		id = toId(url);

		//if a absolute path, use steal to get it
		if ( url.match(/^\/\//) ) {
			if (typeof steal === "undefined") {
				url = "/"+url.substr(2);
			}
			else {
				url = steal.root.join(url.substr(2));
			}
		}

		//get the template engine
		type = $view.types[suffix];

		//get the renderer function
		renderer =
		$view.cached[id] ? // is it cached?
		$view.cached[id] : // use the cached version
		((el = document.getElementById(view)) ? //is it in the document?
		type.renderer(id, el.innerHTML) : //use the innerHTML of the elemnt
		get(type, id, url, data, helpers, callback) //do an ajax request for it
		);
		// we won't always get a renderer (if async ajax)
		return renderer && render(renderer, type, id, data, helpers, callback);
	};
	// caches the template, renders the content, and calls back if it should
	render = function( renderer, type, id, data, helpers, callback ) {
		var res, stub;
		if ( $view.cache ) {
			$view.cached[id] = renderer;
		}
		res = renderer.call(type, data, helpers);
		stub = callback && callback(res);
		return res;
	};
	// makes sure there's a template
	checkText = function( text, url ) {
		if (!text.match(/[^\s]/) ) {
			throw "$.View ERROR: There is no template or an empty template at " + url;
		}
	};
	// gets a template, if there's a callback, renders and calls back its;ef
	get = function( type, id, url, data, helpers, callback ) {
		if ( callback ) {
			$.ajax({
				url: url,
				dataType: "text",
				error: function() {
					checkText("", url);
				},
				success: function( text ) {
					checkText(text, url);
					render(type.renderer(id, text), type, id, data, helpers, callback);
				}
			});
		} else {
			var text = $.ajax({
				async: false,
				url: url,
				dataType: "text",
				error: function() {
					checkText("", url);
				}
			}).responseText;
			checkText(text, url);
			return type.renderer(id, text);
		}

	};


	$.extend($view, {
		/**
		 * @attribute hookups
		 * @hide
		 * A list of pending 'hookups'
		 */
		hookups: {},
		/**
		 * @function hookup
		 * Registers a hookup function that can be called back after the html is 
		 * put on the page.  Typically this is handled by the template engine.  Currently
		 * only EJS supports this functionality.
		 * 
		 *     var id = $.View.hookup(function(el){
		 *            //do something with el
		 *         }),
		 *         html = "<div data-view-id='"+id+"'>"
		 *     $('.foo').html(html);
		 * 
		 * 
		 * @param {Function} cb a callback function to be called with the element
		 * @param {Number} the hookup number
		 */
		hookup: function( cb ) {
			var myid = ++id;
			$view.hookups[myid] = cb;
			return myid;
		},
		/**
		 * @attribute cached
		 * @hide
		 * Cached are put in this object
		 */
		cached: {},
		/**
		 * @attribute cache
		 * Should the views be cached or reloaded from the server. Defaults to true.
		 */
		cache: true,
		/**
		 * @function register
		 * Registers a template engine to be used with 
		 * view helpers and compression.  
		 * 
		 * ## Example
		 * 
		 * @codestart
		 * $.View.register({
		 * 	suffix : "tmpl",
		 * 	renderer: function( id, text ) {
		 * 		return function(data){
		 * 			return jQuery.render( text, data );
		 * 		}
		 * 	},
		 * 	script: function( id, text ) {
		 * 		var tmpl = $.tmpl(text).toString();
		 * 		return "function(data){return ("+
		 * 		  	tmpl+
		 * 			").call(jQuery, jQuery, data); }";
		 * 	}
		 * })
		 * @codeend
		 * Here's what each property does:
		 * 
 		 *    * suffix - files that use this suffix will be processed by this template engine
 		 *    * renderer - returns a function that will render the template provided by text
 		 *    * script - returns a string form of the processed template function.
		 * 
		 * @param {Object} info a object of method and properties 
		 * 
		 * that enable template integration:
		 * <ul>
		 *   <li>suffix - the view extension.  EX: 'ejs'</li>
		 *   <li>script(id, src) - a function that returns a string that when evaluated returns a function that can be 
		 *    used as the render (i.e. have func.call(data, data, helpers) called on it).</li>
		 *   <li>renderer(id, text) - a function that takes the id of the template and the text of the template and
		 *    returns a render function.</li>
		 * </ul>
		 */
		register: function( info ) {
			this.types["." + info.suffix] = info;
		},
		types: {},
		/**
		 * @attribute ext
		 * The default suffix to use if none is provided in the view's url.  
		 * This is set to .ejs by default.
		 */
		ext: ".ejs",
		/**
		 * Returns the text that 
		 * @hide 
		 * @param {Object} type
		 * @param {Object} id
		 * @param {Object} src
		 */
		registerScript: function( type, id, src ) {
			return "$.View.preload('" + id + "'," + $view.types["." + type].script(id, src) + ");";
		},
		/**
		 * @hide
		 * Called by a production script to pre-load a renderer function
		 * into the view cache.
		 * @param {String} id
		 * @param {Function} renderer
		 */
		preload: function( id, renderer ) {
			$view.cached[id] = function( data, helpers ) {
				return renderer.call(data, data, helpers);
			};
		}

	});


	//---- ADD jQUERY HELPERS -----
	//converts jquery functions to use views	
	var convert, modify, isTemplate, getCallback, hookupView, funcs;

	convert = function( func_name ) {
		var old = $.fn[func_name];

		$.fn[func_name] = function() {
			var args = $.makeArray(arguments),
				callbackNum, callback, self = this;

			//check if a template
			if ( isTemplate(args) ) {

				// if we should operate async
				if ((callbackNum = getCallback(args))) {
					callback = args[callbackNum];
					args[callbackNum] = function( result ) {
						modify.call(self, [result], old);
						callback.call(self, result);
					};
					$view.apply($view, args);
					return this;
				}

				//otherwise do the template now
				args = [$view.apply($view, args)];
			}

			return modify.call(this, args, old);
		};
	};
	// modifies the html of the element
	modify = function( args, old ) {
		var res, stub, hooks;

		//check if there are new hookups
		for ( var hasHookups in $view.hookups ) {
			break;
		}

		//if there are hookups, get jQuery object
		if ( hasHookups ) {
			hooks = $view.hookups;
			$view.hookups = {};
			args[0] = $(args[0]);
		}
		res = old.apply(this, args);

		//now hookup hookups
		if ( hasHookups ) {
			hookupView(args[0], hooks);
		}
		return res;
	};

	// returns true or false if the args indicate a template is being used
	isTemplate = function( args ) {
		var secArgType = typeof args[1];

		return typeof args[0] == "string" && (secArgType == 'object' || secArgType == 'function') && !args[1].nodeType && !args[1].jquery;
	};

	//returns the callback if there is one (for async view use)
	getCallback = function( args ) {
		return typeof args[3] === 'function' ? 3 : typeof args[2] === 'function' && 2;
	};

	hookupView = function( els , hooks) {
		//remove all hookups
		var hookupEls, 
			len, i = 0,
			id, func;
		els = els.filter(function(){
			return this.nodeType != 3; //filter out text nodes
		})
		hookupEls = els.add("[data-view-id]", els);
		len = hookupEls.length;
		for (; i < len; i++ ) {
			if ( hookupEls[i].getAttribute && (id = hookupEls[i].getAttribute('data-view-id')) && (func = hooks[id]) ) {
				func(hookupEls[i], id);
				delete hooks[id];
				hookupEls[i].removeAttribute('data-view-id');
			}
		}
		//copy remaining hooks back
		$.extend($view.hookups, hooks);
	};

	/**
	 *  @add jQuery.fn
	 */
	funcs = [
	/**
	 *  @function prepend
	 *  @parent jQuery.View
	 *  abc
	 */
	"prepend",
	/**
	 *  @function append
	 *  @parent jQuery.View
	 *  abc
	 */
	"append",
	/**
	 *  @function after
	 *  @parent jQuery.View
	 *  abc
	 */
	"after",
	/**
	 *  @function before
	 *  @parent jQuery.View
	 *  abc
	 */
	"before",
	/**
	 *  @function replace
	 *  @parent jQuery.View
	 *  abc
	 */
	"replace",
	/**
	 *  @function text
	 *  @parent jQuery.View
	 *  abc
	 */
	"text",
	/**
	 *  @function html
	 *  @parent jQuery.View
	 *  abc
	 */
	"html",
	/**
	 *  @function replaceWith
	 *  @parent jQuery.View
	 *  abc
	 */
	"replaceWith"];

	//go through helper funcs and convert
	for ( var i = 0; i < funcs.length; i++ ) {
		convert(funcs[i]);
	}

})(jQuery);
(function( $ ) {
	/**
	 * @add jQuery.String
	 */
	$.String.
	/**
	 * Splits a string with a regex correctly cross browser
	 * @param {Object} string
	 * @param {Object} regex
	 */
	rsplit = function( string, regex ) {
		var result = regex.exec(string),
			retArr = [],
			first_idx, last_idx;
		while ( result !== null ) {
			first_idx = result.index;
			last_idx = regex.lastIndex;
			if ( first_idx !== 0 ) {
				retArr.push(string.substring(0, first_idx));
				string = string.slice(first_idx);
			}
			retArr.push(result[0]);
			string = string.slice(result[0].length);
			result = regex.exec(string);
		}
		if ( string !== '' ) {
			retArr.push(string);
		}
		return retArr;
	};
})(jQuery);
(function( $ ) {
	var myEval = function(script){
			eval(script);
		},
		chop = function( string ) {
			return string.substr(0, string.length - 1);
		},
		rSplit = $.String.rsplit,
		extend = $.extend,
		isArray = $.isArray,
		clean = function( content ) {
				return content.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
		},
		EJS = function( options ) {
			//returns a renderer function
			if ( this.constructor != EJS ) {
				var ejs = new EJS(options);
				return function( data, helpers ) {
					return ejs.render(data, helpers);
				};
			}
			//so we can set the processor
			if ( typeof options == "function" ) {
				this.template = {};
				this.template.process = options;
				return;
			}
			//set options on self
			extend(this, EJS.options, options);
			this.template = compile(this.text, this.type, this.name);
		};
	/**
	 * @class jQuery.EJS
	 * 
	 * @plugin jquery/view/ejs
	 * @parent jQuery.View
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/view/ejs/ejs.js
	 * @test jquery/view/ejs/qunit.html
	 * 
	 * 
	 * Ejs provides <a href="http://www.ruby-doc.org/stdlib/libdoc/erb/rdoc/">ERB</a> 
	 * style client side templates.  Use them with controllers to easily build html and inject
	 * it into the DOM.
	 * <h3>Example</h3>
	 * The following generates a list of tasks:
	 * @codestart html
	 * &lt;ul>
	 * &lt;% for(var i = 0; i < tasks.length; i++){ %>
	 *     &lt;li class="task &lt;%= tasks[i].identity %>">&lt;%= tasks[i].name %>&lt;/li>
	 * &lt;% } %>
	 * &lt;/ul>
	 * @codeend
	 * For the following examples, we assume this view is in <i>'views\tasks\list.ejs'</i>
	 * <h2>Use</h2>
	 * There are 2 common ways to use Views: 
	 * <ul>
	 *     <li>Controller's [jQuery.Controller.prototype.view view function]</li>
	 *     <li>The jQuery Helpers: [jQuery.fn.after after], 
	 *                             [jQuery.fn.append append], 
	 *                             [jQuery.fn.before before], 
	 *                             [jQuery.fn.before html], 
	 *                             [jQuery.fn.before prepend], 
	 *                             [jQuery.fn.before replace], and 
	 *                             [jQuery.fn.before text].</li>
	 * </ul>
	 * <h3>View</h3>
	 * jQuery.Controller.prototype.view is the preferred way of rendering a view.  
	 * You can find all the options for render in 
	 * its [jQuery.Controller.prototype.view documentation], but here is a brief example of rendering the 
	 * <i>list.ejs</i> view from a controller:
	 * @codestart
	 * $.Controller.extend("TasksController",{
	 *     init: function( el ) {
	 *         Task.findAll({},this.callback('list'))
	 *     },
	 *     list: function( tasks ) {
	 *         this.element.html(
	 *          this.view("list", {tasks: tasks})
	 *        )
	 *     }
	 * })
	 * @codeend
	 * 
	 * ## Hooking up controllers
	 * 
	 * After drawing some html, you often want to add other widgets and plugins inside that html.
	 * View makes this easy.  You just have to return the Contoller class you want to be hooked up.
	 * 
	 * @codestart
	 * &lt;ul &lt;%= Mxui.Tabs%>>...&lt;ul>
	 * @codeend
	 * 
	 * You can even hook up multiple controllers:
	 * 
	 * @codestart
	 * &lt;ul &lt;%= [Mxui.Tabs, Mxui.Filler]%>>...&lt;ul>
	 * @codeend
	 * 
	 * <h2>View Helpers</h2>
	 * View Helpers return html code.  View by default only comes with 
	 * [jQuery.EJS.Helpers.prototype.view view] and [jQuery.EJS.Helpers.prototype.text text].
	 * You can include more with the view/helpers plugin.  But, you can easily make your own!
	 * Learn how in the [jQuery.EJS.Helpers Helpers] page.
	 * 
	 * @constructor Creates a new view
	 * @param {Object} options A hash with the following options
	 * <table class="options">
	 *     <tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
	 *     <tr>
	 *      <td>url</td>
	 *      <td>&nbsp;</td>
	 *      <td>loads the template from a file.  This path should be relative to <i>[jQuery.root]</i>.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>text</td>
	 *      <td>&nbsp;</td>
	 *      <td>uses the provided text as the template. Example:<br/><code>new View({text: '&lt;%=user%>'})</code>
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>element</td>
	 *      <td>&nbsp;</td>
	 *      <td>loads a template from the innerHTML or value of the element.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>type</td>
	 *      <td>'<'</td>
	 *      <td>type of magic tags.  Options are '&lt;' or '['
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>name</td>
	 *      <td>the element ID or url </td>
	 *      <td>an optional name that is used for caching.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>cache</td>
	 *      <td>true in production mode, false in other modes</td>
	 *      <td>true to cache template.
	 *      </td>
	 *     </tr>
	 *     
	 *    </tbody></table>
	 */
	$.EJS = EJS;
	/** 
	 * @Prototype
	 */
	EJS.prototype = {
		constructor: EJS,
		/**
		 * Renders an object with extra view helpers attached to the view.
		 * @param {Object} object data to be rendered
		 * @param {Object} extra_helpers an object with additonal view helpers
		 * @return {String} returns the result of the string
		 */
		render: function( object, extraHelpers ) {
			object = object || {};
			this._extra_helpers = extraHelpers;
			var v = new EJS.Helpers(object, extraHelpers || {});
			return this.template.process.call(object, object, v);
		}
	};
	/* @Static */


	EJS.
	/**
	 * Used to convert what's in &lt;%= %> magic tags to a string
	 * to be inserted in the rendered output.
	 * 
	 * Typically, it's a string, and the string is just inserted.  However,
	 * if it's a function or an object with a hookup method, it can potentially be 
	 * be ran on the element after it's inserted into the page.
	 * 
	 * This is a very nice way of adding functionality through the view.
	 * Usually this is done with [jQuery.EJS.Helpers.prototype.plugin]
	 * but the following fades in the div element after it has been inserted:
	 * 
	 * @codestart
	 * &lt;%= function(el){$(el).fadeIn()} %>
	 * @codeend
	 * 
	 * @param {String|Object|Function} input the value in between the
	 * write majic tags: &lt;%= %>
	 * @return {String} returns the content to be added to the rendered
	 * output.  The content is different depending on the type:
	 * 
	 *   * string - a bac
	 *   * foo - bar
	 */
	text = function( input ) {
		if ( typeof input == 'string' ) {
			return input;
		}
		if ( input === null || input === undefined ) {
			return '';
		}
		var hook = 
			(input.hookup && function( el, id ) {
				input.hookup.call(input, el, id);
			}) 
			||
			(typeof input == 'function' && input)
			||
			(isArray(input) && function( el, id ) {
				for ( var i = 0; i < input.length; i++ ) {
					var stub;
					stub = input[i].hookup ? input[i].hookup(el, id) : input[i](el, id);
				}
			});
		if(hook){
			return "data-view-id='" + $.View.hookup(hook) + "'";
		}
		return input.toString ? input.toString() : "";
	};

	//returns something you can call scan on
	var scan = function(scanner, source, block ) {
		var source_split = rSplit(source, /\n/),
			i=0;
		for (; i < source_split.length; i++ ) {
			scanline(scanner,  source_split[i], block);
		}
		
	},
	scanline= function(scanner,  line, block ) {
		scanner.lines++;
		var line_split = rSplit(line, scanner.splitter),
			token;
		for ( var i = 0; i < line_split.length; i++ ) {
			token = line_split[i];
			if ( token !== null ) {
				block(token, scanner);
			}
		}
	},
	makeScanner = function(left, right){
		var scanner = {};
		extend(scanner, {
			left: left + '%',
			right: '%' + right,
			dLeft: left + '%%',
			dRight: '%%' + right,
			eLeft: left + '%=',
			cmnt: left + '%#',
			scan : scan,
			lines : 0
		});
		scanner.splitter = new RegExp("(" + [scanner.dLeft, scanner.dRight, scanner.eLeft, 
		scanner.cmnt, scanner.left, scanner.right + '\n', scanner.right, '\n'].join(")|(").
			replace(/\[/g,"\\[").replace(/\]/g,"\\]") + ")");
		return scanner;
	},
	// compiles a template
	compile = function( source, left, name ) {
		source = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		//normalize line endings
		left = left || '<';
		var put_cmd = "___v1ew.push(",
			insert_cmd = put_cmd,
			buff = new EJS.Buffer(['var ___v1ew = [];'], []),
			content = '',
			put = function( content ) {
				buff.push(put_cmd, '"', clean(content), '");');
			},
			startTag = null,
			empty = function(){
				content = ''
			};
		
		scan( makeScanner(left, left === '[' ? ']' : '>') , 
			source||"", 
			function( token, scanner ) {
				// if we don't have a start pair
				if ( startTag === null ) {
					switch ( token ) {
					case '\n':
						content = content + "\n";
						put(content);
						buff.cr();
						empty();
						break;
					case scanner.left:
					case scanner.eLeft:
					case scanner.cmnt:
						startTag = token;
						if ( content.length > 0 ) {
							put(content);
						}
						empty();
						break;

						// replace <%% with <%
					case scanner.dLeft:
						content += scanner.left;
						break;
					default:
						content +=  token;
						break;
					}
				}
				else {
					switch ( token ) {
					case scanner.right:
						switch ( startTag ) {
						case scanner.left:
							if ( content[content.length - 1] == '\n' ) {
								content = chop(content);
								buff.push(content, ";");
								buff.cr();
							}
							else {
								buff.push(content, ";");
							}
							break;
						case scanner.eLeft:
							buff.push(insert_cmd, "(jQuery.EJS.text(", content, ")));");
							break;
						}
						startTag = null;
						empty();
						break;
					case scanner.dRight:
						content += scanner.right;
						break;
					default:
						content += token;
						break;
					}
				}
			})
		if ( content.length > 0 ) {
			// Should be content.dump in Ruby
			buff.push(put_cmd, '"', clean(content) + '");');
		}
		var template = buff.close(),
			out = {
				out : 'try { with(_VIEW) { with (_CONTEXT) {' + template + " return ___v1ew.join('');}}}catch(e){e.lineNumber=null;throw e;}"
			};
		//use eval instead of creating a function, b/c it is easier to debug
		myEval.call(out,'this.process = (function(_CONTEXT,_VIEW){' + out.out + '});\r\n//@ sourceURL='+name+".js");
		return out;
	};


	// a line and script buffer
	// we use this so we know line numbers when there
	// is an error.  
	// pre and post are setup and teardown for the buffer
	EJS.Buffer = function( pre_cmd, post ) {
		this.line = [];
		this.script = [];
		this.post = post;

		// add the pre commands to the first line
		this.push.apply(this, pre_cmd);
	};
	EJS.Buffer.prototype = {
		//need to maintain your own semi-colons (for performance)
		push: function() {
			this.line.push.apply(this.line, arguments);
		},

		cr: function() {
			this.script.push(this.line.join(''), "\n");
			this.line = [];
		},
		//returns the script too
		close: function() {
			var stub;

			if ( this.line.length > 0 ) {
				this.script.push(this.line.join(''));
				this.line = [];
			}

			stub = this.post.length && this.push.apply(this, this.post);

			this.script.push(";"); //makes sure we always have an ending /
			return this.script.join("");
		}

	};
	

	//type, cache, folder
	/**
	 * @attribute options
	 * Sets default options for all views
	 * <table class="options">
	 * <tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
	 * <tr>
	 * <td>type</td>
	 * <td>'<'</td>
	 * <td>type of magic tags.  Options are '&lt;' or '['
	 * </td>
	 * </tr>
	 * <tr>
	 * <td>cache</td>
	 * <td>true in production mode, false in other modes</td>
	 * <td>true to cache template.
	 * </td>
	 * </tr>
	 * </tbody></table>
	 * 
	 */
	EJS.options = {
		type: '<',
		ext: '.ejs'
	};




	/**
	 * @class jQuery.EJS.Helpers
	 * @parent jQuery.EJS
	 * By adding functions to jQuery.EJS.Helpers.prototype, those functions will be available in the 
	 * views.
	 * @constructor Creates a view helper.  This function is called internally.  You should never call it.
	 * @param {Object} data The data passed to the view.  Helpers have access to it through this._data
	 */
	EJS.Helpers = function( data, extras ) {
		this._data = data;
		this._extras = extras;
		extend(this, extras);
	};
	/* @prototype*/
	EJS.Helpers.prototype = {
		/**
		 * Makes a plugin
		 * @param {String} name the plugin name
		 */
		plugin: function( name ) {
			var args = $.makeArray(arguments),
				widget = args.shift();
			return function( el ) {
				var jq = $(el);
				jq[widget].apply(jq, args);
			};
		},
		/**
		 * Renders a partial view.  This is deprecated in favor of <code>$.View()</code>.
		 */
		view: function( url, data, helpers ) {
			helpers = helpers || this._extras;
			data = data || this._data;
			return $.View(url, data, helpers); //new EJS(options).render(data, helpers);
		}
	};


	$.View.register({
		suffix: "ejs",
		//returns a function that renders the view
		script: function( id, src ) {
			return "jQuery.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
				text: src
			}).template.out + " })";
		},
		renderer: function( id, text ) {
			var ejs = new EJS({
				text: text,
				name: id
			});
			return function( data, helpers ) {
				return ejs.render.call(ejs, data, helpers);
			};
		}
	});
})(jQuery);
(function( $ ) {
	var getSetZero = function( v ) {
		return v !== undefined ? (this.array[0] = v) : this.array[0];
	},
		getSetOne = function( v ) {
			return v !== undefined ? (this.array[1] = v) : this.array[1];
		};
	/**
	 * @class jQuery.Vector
	 * A vector class
	 * @constructor creates a new vector instance from the arguments.  Example:
	 * @codestart
	 * new jQuery.Vector(1,2)
	 * @codeend
	 * 
	 */
	$.Vector = function() {
		this.update($.makeArray(arguments));
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector.  Returns the new vector.
		 * @param {Function} f
		 * @return {jQuery.Vector} new vector class.
		 */
		app: function( f ) {
			var i, vec, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i]));
			}
			vec = new $.Vector();
			return vec.update(newArr);
		},
		/**
		 * Adds two vectors together.  Example:
		 * @codestart
		 * new Vector(1,2).plus(2,3) //-> &lt;3,5>
		 * new Vector(3,5).plus(new Vector(4,5)) //-> &lt;7,10>
		 * @codeend
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Like plus but subtracts 2 vectors
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.  
		 * False if otherwise.
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
/*
	 * Returns the 2nd value of the vector
	 * @return {Number}
	 */
		x: getSetZero,
		width: getSetZero,
		/**
		 * Returns the first value of the vector
		 * @return {Number}
		 */
		y: getSetOne,
		height: getSetOne,
		/**
		 * Same as x()
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * same as y()
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * returns (x,y)
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array[0] + "," + this.array[1] + ")";
		},
		/**
		 * Replaces the vectors contents
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(this.pageX, this.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};
})(jQuery);
(function() {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		findHelper = function( events, types, callback ) {
			var t, type, typeHandlers, all, h, handle, namespaces, namespace;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					if (!handle.selector && (all || namespace.test(handle.namespace)) ) {
						callback(type, handle.origHandler || handle.handler);
					}
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = $.data(el, "events"),
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}

		if ( selector ) {
			if (!events.live ) {
				return [];
			}
			live = events.live;

			for ( t = 0; t < live.length; t++ ) {
				liver = live[t];
				if ( liver.selector === selector && $.inArray(liver.origType, types) !== -1 ) {
					handlers.push(liver.origHandler || liver.handler);
				}
			}
		} else {
			// basically re-create handler's logic
			findHelper(events, types, function( type, handler ) {
				handlers.push(handler);
			});
		}
		return handlers;
	};
	/**
	 * Finds 
	 * @param {HTMLElement} el
	 * @param {Array} types
	 */
	event.findBySelector = function( el, types ) {
		var events = $.data(el, "events"),
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});
		//then check straight binds
		findHelper(events, types, function( type, handler ) {
			add("", type, handler);
		});

		return selectors;
	};
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {

			var bySelector, selector = handleObj.selector || "";
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};
})(jQuery);
(function( $ ) {
	//modify live
	//steal the live handler ....
	var bind = function( object, method ) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function() {
			var args2 = [this].concat(args, $.makeArray(arguments));
			return method.apply(object, args2);
		};
	},
		event = $.event;
	// var handle = event.handle; //unused
	/**
	 * @class jQuery.Drag
	 * @parent specialevents
	 * @plugin jquery/event/drag
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/drag.js
	 * @test jquery/event/drag/qunit.html
	 * Provides drag events as a special events to jQuery.  
	 * A jQuery.Drag instance is created on a drag and passed
	 * as a parameter to the drag event callbacks.  By calling
	 * methods on the drag event, you can alter the drag's
	 * behavior.
	 * <h2>Drag Events</h2>
	 * The drag plugin allows you to listen to the following events:
	 * <ul>
	 *  <li><code>dragdown</code> - the mouse cursor is pressed down</li>
	 *  <li><code>draginit</code> - the drag motion is started</li>
	 *  <li><code>dragmove</code> - the drag is moved</li>
	 *  <li><code>dragend</code> - the drag has ended</li>
	 *  <li><code>dragover</code> - the drag is over a drop point</li>
	 *  <li><code>dragout</code> - the drag moved out of a drop point</li>
	 * </ul>
	 * <p>Just by binding or delegating on one of these events, you make
	 * the element dragable.  You can change the behavior of the drag
	 * by calling methods on the drag object passed to the callback.
	 * <h3>Example</h3>
	 * Here's a quick example:
	 * @codestart
	 * //makes the drag vertical
	 * $(".drags").live("draginit", function(event, drag){
	 *   drag.vertical();
	 * })
	 * //gets the position of the drag and uses that to set the width
	 * //of an element
	 * $(".resize").live("dragmove",function(event, drag){
	 *   $(this).width(drag.position.left() - $(this).offset().left   )
	 * })
	 * @codeend
	 * <h2>Drag Object</h2>
	 * <p>The drag object is passed after the event to drag 
	 * event callback functions.  By calling methods
	 * and changing the properties of the drag object,
	 * you can alter how the drag behaves.
	 * </p>
	 * <p>The drag properties and methods:</p>
	 * <ul>
	 *  <li><code>[jQuery.Drag.prototype.cancel cancel]</code> - stops the drag motion from happening</li>
	 *  <li><code>[jQuery.Drag.prototype.ghost ghost]</code> - copys the draggable and drags the cloned element</li>
	 *  <li><code>[jQuery.Drag.prototype.horizontal horizontal]</code> - limits the scroll to horizontal movement</li>
	 *  <li><code>[jQuery.Drag.prototype.location location]</code> - where the drag should be on the screen</li>
	 *  <li><code>[jQuery.Drag.prototype.mouseElementPosition mouseElementPosition]</code> - where the mouse should be on the drag</li>
	 *  <li><code>[jQuery.Drag.prototype.only only]</code> - only have drags, no drops</li>
	 *  <li><code>[jQuery.Drag.prototype.representative representative]</code> - move another element in place of this element</li>
	 *  <li><code>[jQuery.Drag.prototype.revert revert]</code> - animate the drag back to its position</li>
	 *  <li><code>[jQuery.Drag.prototype.vertical vertical]</code> - limit the drag to vertical movement</li>
	 *  <li><code>[jQuery.Drag.prototype.limit limit]</code> - limit the drag within an element (*limit plugin)</li>
	 *  <li><code>[jQuery.Drag.prototype.scrolls scrolls]</code> - scroll scrollable areas when dragging near their boundries (*scroll plugin)</li>
	 * </ul>
	 * <h2>Demo</h2>
	 * Now lets see some examples:
	 * @demo jquery/event/drag/drag.html 1000
	 * @constructor
	 * The constructor is never called directly.
	 */
	$.Drag = function() {};

	/**
	 * @Static
	 */
	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown: function( ev, element ) {
			var isLeftButton = ev.button === 0 || ev.button == 1;
			if (!isLeftButton || this.current ) {
				return;
			} //only allows 1 drag at a time, but in future could allow more
			//ev.preventDefault();
			//create Drag
			var drag = new $.Drag(),
				delegate = ev.liveFired || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.liveFired || element,
				selector: ev.handleObj.selector,
				moved: false,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector)
				},
				destroyed: function() {
					self.current = null;
				}
			}, ev);
		}
	});





	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype, {
		setup: function( options, ev ) {
			//this.noSelection();
			$.extend(this, options);
			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			$(document).bind('mousemove', mousemove);
			$(document).bind('mouseup', mouseup);

			if (!this.callEvents('down', this.element, ev) ) {
				ev.preventDefault();
			}
		},
		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy: function() {
			$(document).unbind('mousemove', this._mousemove);
			$(document).unbind('mouseup', this._mouseup);
			if (!this.moved ) {
				this.event = this.element = null;
			}
			//this.selection();
			this.destroyed();
		},
		mousemove: function( docEl, ev ) {
			if (!this.moved ) {
				this.init(this.element, ev);
				this.moved = true;
			}

			var pointer = ev.vector();
			if ( this._start_position && this._start_position.equals(pointer) ) {
				return;
			}
			//e.preventDefault();
			this.draw(pointer, ev);
		},
		mouseup: function( docEl, event ) {
			//if there is a current, we should call its dragstop
			if ( this.moved ) {
				this.end(event);
			}
			this.destroy();
		},
		noSelection: function() {
			document.documentElement.onselectstart = function() {
				return false;
			};
			document.documentElement.unselectable = "on";
			$(document.documentElement).css('-moz-user-select', 'none');
		},
		selection: function() {
			document.documentElement.onselectstart = function() {};
			document.documentElement.unselectable = "off";
			$(document.documentElement).css('-moz-user-select', '');
		},
		init: function( element, event ) {
			element = $(element);
			var startElement = (this.movingElement = (this.element = $(element))); //the element that has been clicked on
			//if a mousemove has come after the click
			this._cancelled = false; //if the drag has been cancelled
			this.event = event;
			this.mouseStartPosition = event.vector(); //where the mouse is located
			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			//this.callStart(element, event);
			this.callEvents('init', element, event);

			//Check what they have set and respond accordingly
			//  if they canceled
			if ( this._cancelled === true ) {
				return;
			}
			//if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function( that ) {
			var style, pos = that.css('position');

			if (!pos || pos == 'static' ) {
				style = {
					position: 'relative'
				};

				if ( window.opera ) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function( type, element, event, drop ) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for ( i = 0; i < cbs.length; i++ ) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {Vector}
		 */
		currentDelta: function() {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function( pointer, event ) {
			// only drag if we haven't been cancelled;
			if ( this._cancelled ) {
				return;
			}
			/**
			 * @attribute location
			 * The location of where the element should be in the page.  This 
			 * takes into account the start position of the cursor on the element.
			 */
			this.location = pointer.minus(this.mouseElementPosition); // the offset between the mouse pointer and the representative that the user asked for
			// position = mouse - (dragOffset - dragTopLeft) - mousePosition
			this.move(event);
			if ( this._cancelled ) {
				return;
			}
			if (!event.isDefaultPrevented() ) {
				this.position(this.location);
			}

			//fill in
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.show(pointer, this, event);
			}
		},
		/**
		 * Sets the position of this drag.  
		 * 
		 * The limit and scroll plugins
		 * overwrite this to make sure the drag follows a particular path.
		 * 
		 * @param {jQuery.Vector} newOffsetv the position of the element (not the mouse)
		 */
		position: function( newOffsetv ) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
				//  the drag element's current left + top css attributes
				dragged_element_position_vector = // the vector between the movingElement's page and css positions
				this.movingElement.offsetv().minus(dragged_element_css_offset); // this can be thought of as the original offset
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			//dragged_element vector can probably be cached.
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal ) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical ) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function( event ) {
			this.callEvents('move', this.element, event);
		},
		over: function( event, drop ) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function( event, drop ) {
			this.callEvents('out', this.element, event, drop);
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end: function( event ) {
			if ( this._cancelled ) {
				return;
			}
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if ( this._revert ) {
				var self = this;
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function() {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup();
			}
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup: function() {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if ( this.movingElement[0] !== this.element[0] ) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if ( this._removeMovingElement ) {
				this.movingElement.remove();
			}

			this.movingElement = this.element = this.event = null;
		},
		/**
		 * Stops drag drop from running.
		 */
		cancel: function() {
			this._cancelled = true;
			//this.end(this.event);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},
		/**
		 * Clones the element and uses it as the moving element.
		 * @return {jQuery.fn} the ghost
		 */
		ghost: function( loc ) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			(loc ? $(loc) : this.movingElement).after(ghost);
			ghost.width(this.movingElement.width()).height(this.movingElement.height());

			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * Use a representative element, instead of the movingElement.
		 * @param {HTMLElement} element the element you want to actually drag
		 * @param {Number} offsetX the x position where you want your mouse on the object
		 * @param {Number} offsetY the y position where you want your mouse on the object
		 */
		representative: function( element, offsetX, offsetY ) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;

			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();

			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
		},
		/**
		 * Makes the movingElement go back to its original position after drop.
		 * @codestart
		 * ".handle dragend" : function( el, ev, drag ) {
		 *    drag.revert()
		 * }
		 * @codeend
		 * @param {Boolean} [val] optional, set to false if you don't want to revert.
		 */
		revert: function( val ) {
			this._revert = val === null ? true : val;
		},
		/**
		 * Isolates the drag to vertical movement.
		 */
		vertical: function() {
			this._vertical = true;
		},
		/**
		 * Isolates the drag to horizontal movement.
		 */
		horizontal: function() {
			this._horizontal = true;
		},


		/**
		 * Respondables will not be alerted to this drag.
		 */
		only: function( only ) {
			return (this._only = (only === undefined ? true : only));
		}
	});

	/**
	 * @add jQuery.event.special
	 */
	event.setupHelper([
	/**
	 * @attribute dragdown
	 * <p>Listens for when a drag movement has started on a mousedown.
	 * If you listen to this, the mousedown's default event (preventing
	 * text selection) is not prevented.  You are responsible for calling it
	 * if you want it (you probably do).  </p>
	 * <p><b>Why might you not want it?</b></p>
	 * <p>You might want it if you want to allow text selection on element
	 * within the drag element.  Typically these are input elements.</p>
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 * @codestart
	 * $(".handles").live("dragdown", function(ev, drag){})
	 * @codeend
	 */
	'dragdown',
	/**
	 * @attribute draginit
	 * Called when the drag starts.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'draginit',
	/**
	 * @attribute dragover
	 * Called when the drag is over a drop.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragover',
	/**
	 * @attribute dragmove
	 * Called when the drag is moved.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragmove',
	/**
	 * @attribute dragout
	 * When the drag leaves a drop point.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragout',
	/**
	 * @attribute dragend
	 * Called when the drag is done.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragend'], "mousedown", function( e ) {
		$.Drag.mousedown.call($.Drag, e, this);

	});




})(jQuery);
(function( $ ) {

	var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
		rupper = /([A-Z])/g,
		rdashAlpha = /-([a-z])/ig,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		getStyle = function( elem ) {
			if ( getComputedStyle ) {
				return getComputedStyle(elem, null);
			}
			else if ( elem.currentStyle ) {
				return elem.currentStyle;
			}
		},
		rfloat = /float/i,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/;
	/**
	 * @add jQuery
	 */
	//
	/**
	 * @function curStyles
	 * @param {HTMLElement} el
	 * @param {Array} styles An array of style names like <code>['marginTop','borderLeft']</code>
	 * @return {Object} an object of style:value pairs.  Style names are camelCase.
	 */
	$.curStyles = function( el, styles ) {
		if (!el ) {
			return null;
		}
		var currentS = getStyle(el),
			oldName, val, style = el.style,
			results = {},
			i = 0,
			left, rsLeft, camelCase, name;

		for (; i < styles.length; i++ ) {
			name = styles[i];
			oldName = name.replace(rdashAlpha, fcamelCase);

			if ( rfloat.test(name) ) {
				name = jQuery.support.cssFloat ? "float" : "styleFloat";
				oldName = "cssFloat";
			}

			if ( getComputedStyle ) {
				name = name.replace(rupper, "-$1").toLowerCase();
				val = currentS.getPropertyValue(name);
				if ( name === "opacity" && val === "" ) {
					val = "1";
				}
				results[oldName] = val;
			} else {
				camelCase = name.replace(rdashAlpha, fcamelCase);
				results[oldName] = currentS[name] || currentS[camelCase];


				if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) { //convert to px
					// Remember the original values
					left = style.left;
					rsLeft = el.runtimeStyle.left;

					// Put in the new values to get a computed value out
					el.runtimeStyle.left = el.currentStyle.left;
					style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
					results[oldName] = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					el.runtimeStyle.left = rsLeft;
				}

			}
		}

		return results;
	};
	/**
	 *  @add jQuery.fn
	 */


	$.fn
	/**
	 * @parent dom
	 * @plugin jquery/dom/cur_styles
	 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/cur_styles/cur_styles.js
	 * @test jquery/dom/cur_styles/qunit.html
	 * Use curStyles to rapidly get a bunch of computed styles from an element.
	 * <h3>Quick Example</h3>
	 * @codestart
	 * $("#foo").curStyles('float','display') //->
	 * // {
	 * //  cssFloat: "left", display: "block"
	 * // }
	 * @codeend
	 * <h2>Use</h2>
	 * <p>An element's <b>computed</b> style is the current calculated style of the property.
	 * This is different than the values on <code>element.style</code> as
	 * <code>element.style</code> doesn't reflect styles provided by css or the browser's default
	 * css properties.</p>
	 * <p>Getting computed values individually is expensive! This plugin lets you get all
	 * the style properties you need all at once.</p>
	 * <h2>Demo</h2>
	 * <p>The following demo illustrates the performance improvement curStyle provides by providing
	 * a faster 'height' jQuery function called 'fastHeight'.</p>
	 * @demo jquery/dom/cur_styles/cur_styles.html
	 * @param {String} style pass style names as arguments
	 * @return {Object} an object of style:value pairs
	 */
	.curStyles = function() {
		return $.curStyles(this[0], $.makeArray(arguments));
	};
})(jQuery);
(function($) {
/**
 * @page dimensions dimensions
 * @parent dom
 * <h1>jquery/dom/dimensions <span class="Constructor type">Plugin</span></h1>
 * The dimensions plugin adds support for setting+animating inner+outer height and widths.
 * <h3>Quick Examples</h3>
@codestart
$('#foo').outerWidth(100).innerHeight(50);
$('#bar').animate({outerWidth: 500});
@codeend
 * <h2>Use</h2>
 * <p>When writing reusable plugins, you often want to 
 * set or animate an element's width and height that include its padding,
 * border, or margin.  This is especially important in plugins that
 * allow custom styling.
 * The dimensions plugin overwrites [jQuery.fn.outerHeight outerHeight],
 * [jQuery.fn.outerWidth outerWidth], [jQuery.fn.innerHeight innerHeight] 
 * and [jQuery.fn.innerWidth innerWidth]
 * to let you set and animate these properties.
 * </p>
 * <h2>Demo</h2>
 * @demo jquery/dom/dimensions/dimensions.html
 */

var weird = /button|select/i, //margin is inside border
	getBoxes = {},
    checks = {
        width: ["Left", "Right"],
        height: ['Top', 'Bottom'],
        oldOuterHeight: $.fn.outerHeight,
        oldOuterWidth: $.fn.outerWidth,
        oldInnerWidth: $.fn.innerWidth,
        oldInnerHeight: $.fn.innerHeight
    };
/**
 *  @add jQuery.fn
 */
$.each({ 

/*
 * @function outerWidth
 * @parent dimensions
 * Lets you set the outer height on an object
 * @param {Number} [height] 
 * @param {Boolean} [includeMargin]
 */
width: 
/*
 * @function innerWidth
 * @parent dimensions
 * Lets you set the inner height of an object
 * @param {Number} [height] 
 */
"Width", 
/*
 * @function outerHeight
 * @parent dimensions
 * Lets you set the outer height of an object where: <br/> 
 * <code>outerHeight = height + padding + border + (margin)</code>.  
 * @codestart
 * $("#foo").outerHeight(100); //sets outer height
 * $("#foo").outerHeight(100, true); //uses margins
 * $("#foo").outerHeight(); //returns outer height
 * $("#foo").outerHeight(true); //returns outer height with margins
 * @codeend
 * When setting the outerHeight, it adjusts the height of the element.
 * @param {Number|Boolean} [height] If a number is provided -> sets the outer height of the object.<br/>
 * If true is given ->  returns the outer height and includes margins.<br/>
 * If no value is given -> returns the outer height without margin.
 * @param {Boolean} [includeMargin] Makes setting the outerHeight adjust for margin.
 * @return {jQuery|Number} If you are setting the value, returns the jQuery wrapped elements.
 * Otherwise, returns outerHeight in pixels.
 */
height: 
/*
 * @function innerHeight
 * @parent dimensions
 * Lets you set the outer width on an object
 * @param {Number} [height] 
 */
"Height" }, function(lower, Upper) {

    //used to get the padding and border for an element in a given direction
    getBoxes[lower] = function(el, boxes) {
        var val = 0;
        if (!weird.test(el.nodeName)) {
            //make what to check for ....
            var myChecks = [];
            $.each(checks[lower], function() {
                var direction = this;
                $.each(boxes, function(name, val) {
                    if (val)
                        myChecks.push(name + direction+ (name == 'border' ? "Width" : "") );
                })
            })
            $.each($.curStyles(el, myChecks), function(name, value) {
                val += (parseFloat(value) || 0);
            })
        }
        return val;
    }

    //getter / setter
    $.fn["outer" + Upper] = function(v, margin) {
        if (typeof v == 'number') {
            this[lower](v - getBoxes[lower](this[0], {padding: true, border: true, margin: margin}))
            return this;
        } else {
            return checks["oldOuter" + Upper].call(this, v)
        }
    }
    $.fn["inner" + Upper] = function(v) {
        if (typeof v == 'number') {
            this[lower](v - getBoxes[lower](this[0], { padding: true }))
            return this;
        } else {
            return checks["oldInner" + Upper].call(this, v)
        }
    }
    //provides animations
	var animate = function(boxes){
		return function(fx){
			if (fx.state == 0) {
	            fx.start = $(fx.elem)[lower]();
	            fx.end = fx.end - getBoxes[lower](fx.elem,boxes);
	        }
	        fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
		}
	}
    $.fx.step["outer" + Upper] = animate({padding: true, border: true})
	
	$.fx.step["outer" + Upper+"Margin"] =  animate({padding: true, border: true, margin: true})
	
	$.fx.step["inner" + Upper] = animate({padding: true})

})

})(jQuery);
(function($){
	/**
	 * @add jQuery.event.special
	 */
	var resizeCount = 0, 
		win = $(window),
		windowWidth = win.width(), 
		windowHeight = win.height(), 
		timer;
	/**
	 * @attribute resize
	 * @parent specialevents
	 * Normalizes resize events cross browser.
	 * <p>This only allows native resize events on the window and prevents them from being called 
	 * indefinitely.
	 * </p>
	 */
	$.event.special.resize = {
		add: function( handleObj ) {
			//jQuery.event.add( this, handleObj.origType, jQuery.extend({}, handleObj, {handler: liveHandler}) );
			
			var origHandler = handleObj.handler;
			handleObj.origHandler = origHandler;
			
			handleObj.handler = function(ev, data){							
			    if((this !== window) || (resizeCount === 0 && !ev.originalEvent)){
				     resizeCount++;
			         handleObj.origHandler.call(this, ev, data);
					 resizeCount--;
			    }
			    var width = win.width();
				var height = win.height();
				if(resizeCount ===  0 && (width != windowWidth ||height != windowHeight)){
					windowWidth = width;
					windowHeight = height;
					clearTimeout(timer)
					timer = setTimeout(function(){
						win.triggerHandler("resize");
					},1)
			        
			    }					
			}
		},
		
		setup: function() {
			return this !== window;
		}
	}
})(jQuery);
(function( $ ) {
	//evil things we should ignore
	var matches = /script|td/,

		// if we are trying to fill the page
		isThePage = function( el ) {
			return el === document || el === document.documentElement || el === window || el === document.body
		},
		//if something lets margins bleed through
		bleeder = function( el ) {
			if ( el[0] == window ) {
				return false;
			}
			var styles = el.curStyles('borderBottomWidth', 'paddingBottom')
			return !parseInt(styles.borderBottomWidth) && !parseInt(styles.paddingBottom)
		},
		//gets the bottom of this element
		bottom = function( el, offset ) {
			//where offsetTop starts
			return el.outerHeight() + offset(el);
		}
		pageOffset = function( el ) {
			return el.offset().top
		},
		offsetTop = function( el ) {
			return el[0].offsetTop;
		},
		inFloat = function( el, parent ) {
			while ( el && el != parent ) {
				var flt = $(el).css('float')
				if ( flt == 'left' || flt == 'right' ) {
					return flt;
				}
				el = el.parentNode
			}
		},
		filler = $.fn.mxui_filler = function( options ) {
			options || (options = {});
			options.parent || (options.parent = $(this).parent())
			options.parent = $(options.parent)
			var thePage = isThePage(options.parent[0])
			if ( thePage ) {
				options.parent = $(window)
			}
			var evData = {
				filler: this,
				inFloat: inFloat(this[0], thePage ? document.body : options.parent[0])
			};
			$(options.parent).bind('resize', evData, filler.parentResize);
			//if this element is removed, take it out


			this.bind('destroyed', evData, function( ev ) {
				ev.filler.removeClass('mxui_filler')
				$(options.parent).unbind('resize', filler.parentResize)
			});

			this.addClass('mxui_filler')
			//add a resize to get things going
			var func = function() {
				//logg("triggering ..")
				setTimeout(function() {
					options.parent.triggerHandler("resize");
				}, 13)
			}
			if ( $.isReady ) {
				func();
			} else {
				$(func)
			}
			return this;
		};
	$.extend(filler, {
		parentResize: function( ev ) {

			var parent = $(this),
				isWindow = this == window,
				container = (isWindow ? $(document.body) : parent),

				//if the parent bleeds margins, we don't care what the last element's margin is
				isBleeder = bleeder(parent),
				children = container.children().filter(function() {
					if ( matches.test(this.nodeName.toLowerCase()) ) {
						return false;
					}

					var get = $.curStyles(this, ['position', 'display']);
					return get.position !== "absolute" && get.position !== "fixed" && get.display !== "none" && !jQuery.expr.filters.hidden(this)
				}),
				last = children.eq(-1),

				offsetParentIsContainer = ev.data.filler.offsetParent()[0] === container[0]
				//if the last element shares our containers offset parent or is the container
				//we can just use offsetTop
				offset = offsetParentIsContainer || last.offsetParent()[0] == container.offsetParent()[0] ? offsetTop : pageOffset;
			//the offset of the container
			firstOffset = offsetParentIsContainer ? 0 : offset(container), parentHeight = parent.height();

			if ( isBleeder ) {
				//temporarily add a small div to use to figure out the 'bleed-through' margin
				//of the last element
				last = $('<div style="height: 0px; line-height:0px;overflow:hidden;' + (ev.data.inFloat ? 'clear: both' : '') + ';"/>')



				.appendTo(container);
			}

			// the current size the content is taking up
			var currentSize = (bottom(last, offset) - 0) - firstOffset,

				// what the difference between the parent height and what we are going to take up is
				delta = parentHeight - currentSize,
				// the current height of the object
				fillerHeight = ev.data.filler.height();

			//adjust the height
			ev.data.filler.height(fillerHeight + delta)

			//remove the temporary element
			if ( isBleeder ) {
				last.remove();
			}
			ev.data.filler.triggerHandler('resize');
		}
	});

})(jQuery);
(function($){
		var div = $('<div id="out"><div style="height:200px;"></div></div>').css({
				position: "absolute",
				top: "0px",
				left: "0px",
				visibility: "hidden",
				width: "100px",
				height: "100px",
				overflow: "hidden"
			}).appendTo(document.body),
			inner = $(div[0].childNodes[0]),
			w1 = inner[0].offsetWidth,
			w2;

		div.css("overflow","scroll");
		//inner.css("width","100%"); //have to set this here for chrome
		var w2 = inner[0].offsetWidth;		
		if (w2 == w1) {
			inner.css("width", "100%"); //have to set this here for chrome
			w2 = inner[0].offsetWidth;
		}
		div.remove();
		(window.Mxui || (window.Mxui = {}) ).scrollbarWidth = w1 - w2;
})(jQuery);
(function( $ ) {
	/** 
	 * Grid is a plugin that provides a configurable data grid.  It accepts a 
	 * JavaScriptMVC Model as a parameter, using the Model API to get the data 
	 * that fills in the grid.  It supports paging through limit/offset parameters, 
	 * sorting, grouping, and customizeable layout.
	 * 
	 * # Params
	 *  
	 * Grid accepts an object of optional parameters.  
	 * 
	 * - *columns* A list of column headers that will be displayed in this grid:
	 *     columns: {
	 *      id: "ID",
	 *      title: "Title",
	 *      collection: "Collection",
	 *      mediaType: "Media Type"
	 *  }
	 *  The key of the key-value pair determines the internal name of the column, and the name of the attribute 
	 *  used from the model instances displayed (each model instance should have a mediaType attribute in the 
	 *  example above).  The value of the key-value is the column title displayed. 
	 *  
	 * - limit
	 * - offset
	 * - types
	 * - order
	 * - group
	 * - model
	 * - hoverClass
	 * - display
	 * - rendered
	 * - noItems
	 *  
	 */
	$.Controller.extend("Mxui.Grid", {
		defaults: {
			columns: null,
			limit: null,
			offset: null,
			types: [],
			order: [],
			group: [],
			model: null,
			hoverClass: "hover",
			display: {},
			//paginatorType: Mxui.Paginator.Page,
			renderer: function( inst, options, i, items ) {
				return $.View("//mxui/grid/views/row", {
					item: inst,
					options: options,
					i: i,
					items: items
				})
			},
			noItems: "No Items Found."
		},
		listensTo: ["paginate"]

	}, {
		init: function() {
			//make the request ....
			//this.options.model.findAll(this.params(), this.callback('found'));
			this.element.addClass("grid")
			this.element.html("//mxui/grid/views/init", this);

			//save references to important internals to avoid queries
			this.cached = {
				body: this.element.children('.body'),
				header: this.element.children(".header"),
				footer: this.element.children(".footer")
			}
			this.cached.innerBody = this.cached.body.find('div.innerBody');
			this.cached.table = this.cached.body.find('table');
			this.cached.tbody = this.cached.body.find('tbody');
			this.cached.innerBody.mxui_filler({
				parent: this.element
			})
			this.findAll();
			//draw basic....
			this.widths = {};

			this.bind(this.cached.body.children().eq(0), "scroll", "bodyScroll")
			this.delegate(this.cached.header.find('tr'), "th", "mousemove", "th_mousemove");

			//

			//this.paginator().mixin(this.options.paginatorType);
			this.element.parent().trigger('resize');
		},
		windowresize: function() {
			var body = this.cached.body,
				header = this.cached.header,
				hideHead = header.is(':visible');
			body.hide();
			if ( hideHead ) {
				header.hide();
			}
			var footer = this.cached.footer.width(),
				scrollbarWidth = Mxui.scrollbarWidth;
			var table = body.find('table').width(footer > scrollbarWidth ? footer - scrollbarWidth : scrollbarWidth);
			body.children().eq(0).width(footer > scrollbarWidth ? footer : scrollbarWidth);
			header.width(footer > scrollbarWidth ? footer : scrollbarWidth);
			body.show();
			if ( hideHead ) {
				header.show();
			}
			if ( table.height() < body.height() ) {
				table.width(footer > 0 ? footer : scrollbarWidth)
			}
		},
		/**
		 * Listens for page events
		 * @param {Object} el
		 * @param {Object} ev
		 * @param {Object} data
		 */
		paginate: function( el, ev, data ) {
			if ( typeof data.offset == "number" && this.options.offset != data.offset ) {
				data.offset = Math.min(data.offset, Math.floor(this.options.count / this.options.limit) * this.options.limit)

				this.options.offset = data.offset;
				//update paginators
				this.findAll();
			}
		},
		".pagenumber keypress": function( el, ev ) {
			if ( ev.charCode && !/\d/.test(String.fromCharCode(ev.charCode)) ) {
				ev.preventDefault()
			}
		},
		".pageinput form submit": function( el, ev ) {
			ev.preventDefault();
			var page = parseInt(el.find('input').val(), 10) - 1,
				offset = page * this.options.limit;

			this.element.trigger("paginate", {
				offset: offset
			})
		},
		findAll: function() {
			this.element.trigger("updating")
			this.cached.tbody.html("<tr><td>Loading ...<td></tr>")
			this.options.model.findAll(this.params(), this.callback('found'));
		},
/*paginator: function ()
	  {
	  return this.element.children('.footer').find(".gridpages")
	  },*/
		found: function( items ) {
			this.options.count = items.count;
			if (!items.length ) {
				this.cached.header.hide();
				this.element.trigger("updated", {
					params: this.params(),
					items: items
				})
				var ib = this.cached.innerBody;
				this.cached.table.hide();
				ib.append("<div class='noitems'>" + this.options.noItems + "</div>")
				ib.trigger('resize');
				return;
			}


			if (!this.options.columns ) {
				var columns = (this.options.columns = {})
				$.each(this.options.model.attributes, function( name, type ) {
					if ( name != "id" ) columns[name] = $.String.capitalize(name)
				})
			}
			var body = this.cached.innerBody,
				table = this.cached.table,
				tbody = this.cached.tbody;
			table.children("col").remove();
			//draw column with set widths
			table.prepend('//mxui/grid/views/columns', {
				columns: this.options.columns,
				widths: this.widths,
				group: this.group
			})
			var tbody = tbody.html('//mxui/grid/views/body', {
				options: this.options,
				items: items
			})

			tbody.find("tr.spacing").children("th").each(function() {
				var $td = $(this),
					$spacer = $td.children().eq(0),
					width = $spacer.outerWidth(),
					height = $spacer.outerHeight();
				$td.css({
					padding: 0,
					margin: 0
				})
				$spacer.outerWidth(width + 2).css("float", "none").html("").height(1)
			})

			this.element.trigger("updated", {
				params: this.params(),
				items: items
			})

			//do columns ...
			this.cached.header.find("tr").html('//mxui/grid/views/header', this);
			tbody.trigger("resize")
			setTimeout(this.callback('sizeTitle'), 1)
		},
		sizeTitle: function() {
			var body = this.cached.body,
				firstWidths = this.cached.tbody.find("tr:first").children().map(function() {
					return $(this).outerWidth()
				}),
				header = this.cached.header,
				title = this.cached.header.find("th");


			for ( var i = 0; i < title.length - 1; i++ ) {
				title.eq(i).outerWidth(firstWidths[i]);
			}
			header.find("table").width(body.find("table").width() + 40) //extra padding for scrollbar
			this.titleSized = true;
		},
		params: function() {
			return $.extend({}, this.options.params, {
				order: this.options.order,
				offset: this.options.offset,
				limit: this.options.limit,
				group: this.options.group,
				count: this.options.count
			})
		},
		resize: function() {
			this.cached.innerBody.height(0)
			if ( this.titleSized ) {
				setTimeout(this.callback('sizeTitle'), 1)
			} else {
				setTimeout(this.callback('windowresize'), 1)
			}
		},
		bodyScroll: function( el, ev ) {
			this.element.children(":first").scrollLeft(el.scrollLeft())
		},
		"th mouseenter": function( el ) {
			el.addClass("hover")
		},
		"th mouseleave": function( el ) {
			el.removeClass("hover")
		},
		"th click": function( el, ev ) {

			var attr = el[0].className.match(/([^ ]+)-column-header/)[1];
			var sort = el.hasClass("sort-asc") ? "desc" : "asc"
			//see if we might already have something with this
			var i = 0;
			while ( i < this.options.order.length ) {
				if ( this.options.order[i].indexOf(attr + " ") == 0 ) {
					this.options.order.splice(i, 1)
				} else {
					i++;
				}
			}
			if (!el.hasClass("sort-desc") ) { // otherwise reset this column's search
				this.options.order.unshift(attr + " " + sort)
			}
			this.findAll();
		},
		"th dragdown": function( el, ev, drag ) {
			if ( this.isMouseOnRight(el, ev, 2) ) {
				var resize = $("<div id='column-resizer'/>").appendTo(document.body).addClass("column-resizer");
				var offset = el.offset();

				resize.height(this.element.children(".body").outerHeight() + el.outerHeight()).outerWidth(el.outerWidth());
				resize.css(offset)
				ev.preventDefault();
				//prevent others from dragging
			} else {
				drag.cancel();
			}
		},
		"th dragmove": function( el, ev, drag ) {
			ev.preventDefault();
			var width = ev.vector().minus(el.offsetv()).left();

			if ( width > el.find("span:first").outerWidth() ) $("#column-resizer").width(width)
		},
		"th dragend": function( el, ev, drag ) {
			ev.preventDefault();
			var width = ev.vector().minus(el.offsetv()).left(),
				attr = el[0].className.match(/([^ ]+)-column-header/)[1],
				cg;
			if ( width > el.find("span:first").outerWidth() ) cg = this.element.find("col:eq(" + el.index() + ")").outerWidth(width)
			else {
				cg = this.element.find("col:eq(" + el.index() + ")").outerWidth(el.find("span:first").outerWidth())
			}
			this.widths[attr] = cg.width();
			setTimeout(this.callback('sizeTitle'), 1)
			$("#column-resizer").remove();
		},
		th_mousemove: function( el, ev ) {
			if ( this.isMouseOnRight(el, ev) ) {
				el.css("cursor", "e-resize")
			} else {
				el.css("cursor", "")
			}
		},
		isMouseOnRight: function( el, ev, extra ) {
			return el.offset().left + el.outerWidth() - 8 - (extra || 0) < ev.vector().left()
		},
		sortedClass: function( attr ) {
			var i = 0;
			for ( var i = 0; i < this.options.order.length; i++ ) {
				if ( this.options.order[i].indexOf(attr + " ") == 0 ) {
					return "sort-" + this.options.order[i].split(" ")[1]
				}
			}
			return "";
		},
		replace: function( el, message ) {
			var html = this._renderMessages([message]);
			el.replaceWith(html.join(''));
			this.element.trigger('resize');
		},
		insert: function( el, messages, fadeIn ) {
			var noitems = this.find('.noitems')
			if ( noitems.length ) {
				noitems.remove();
				this.cached.header.find("tr").html('//mxui/grid/views/header', this);
				var tbl = this.find('.innerBody table').show();
				return this.found(messages)
			}
			var html = this._renderMessages(messages),
				els = $(html.join(''));
			if ( el.length ) el.after(els);
			else {
				(tbl ? tbl.children('tbody') : this.find('.innerBody tbody')).html(els)
			}
			els.hide().fadeIn();
			this.windowresize();
			this.element.trigger('resize');
		},
		_renderMessages: function( items ) {
			var html = [],
				i, item;
			var options = $.extend(true, {}, this.options, {
				renderPartial: true
			})
			for ( i = 0; i < items.length; i++ ) {
				item = items[i]
				html.push(this.options.renderer(item, options, i, items))
			}
			return html;
		},
		update: function( options ) {
			$.extend(this.options, options)
			this.findAll();
		},
		"tr mouseenter": function( el, ev ) {
			el.addClass(this.options.hoverClass);
		},
		"tr mouseleave": function( el, ev ) {
			el.removeClass(this.options.hoverClass);
		},
		destroy: function() {
			delete this.cached
			this._super()

		}
	})

})(jQuery)