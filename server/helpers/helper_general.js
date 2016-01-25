/**
 * clone an object
 * @param  {Object} src  object to clone
 * @return the cloned object
 */
cloneObject = function(src) {
    return JSON.parse(JSON.stringify(src));
};