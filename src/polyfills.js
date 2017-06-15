RegExp.quote = function (str) {
    return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};
