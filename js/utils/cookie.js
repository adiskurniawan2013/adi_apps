cookie = {    
        set: function (n, v, days) {
                var e = '', d;
                if (days) {
                        d = new Date();
                        d.setTime(d.getTime() + (days * 86400000));
                        e = "; expires=" + d.toGMTString();
                }
                document.cookie = n + '=' + v + e + '; path=/';
        },

        get: function (n) {
                var match = n + '=', c = '', ca = document.cookie.split(';'), i;
                for (i = 0; i < ca.length, c = ca[i]; i++) {
                        if (c.indexOf(match) == 1) {
                                return c.substring(match.length+1, c.length);
                        }
                }

                return null;
        },

        delete: function (n) {
                this.set(n, '', -1);
        }
};