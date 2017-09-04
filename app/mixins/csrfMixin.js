// 
exports.default = {
    data: function () {
        return {
            _csrf: ''
        };
    },
    methods: {
        getCsrf: function () {
            var name = 'token=';
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        },
    },
    mounted: function () {
        this._data ? this._data._csrf = this.getCsrf() : null;
    },
};