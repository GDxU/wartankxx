var Aop = (function(window) {

	var aop = {

		/**
	     * 执行前切入方法
	     *
	     * @param classN 类名
	     * @param methodN 原型方法名（既可以传字符串，也可以传数组）
		 * @param fn 需要切入的事件
	     * @returns 
	     */ 
		before: function(classN, methodN, fn) {
			var _classPrototype = (typeof(classN) === 'function' ? classN.prototype : eval(classN).prototype);
			var _methods = [];
			if (Util.isArray(methodN)) {
				_methods = methodN;
			} else {
				_methods.push(methodN);
			}

			for (var i = 0; i < _methods.length; i ++) {
				var _method_name = _methods[i];
				var _method_func = _classPrototype[_method_name];

				return function(mn, mf) {
					_classPrototype[mn] = function() {
						fn.apply(this, arguments);
						mf.apply(this, arguments);
					}
				}(_method_name, _method_func);
			}
		},

		/**
	     * 执行后切入方法
	     *
	     * @param classN 类名
	     * @param methodN 原型方法名（既可以传字符串，也可以传数组）
		 * @param fn 需要切入的事件
	     * @returns 
	     */ 
		after: function(classN, methodN, fn) {
			var _classPrototype = (typeof(classN) === 'function' ? classN.prototype : eval(classN).prototype);
			var _methods = [];
			if (Util.isArray(methodN)) {
				_methods = methodN;
			} else {
				_methods.push(methodN);
			}

			for (var i = 0; i < _methods.length; i ++) {
				var _method_name = _methods[i];
				var _method_func = _classPrototype[_method_name];

				return function(mn, mf) {
					_classPrototype[mn] = function() {
						mf.apply(this, arguments);
						fn.apply(this, arguments);
					}
				}(_method_name, _method_func);
			}
		}

	};
	return aop;
	//window.Aop = aop;
}(window));

module.exports = Aop;
