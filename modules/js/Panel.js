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
