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