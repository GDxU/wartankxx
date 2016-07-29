jQuery(function() {
    var startTimes = new Date().getTime(); // 游戏开始的时间

    // 构建主面板
    var panel = new sad.Panel();

    // 构建坦克(当前玩家)
    var tank1 = new sad.Tank({
        panel: panel,
        type: 1
    });

    /**
     * 构建电脑坦克
     */
    var tank2 = new sad.Tank({
        panel: panel,
        player: "p2",
        type: 2,
        left: 600,
        top: 100,
        blood: 5,
        direction: "down"
    });
    tank2.startPcMode(); // 启动自动模式

    var tank3 = new sad.Tank({
        panel: panel,
        player: "p2",
        type: 2,
        left: 200,
        top: 200,
        blood: 5,
        direction: "down"
    });
    tank3.startPcMode(); // 启动自动模式

    // 构建钢化障碍物
    new sad.Steel({ panel: panel });
    new sad.Steel({ panel: panel });
    new sad.Steel({ panel: panel });


    // -------------------------------------------------------------------------------------------------------
    /**
     * 玩家操作的方法，由于onkeydown事件响应较慢导致移动不方便，因此简单的缓存优化移动 [start]
     */
    document.onkeydown = insertKey;
    var timer = setInterval(function() {
        writeCache();
    }, 50);

    var keyCache = []; // 按键的缓存
    var cacheNum = 0; // 缓存的数量
    var isCache = false;

    function insertKey() {
        var keyCode = event.keyCode;
        if ((keyCode >= 37 && keyCode <= 40) || keyCode == 32) {
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
        for (var i = 0; i < panel.tanks.length; i++) {
            var tank = panel.tanks[i];
            if (tank.params.type != 1) {
                enemyCount++;
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

        switch (keyCode) {
            case 37:
                tank1.moveToLeft();
                break;
            case 38:
                tank1.moveToUp();
                break;
            case 39:
                tank1.moveToRight();
                break;
            case 40:
                tank1.moveToDown();
                break;
            case 32:
                tank1.attack();
                break;
        }

        if (isCache) cacheNum++;
        if (cacheNum == 5) {
            isCache = false;
            cacheNum = 0;
        }
    }
    // [end]

    jQuery("#myAddBtn").on("click", function() {
        if (panel.tanks.length >= 6) { alert("不要盲目添加电脑坦克哦！");
            return; }

        var tank = new sad.Tank({
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
});
