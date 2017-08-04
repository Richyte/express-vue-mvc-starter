// @flow
function paramObject(object: Object): string {
    let str = '';
    for (let key in object) {
        if (str != '') {
            str += '&';
        }
        str += key + '=' + encodeURIComponent(object[key]);
    }
    return '?' + str;
}

module.exports = paramObject;
