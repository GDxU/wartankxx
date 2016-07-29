/*! this file is create by sad */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

	var Panel = __webpack_require__(6);
	var Tank = __webpack_require__(7);
	var Steel = __webpack_require__(9);
	var Bullet = __webpack_require__(8);
	var Aop = __webpack_require__(10);

	// --------------------------------------------------------------------------
	// AOP，用切面的方式的记录每个坦克的当前坐标
	Aop.after(Tank, "render", function() {
	    var html = '<div class="tank_info_container">';
	    html += '<p>' + this.params.id + "</p>";
	    html += '<p>left: <span id="info_l_' + this.params.id + '">' + this.params.left + '</span></p>';
	    html += '<p>top: <span id="info_t_' + this.params.id + '">' + this.params.top + '</span></p></div>';
	    $("#tankInfoDiv").append(html);
	});

	Aop.after(Tank, ["moveToLeft", "moveToRight", "moveToUp", "moveToDown"], function() {
	    $("#info_l_" + this.params.id).html(this.params.left);
	    $("#info_t_" + this.params.id).html(this.params.top);
	});


	// --------------------------------------------------------------------------
	window.tankWarRootPath = "modules/";

	var startTimes = new Date().getTime(); // 游戏开始的时间

	// 构建主面板
	var panel = new Panel();

	// 构建坦克(当前玩家)
	var tank1 = new Tank({ panel: panel, type: 1 });

	// 构建电脑坦克
	var tank2 = new Tank({ panel: panel, player: "p2", type: 2, left: 600, top: 100, blood: 5, direction: "down" });
	tank2.startPcMode();    // 启动自动模式

	var tank3 = new Tank({ panel: panel, player: "p2", type: 2, left: 200, top: 200, blood: 5, direction: "down" });
	tank3.startPcMode();    // 启动自动模式

	// 构建钢化障碍物
	new Steel({ panel: panel });
	new Steel({ panel: panel });
	new Steel({ panel: panel });


	// --------------------------------------------------------------------------
	/**
	 * 玩家操作的方法，由于onkeydown事件响应较慢导致移动不方便，因此简单的缓存优化移动 [start]
	 */
	document.onkeydown = insertKey;
	var timer = setInterval(function() {
	    writeCache();
	}, 50);

	var keyCache = []; // 按键的缓存
	var cacheNum = 0;  // 缓存的数量
	var isCache = false;

	function insertKey() {
	    var keyCode = event.keyCode;
	    if ((keyCode >= 37 && keyCode <=40) || keyCode == 32) {
	        if (keyCode != keyCache[keyCache.length - 1]) {
	            keyCache.length = 0;
	            if (keyCode != 32) {
	                keyCache.push(keyCode, keyCode, keyCode, keyCode, keyCode);
	            } else {
	                keyCache.push(keyCode, 0, 0, 0, 0);
	            }
	            isCache = true;
	        }
	    }
	}

	function writeCache() {
	    // 先检查玩家状态
	    if (tank1.isDead) {
	        alert("挑战失败！（刷新页面重新开始）");
	        clearInterval(timer);
	        return;
	    }
	    // 再检查玩家是否胜出
	    var enemyCount = 0;
	    for (var i=0; i<panel.tanks.length; i++) {
	        var tank = panel.tanks[i];
	        if (tank.params.type != 1) {
	            enemyCount ++;
	        }
	    }
	    if (enemyCount == 0) {
	        var spendTimes = new Date().getTime() - startTimes;
	        var spendTimesStr = Util.formatTime(spendTimes);
	        alert("恭喜你，挑战成功！花费时间为" + spendTimesStr);
	        clearInterval(timer);
	        return;
	    }

	    // 执行缓存的按键操作
	    if (keyCache.length == 0) return;
	    var keyCode = keyCache.shift();

	    switch(keyCode) {
	        case 37: tank1.moveToLeft(); break;
	        case 38: tank1.moveToUp(); break;
	        case 39: tank1.moveToRight(); break;
	        case 40: tank1.moveToDown(); break;
	        case 32: tank1.attack(); break;
	    }

	    if(isCache) cacheNum++;
	    if(cacheNum == 5){
	        isCache = false;
	        cacheNum = 0;
	    }
	}
	// [end]

	$(function() {
		$("#myAddBtn").on("click", function() {
			if (panel.tanks.length >= 6) { alert("不要盲目添加电脑坦克哦！"); return; }
		    
			var tank = new Tank({
		        panel: panel,
		        player: "p2",
		        type: 2,
		        left: Util.randomNumber(600),
		        top: Util.randomNumber(400),
		        blood: 3,
		        direction: "down"
		    });
		    tank.startPcMode();
		});
	});



	/**
	 * 玩家操作的方法
	 */
	/*jQuery("body").keydown(function(e) {
	    if (e.keyCode === 37) {
	        // 左移
	        tank1.moveToLeft();
	    } else if (e.keyCode === 38) {
	        // 上移
	        tank1.moveToUp();
	    } else if (e.keyCode === 39) {
	        // 右移
	        tank1.moveToRight();
	    } else if (e.keyCode === 40) {
	        // 下移
	        tank1.moveToDown();
	    } else if (e.keyCode === 32) {
	        // 攻击
	        tank1.attack();
	    }
	    e.stopPropagation();
	    //e.preventDefault();
	 });*/

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow:hidden;\r\n}\r\n\r\n.tank_container {\r\n    background: url(" + __webpack_require__(4) + ");\r\n    font-size: 12px;\r\n    transition: all .2s linear;\r\n    -o-transition: all .2s linear;\r\n    -moz-transition: all .2s linear;\r\n    -webkit-transition: all .2s linear;\r\n}\r\n\r\n.right_panel {\r\n    position: absolute;\r\n    width: 120px;\r\n}\r\n\r\n.tank {\r\n    position: absolute;\r\n    z-index:1000;\r\n    width:80px;\r\n    height:80px;\r\n    color:white;\r\n}\r\n\r\n.bullet {\r\n    position: absolute;\r\n    z-index:1000;\r\n    width:20px;\r\n    height:20px;\r\n}\r\n\r\n.steel {\r\n    position: absolute;\r\n    z-index:1000;\r\n}\r\n\r\n.in-progress {\r\n    height: 20px;\r\n    margin-bottom: 20px;\r\n    overflow: hidden;\r\n    background-color: #f5f5f5;\r\n    border-radius: 4px;\r\n    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\r\n    box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\r\n}\r\n.in-progress-bar[aria-valuenow=\"1\"], .in-progress-bar[aria-valuenow=\"2\"] {\r\n    min-width: 30px;\r\n}\r\n\r\n.in-progress-bar {\r\n    float: left;\r\n    width: 0;\r\n    height: 100%;\r\n    font-size: 12px;\r\n    line-height: 20px;\r\n    color: #fff;\r\n    text-align: center;\r\n    background-color: #428bca;\r\n    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\r\n    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);\r\n    -webkit-transition: width .6s ease;\r\n    -o-transition: width .6s ease;\r\n    transition: width .6s ease;\r\n}\r\n\r\n.in-progress-bar-success {\r\n    background-color: #5cb85c;\r\n}\r\n\r\n.in-title {\r\n    font-size:14px;\r\n    font-weight:bold;\r\n    margin-bottom: 5px\r\n}\r\n\r\n.tank-say {\r\n\tposition: absolute;\r\n\tleft: -30px;\r\n\ttop: -20px;\r\n}\r\n\r\n.tank_info_container {\r\n        margin-bottom: 10px;\r\n        border-bottom: 1px solid rgb(190, 223, 201);\r\n        width: 100%;\r\n    }\r\n    .tank_info_container p {\r\n        margin: 0;\r\n        padding: 0;\r\n        height: 24px;\r\n    }", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "../images/5-1206010T046-51.gif";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	var panel = function (opt) {
	    this.params = {
	        id : "tank_container",
	        width : 1100,
	        height : 550
	    }
	    this.tanks = [];        // 面板里面存在的坦克
	    this.bullets = [];      // 面板里面存在的子弹
	    this.steels = [];       // 面板里面存在的钢化障碍物

	    this.init(opt);
	    this.render();
	};

	panel.prototype = {
	    init: function (opt) {
	        Util.copyPropertyVal(opt, this.params);
	    },

	    render: function() {
	        var html = '<div id="'+ this.params.id +'" class="tank_container" style="width:'+ this.params.width +'px;height:'+ this.params.height +'px"></div>';
	        $("body").append(html);
	    },

	    /**
	     * 判断坦克移动时，移动后的位置会不会和障碍物出现交集，如果会则返回true，否则返回false
	     * @param bullet (子弹)
	     */
	    weatherGetSteelByTank: function(tank, top, left) {
	        var x11 = left;
	        var x12 = left + tank.width;
	        var y11 = top;
	        var y12 = top + tank.height;

	        for (var i = 0; i < this.steels.length; i++) {
	            var steel = this.steels[i];
	            var x21 = steel.params.left;
	            var x22 = steel.params.left + steel.width;
	            var y21 = steel.params.top;
	            var y22 = steel.params.top + steel.height;

	            if(((x21<x11&&x11<x22)||(x21<x12&&x12<x22))&&((y21<y11&&y11<y22)||(y21<y12&&y12<y22))){
	                return true;
	            }
	        }
	        return false;
	    },

	    /**
	     * 判断子弹是否击中障碍物，如果击中则返回true，否则返回false
	     * @param bullet (子弹)
	     */
	    weatherGetSteel: function(bullet) {
	        var x11 = bullet.params.left;
	        var x12 = bullet.params.left + bullet.width;
	        var y11 = bullet.params.top;
	        var y12 = bullet.params.top + bullet.height;

	        for (var i = 0; i < this.steels.length; i++) {
	            var steel = this.steels[i];
	            var x21 = steel.params.left;
	            var x22 = steel.params.left + steel.width;
	            var y21 = steel.params.top;
	            var y22 = steel.params.top + steel.height;

	            if(((x21<x11&&x11<x22)||(x21<x12&&x12<x22))&&((y21<y11&&y11<y22)||(y21<y12&&y12<y22))){
	                return true;
	            }
	        }
	        return false;
	    },

	    /**
	     * 判断子弹是否击中坦克，如果中弹则返回中弹的坦克对象，否则返回null
	     * @param bullet (子弹)
	     */
	    weatherGetShot: function(bullet) {
	        var x11 = bullet.params.left;
	        var x12 = bullet.params.left + bullet.width;
	        var y11 = bullet.params.top;
	        var y12 = bullet.params.top + bullet.height;

	        for (var i = 0; i < this.tanks.length; i++) {
	            var tank = this.tanks[i];
	            // 如果子弹的分类和坦克分类保持一致，则忽略
	            if (bullet.params.type == tank.params.type) continue;

	            var x21 = tank.params.left;
	            var x22 = tank.params.left + tank.width;
	            var y21 = tank.params.top;
	            var y22 = tank.params.top + tank.height;

	            if(((x21<x11&&x11<x22)||(x21<x12&&x12<x22))&&((y21<y11&&y11<y22)||(y21<y12&&y12<y22))){
	                return tank;
	            }
	        }
	        return null;
	    },

	    /**
	     * 存放玩家或盟军发射的子弹（主要用于电脑识别受威胁的子弹使用）
	     * @param bullet
	     */
	    pushBullet: function(bullet) {
	        if (bullet.params.type != 1) return;

	        this.bullets.push(bullet);
	        if (this.bullets.length > 3) {
	            this.bullets.splice(0,1);
	        }
	    },

	    /**
	     * 移除存放的玩家或盟军发射的子弹（主要用于电脑识别受威胁的子弹使用）
	     * @param bullet
	     */
	    removeBullet: function(bullet) {
	        var index = -1;
	        for (var i = 0; i < this.bullets.length; i ++) {
	            if (this.bullets[i].params.id == bullet.id) {
	                index = i; break;
	            }
	        }
	        this.bullets.splice(0,1);
	    },

	    /**
	     * 移除坦克对象
	     * @param tank
	     */
	    removeTank: function(tank) {
	        var index = this.findTankIndex(tank);
	        if (index != -1) {
	            this.tanks.splice(index, 1);
	        }
	    },

	    /**
	     * 查找坦克所在的下标
	     * @param tank
	     * @returns {number}
	     */
	    findTankIndex: function(tank) {
	        for (var i = 0; i < this.tanks.length; i ++) {
	            if (this.tanks[i].params.id == tank.params.id) {
	                return i;
	            }
	        }
	        return -1;
	    }
	}

	module.exports = panel;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Tank = (function($) {

	    var tank = function(opt) {
	        this.params = {
	            containerId: null,    // 容器ID（默认取panel对象的Id）
	            id: "",               // 唯一的标识，构建对象时自动生成
	            left: null,           // 当前left位置
	            top: null,            // 当前top位置
	            player: "p1",         // 玩家类型（用于取对应的玩家的图片使用）
	            direction: "up",      // 默认的方向
	            speed: 8,             // 默认的移动速度
	            maxLeft: null,        // 移动的最大的left位置
	            maxTop: null,         // 移动的最大的top位置
	            panel: null,          // 所属面板
	            blood: 3,             // 血量
	            type: 0,              // 坦克的类型（1为自己，2为电脑坦克，0为其他）
	            bulletIntervalTimes: 800    // 发射的子弹的间隔时间
	        };

	        this.tmpPic = "";   // 当前状态显示的坦克的图片
	        this.width = 50;    // 坦克的宽度
	        this.height = 50;   // 坦克的高度
	        this.isDead = false;    // 是否已经死亡
	        this.lastBulletTimes = 0;   //最后发射的子弹的时间

	        this.init(opt);
	        this.render();
	    };

	    tank.prototype = {

	        init:function(opt) {
	            this.params.id = Util.getUuid();
	            Util.copyPropertyVal(opt, this.params);

	            // 容器ID，默认取panel对象的Id
	            if (this.params.containerId == null) { this.params.containerId = this.params.panel.params.id; }
	            if (this.params.maxLeft == null) { this.params.maxLeft = this.params.panel.params.width; }
	            if (this.params.maxTop == null) { this.params.maxTop = this.params.panel.params.height; }
	            if (opt.left == null) { this.params.left = this.params.maxLeft - this.width; }
	            if (opt.top == null) { this.params.top = this.params.maxTop - this.height; }

	            this.params.panel.tanks.push(this);
	        },

	        render: function() {
	            this.tmpPic  = getTankImg(this.params.player, this.params.direction);

	            var html = '<div class="tank" id="'+ this.params.id +'" style="left:'+ this.params.left +'px;top:'+ this.params.top +'px">';
	            html += '<div id="tank_say_'+ this.params.id +'" class="tank-say"></div>';
	            html += '<img id="tank_img_'+ this.params.id +'" src="'+ tankWarRootPath +'css/images/' + this.tmpPic + '" style="width:'+ this.width +'px;height:'+ this.height +'px;" />'
	            html += '<span id="tank_blood_'+ this.params.id +'">'+ this.params.blood + '</span>';
	            html += '</div>';
	            
	            $("#" + this.params.containerId).append(html);
	        },

	        /**
	         * 向左移动
	         */
	        moveToLeft: function() {
	            // 获取方向，并改变图片
	            this.params.direction = "left";
	            var tmpPic  = getTankImg(this.params.player, this.params.direction);
	            if (this.tmpPic != tmpPic) {
	                this.tmpPic = tmpPic;
	                $("#tank_img_" + this.params.id).attr("src", tankWarRootPath + "css/images/" + this.tmpPic);
	            }

	            // 防止跑出界
	            if (this.params.left - this.params.speed < 0) return;
	            if (this.params.panel.weatherGetSteelByTank(this, this.params.top, this.params.left - this.params.speed)) return;

	            // 开始移动
	            this.params.left = this.params.left - this.params.speed;
	            this.getDom().css("left", (this.params.left) + "px");
	        },

	        /**
	         * 向右移动
	         */
	        moveToRight: function() {
	            // 获取方向，并改变图片
	            this.params.direction = "right";
	            var tmpPic  = getTankImg(this.params.player, this.params.direction);
	            if (this.tmpPic != tmpPic) {
	                this.tmpPic = tmpPic;
	                $("#tank_img_" + this.params.id).attr("src", tankWarRootPath + "css/images/" + this.tmpPic);
	            }

	            // 防止跑出界
	            if (this.params.left + this.width + this.params.speed > this.params.maxLeft) return;
	            if (this.params.panel.weatherGetSteelByTank(this, this.params.top, this.params.left + this.params.speed)) return;

	            // 开始移动
	            this.params.left = this.params.left + this.params.speed;
	            this.getDom().css("left", (this.params.left) + "px");
	        },

	        /**
	         * 向上移动
	         */
	        moveToUp: function() {
	            // 获取方向，并改变图片
	            this.params.direction = "up";
	            var tmpPic  = getTankImg(this.params.player, this.params.direction);
	            if (this.tmpPic != tmpPic) {
	                this.tmpPic = tmpPic;
	                $("#tank_img_" + this.params.id).attr("src", tankWarRootPath + "css/images/" + this.tmpPic);
	            }

	            // 防止跑出界
	            if (this.params.top - this.params.speed < 0) return;
	            if (this.params.panel.weatherGetSteelByTank(this, this.params.top - this.params.speed, this.params.left)) return;

	            // 开始移动
	            this.params.top = this.params.top - this.params.speed;
	            this.getDom().css("top", (this.params.top) + "px");
	        },

	        /**
	         * 向下移动
	         */
	        moveToDown: function() {
	            // 获取方向，并改变图片
	            this.params.direction = "down";
	            var tmpPic  = getTankImg(this.params.player, this.params.direction);
	            if (this.tmpPic != tmpPic) {
	                this.tmpPic = tmpPic;
	                $("#tank_img_" + this.params.id).attr("src", tankWarRootPath + "css/images/" + this.tmpPic);
	            }

	            // 防止跑出界
	            if (this.params.top + this.height + this.params.speed > this.params.maxTop) return;
	            if (this.params.panel.weatherGetSteelByTank(this, this.params.top + this.params.speed, this.params.left)) return;

	            // 开始移动
	            this.params.top = this.params.top + this.params.speed;
	            this.getDom().css("top", (this.params.top) + "px");
	        },

	        /**
	         * 发射子弹攻击
	         */
	        attack: function() {
	            // 控制字段发射的频率，如果当前时间 - 字段发射间隙时间 < 最后发射字段的时间，则不进行发射操作
	            if (new Date().getTime() - this.params.bulletIntervalTimes < this.lastBulletTimes) return;

	            var position = this.getBulletPosition();

	            var Bullet = __webpack_require__(8);
	            var bullet = new Bullet({
	                tank: this,
	                panel: this.params.panel,
	                containerId: this.params.containerId,
	                left: position[0],
	                top: position[1],
	                maxLeft: this.params.maxLeft,
	                maxTop: this.params.maxTop,
	                direction: this.params.direction,
	                type: this.params.type
	            });
	            this.params.panel.pushBullet(bullet);
	            this.lastBulletTimes = new Date().getTime();
	        },

	        /**
	         * 获取发射字段初始化的位置
	         * @returns {number[0, 1]} number[0]:left, number[0]:top
	         */
	        getBulletPosition: function() {
	            var position = [0, 0];
	            if (this.params.direction == "left") {
	                position[0] = this.params.left - 10;
	                position[1] = this.params.top + (this.height / 2) - 7;
	            } else if (this.params.direction == "up") {
	                position[0] = this.params.left + (this.width / 2) - 7;
	                position[1] = this.params.top - 10;
	            } else if (this.params.direction == "right") {
	                position[0] = this.params.left + this.width;
	                position[1] = this.params.top + (this.height / 2) - 7;
	            } else if (this.params.direction == "down") {
	                position[0] = this.params.left + (this.width / 2) - 7;
	                position[1] = this.params.top + this.height;
	            }
	            return position;
	        },

	        /**
	         * 中弹
	         */
	        getShot: function() {
	            this.params.blood = this.params.blood - 1;
	            $("#tank_blood_" + this.params.id).html(this.params.blood);

	            if (this.params.type == 2) {
	                this.say(beAttackedWords[Util.randomNumber(beAttackedWords.length - 1)]);
	            }

	            if (this.params.blood <= 0) {
	                this.dead();
	                this.params.panel.removeTank(this);
	            }
	        },

	        /**
	         * 死亡
	         */
	        dead: function () {
	            var _this = this;
	            this.isDead = true;
	            $("#tank_img_" + this.params.id).attr("src", tankWarRootPath + "css/images/blast5.gif");

	            if (this.params.type == 2) {
	                this.say(beDeadWords[Util.randomNumber(beDeadWords.length - 1)]);
	            }

	            setTimeout(function() {
	                _this.getDom().remove();
	            }, 1000);
	        },

	        /**
	         * 说话
	         */
	        say: function(word) {
	            var _this = this;
	            
	            $("#tank_say_" + this.params.id).html(word);
	            setTimeout(function() {
	                $("#tank_say_" + _this.params.id).html("");
	            }, 2000);
	        },

	        /**
	         * 启动电脑模式
	         */
	        startPcMode: function() {
	            var _this = this;
	            this.params.bulletIntervalTimes = 0;

	            var timer = setInterval(function () {
	                if (_this.isDead) {
	                    clearInterval(timer);
	                    return;
	                }

	                /** 电脑坦克，自动判断局势来做出指令操作部分，开挂模式 [start] */
	                // 获取敌方
	                var enemy = null;
	                for (var i = 0; i < _this.params.panel.tanks.length; i++) {
	                    var t = _this.params.panel.tanks[i];
	                    if (t.params.type != _this.params.type) {
	                        enemy = t; break;
	                    }
	                }

	                // 发现敌方就进攻
	                if (enemy != null) {
	                    // 获取当前坦克的坐标
	                    var x11 = _this.params.left;
	                    var x12 = _this.params.left + _this.width;
	                    var y11 = _this.params.top;
	                    var y12 = _this.params.top + _this.height;

	                    // 获取敌方坦克具体坐标
	                    var x21 = enemy.params.left;
	                    var x22 = enemy.params.left + enemy.width;
	                    var y21 = enemy.params.top;
	                    var y22 = enemy.params.top + enemy.height;

	                    // 判断是否在1条线
	                    if (((x21<x11&&x11<x22)||(x21<x12&&x12<x22)) || ((y21<y11&&y11<y22)||(y21<y12&&y12<y22))) {
	                        if ((y21<y11&&y11<y22) || (y21<y12&&y12<y22)) {
	                            // 敌方大概在左右边
	                            if (x11 - x21 > 0) {
	                                // 左边
	                                _this.moveToLeft();
	                            } else {
	                                // 右边
	                                _this.moveToRight();
	                            }
	                        } else if ((x21<x11&&x11<x22) || (y21<y12&&y12<y22)) {
	                            // 敌方大概在上下边
	                            if (y11 - y21 > 0) {
	                                // 上边
	                                _this.moveToUp();
	                            } else {
	                                // 下边
	                                _this.moveToDown();
	                            }
	                        }
	                        _this.attack();
	                    }
	                }

	                // 获取子弹，发现和子弹有交集就开始躲避
	                if (_this.params.panel.bullets.length > 0) {
	                    var bullet = _this.params.panel.bullets[0];

	                    // 获取子弹的坐标
	                    var x11 = bullet.params.left;
	                    var x12 = bullet.params.left + bullet.width;
	                    var y11 = bullet.params.top;
	                    var y12 = bullet.params.top + bullet.height;

	                    // 获取当前坦克的坐标
	                    var x21 = _this.params.left;
	                    var x22 = _this.params.left + _this.width;
	                    var y21 = _this.params.top;
	                    var y22 = _this.params.top + _this.height;

	                    // 判断是否在1条线
	                    if (((x21<x11&&x11<x22)||(x21<x12&&x12<x22)) || ((y21<y11&&y11<y22)||(y21<y12&&y12<y22))) {
	                        if ((y21<y11&&y11<y22) || (y21<y12&&y12<y22)) {
	                            // 子弹大概在左右边，
	                            // 根据当前位置智能获取逃跑方向
	                            var c = 1;
	                            if (_this.params.maxTop - _this.params.top >= _this.params.top) {
	                                var t = setInterval(function() {
	                                    if (c == 20) { clearInterval(t); }
	                                    c ++; _this.moveToDown();
	                                }, 50);
	                            } else {
	                                var t = setInterval(function() {
	                                    if (c == 20) { clearInterval(t); }
	                                    c ++; _this.moveToUp();
	                                }, 50);
	                            }
	                        } else if ((x21<x11&&x11<x22) || (y21<y12&&y12<y22)) {
	                            // 子弹大概在上下边
	                            // 根据当前位置智能获取逃跑方向
	                            console.log(2);
	                            var c = 1;
	                            if (_this.params.maxLeft - _this.params.left >= _this.params.left) {
	                                var t = setInterval(function() {
	                                    if (c == 20) { clearInterval(t); }
	                                    c ++; _this.moveToRight();
	                                }, 50);
	                            } else {
	                                var t = setInterval(function() {
	                                    if (c == 20) { clearInterval(t); }
	                                    c ++; _this.moveToLeft();
	                                }, 50);
	                            }
	                        }

	                    }
	                }
	                /** 电脑坦克，自动判断局势来做出指令操作部分 [end] */

	                var directive = Util.randomNumber(6);
	                if (directive == 1) {
	                    _this.moveToLeft();
	                } else if (directive == 2) {
	                    _this.moveToUp();
	                } else if (directive == 3) {
	                    _this.moveToRight();
	                } else if (directive == 4) {
	                    _this.moveToDown();
	                } else if (directive == 5) {
	                    _this.attack();
	                } else if (directive == 6) {
	                    _this.say(provokeWords[Util.randomNumber(provokeWords.length - 1)]);
	                }
	            }, 500);
	        },

	        getDom: function() {
	            return $("#" + this.params.id);
	        }
	    };


	    /**
	     * 根据玩家及方向获取对应的图片
	     * @param player
	     * @param direction
	     * @returns {*}
	     */
	    function getTankImg(player, direction) {
	        var img = player;
	        if (direction == "left") {
	            img += "tankL.gif";
	        } else if (direction == "up") {
	            img += "tankU.gif";
	        } else if (direction == "right") {
	            img += "tankR.gif";
	        } else if (direction == "down") {
	            img += "tankD.gif";
	        }
	        return img;
	    }

	    var provokeWords = ["哈哈打我啊~", "你动作还能快点？", "你行不行呢？", "没人打真寂寞", "求虐", "你动作麻利点？", "我是PK达人",
	            "快来打我", "年轻人加油", "再不灭我我灭你", "来弄我啊", "来点挑战好吗！", "我是无敌哥", "我很牛来打我啊", "无敌是寂寞",
	            "亲你能打准点吗？", "年轻人努力点！", "来嘛英雄"];

	    var beAttackedWords = ["啊,中彩了~", "喲,挺准的嘛", "好痛", "怕怕~~", "兄弟们9我~", "我艹..", "帅", "别打我我错了", "枪法不错啊~"];

	    var beDeadWords = ["啊..", "帮我报仇啊~", "算你狠..", "我还会回来的", "你牛"];

	    return tank;
	}(jQuery));

	module.exports = Tank;

/***/ },
/* 8 */
/***/ function(module, exports) {

	var Bullet = (function($) {

	    var bullet = function (opt) {
	        this.params = {
	            containerId: "",           // 所在容器ID
	            id : Util.getUuid(),        // id
	            speed: 13,      // 子弹移动速度
	            top: 0,         // 子弹的Y坐标
	            left: 0,        // 子弹的X坐标
	            direction: "",   // 子弹方向
	            image: "bullet.gif",    // 子弹图片
	            maxLeft: 0,     // 最大的X
	            maxTop: 0,      // 最大的Y
	            tank: null,     // 由哪个坦克发射的子弹
	            panel: null,    // 所属面板
	            type: 0         // 子弹类别，与坦克的类别保持一致
	        }

	        this.width = 10;    // 子弹的宽度
	        this.height = 10;   // 子弹的高度

	        this.init(opt);
	        this.render();
	    };

	    bullet.prototype = {
	        init : function(opt) {
	            Util.copyPropertyVal(opt, this.params);

	            this.params.maxTop = this.params.maxTop - this.height;
	        },

	        render: function() {
	            var html = '<div id="bullet_'+ this.params.id +'" class="bullet" style="left:'+ this.params.left +'px; top:'+ this.params.top +'px">';
	            html += '<img id="bullet_img_'+ this.params.id +'" src="'+ tankWarRootPath +'css/images/'+ this.params.image +'" style="width:'+ this.width +'px;height:'+ this.height +'px;"/>';
	            html += '</div>';

	            $("#" + this.params.containerId).append(html);
	            this.autoMove();
	        },

	        /**
	         * 子弹自动移动的方法
	         */
	        autoMove: function() {
	            var _this = this;
	            var timer = setInterval(function() {

	                if (_this.params.direction == "left") {
	                    _this.params.left = _this.params.left - _this.params.speed
	                } else if (_this.params.direction == "up") {
	                    _this.params.top = _this.params.top - _this.params.speed;
	                } else if (_this.params.direction == "right") {
	                    _this.params.left = _this.params.left + _this.params.speed
	                } else if (_this.params.direction == "down") {
	                    _this.params.top = _this.params.top + _this.params.speed;
	                }

	                var jDom = _this.getDom();
	                jDom.css("left", _this.params.left + "px");
	                jDom.css("top", _this.params.top + "px");

	                // 判断子弹有没有出界，如果出界则销毁
	                if (_this.params.left <= 0 || _this.params.top <= 0 || _this.params.left >= _this.params.maxLeft || _this.params.top >= _this.params.maxTop) {
	                    _this.destroy(timer);
	                } else {
	                    // 判断子弹有没有打中钢化障碍物(如果打中则销毁，没打中则判断是否击中坦克)
	                    var getSteel = _this.params.panel.weatherGetSteel(_this);
	                    if (getSteel) {
	                        _this.destroy(timer);
	                    } else {
	                        var getShotTank = _this.params.panel.weatherGetShot(_this);
	                        if (getShotTank != null) {
	                            clearInterval(timer);
	                            _this.explode();

	                            getShotTank.getShot();
	                        }
	                    }
	                }
	            }, 30)
	        },

	        /**
	         * 子弹爆炸(子弹更换图片、移除子弹)
	         */
	        explode: function () {
	            var _this = this;

	            $("#bullet_img_" + this.params.id).attr("src", tankWarRootPath + "css/images/tankmissile.gif");
	            setTimeout(function() {
	                _this.getDom().remove();
	            }, 500);
	        },

	        /**
	         * 销毁子弹
	         * @param timer
	         */
	        destroy: function(timer) {
	            clearInterval(timer);
	            this.params.panel.removeBullet(this);
	            this.getDom().remove();
	        },

	        getDom: function() {
	            return $("#bullet_" + this.params.id);
	        }
	    };

	    return bullet;
	}(jQuery));

	module.exports = Bullet;

/***/ },
/* 9 */
/***/ function(module, exports) {

	var Steel = (function($) {
		
		var steel = function(opt) {
			this.params = {
				containerId: null,         // 所在容器ID
	            id: Util.getUuid(),        // id
	            top: null,         // Y坐标
	            left: null,        // X坐标
	            panel: null		   // 所属面板
			}
			this.width = 60;
	        this.height = 60;

			this.init(opt);
	        this.render();
		}

		steel.prototype = {
			init: function(opt) {
				Util.copyPropertyVal(opt, this.params);

				// 容器ID，默认取panel对象的Id
	            if (this.params.containerId == null) { this.params.containerId = this.params.panel.params.id; }
	            if (this.params.top == null || this.params.left == null) { 
	            	var postion = this.randomPosition();
	            	this.params.top = postion.top;
	            	this.params.left = postion.left;
	            }

	            this.params.panel.steels.push(this);
			},

			render: function() {
				var html = '<div id="steel_'+ this.params.id +'" class="steel" style="width:'+ this.width +'px;height:'+ this.height +'px;';
				html += 'left:'+ this.params.left +'px;top:'+ this.params.top +'px">';
				html += '<img src="' + tankWarRootPath + 'css/images/steels.gif" /></div>';
				$("#" + this.params.containerId).append(html);
			},

			/**
	         * 随机初始化位置
	         */
			randomPosition: function() {
				var postion = { left:0, top:0 };
				var bool = true;

				do {
					bool = true;
					postion.left = Util.randomNumber(1000);
					postion.top = Util.randomNumber(500);

					// 判断是否与产生的坦克存在交集（必须保证不能有交集，否则为BUG）
					var x11 = postion.left;
		            var x12 = postion.left + this.width;
		            var y11 = postion.top;
		            var y12 = postion.top + this.height;

		            for (var i = 0; i < this.params.panel.tanks.length; i++) {
		                var tank = this.params.panel.tanks[i];
		                var x21 = tank.params.left;
		                var x22 = tank.params.left + tank.width;
		                var y21 = tank.params.top;
		                var y22 = tank.params.top + tank.height;

		                if(((x21<x11&&x11<x22)||(x21<x12&&x12<x22))&&((y21<y11&&y11<y22)||(y21<y12&&y12<y22))){
		                    bool = false; break;
		                }
		            }
				} while (!bool);

				return postion;
			}
		}

		return steel;

	}(jQuery));

	module.exports = Steel;

/***/ },
/* 10 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);