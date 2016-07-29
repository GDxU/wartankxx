/**
 * 初始化
 */
(function(window) {

    // 命名空间
    if (window.sad == null) {
        window.sad = {};
    }

    // 图片路径
    window.tankWarRootPath = "";


    /**
     * 注册命名空间
     * example:  registerForNs("cn.com.sad");
     *
     * @deprecated
     */
    function registerForNs(fullNS) {
        var nsArray = fullNS.split('.');
        var sEval = "";
        var sNS = "";
        for (var i = 0; i < nsArray.length; i++) {
            if (i != 0) sNS += ".";
            sNS += nsArray[i];
            sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = {};"
        }
        if (sEval != "") eval(sEval);
    }
}(window));
