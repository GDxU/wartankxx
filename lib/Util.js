var Util = {

    /**
     * 获取uuid
     * @returns {string}
     */
    getUuid: function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        //s[8] = s[13] = s[18] = s[23] = "-";
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    },

    /**
     * 复制参数
     * @param from
     * @param to
     */
    copyPropertyVal: function(from, to) {
        for (var f in from) {
            for (var t in to) {
                if (f == t && from[f] != null) {
                    to[t] = from[f];
                    break;
                }
            }
        }
    },

    /**
     * 生成随机数
     * @param maxNo 最大数字
     * @returns {number}
     */
    randomNumber: function(maxNo) {
        return parseInt(Math.random() * maxNo, 10) + 1;
    },

    /**
     * 格式化时间
     * @param 
     * @returns 
     */
    formatTime: function(value) {
        var theTime = parseInt(value) / 1000; // 秒 
        var theTime1 = 0; // 分 
        var theTime2 = 0; // 小时 
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + "小时" + result;
        }
        return result;
    },

    /**
     * 判断对象是否为数组
     * @param 对象
     * @returns true/false
     */
    isArray: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}
