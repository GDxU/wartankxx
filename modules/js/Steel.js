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