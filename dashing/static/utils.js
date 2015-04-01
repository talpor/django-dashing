(function(global) {

    function getUrlParameter(name) {
        name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
        var regexS = '[\\?&]' + name + '=([^&#]*)',
            regex = new RegExp( regexS ),
            results = regex.exec( window.location.href );
        return (results === null) ? null : results[1];
    }

    function insertUrlParam(key, value) {
        key = encodeURI(key); value = encodeURI(value);
        var kvp = document.location.search.substr(1).split('&');
        var i=kvp.length; var x; while(i--) {
            x = kvp[i].split('=');

            if (x[0]==key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }
        if(i<0) {kvp[kvp.length] = [key,value].join('=');}
        window.history.pushState(null, null, '?' + kvp.join('&').replace(/^\&/, ''));
    }

    global.utils = {
        getUrlParameter: getUrlParameter,
        insertUrlParam: insertUrlParam
    };
})(window);