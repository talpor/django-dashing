(function(global) {
    function Version(tag) {
        this.tag = tag;
        this.toSting = function() {
            return this.tag;
        };
        this.valueOf = function() {
            var value = 0,
                numbers = this.tag.match(/\d+/g),
                len = numbers.length;
            numbers.forEach(function(d, i) {
                value += d * (Math.pow(100, len - i - 1));
            });
            return value;
        };
    }
    global.__dashingversion__ = new Version('v0.3.3');
})(window);