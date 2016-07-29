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

            var Bullet = require('./Bullet.js');
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