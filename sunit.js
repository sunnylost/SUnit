(function() {
    var g = this,
        w = window,
        doc = document,
        isWindow = !!w && (w.window === w),
        SUnit = {},
        el = {},
        tests = {
            length : 0
        },
        guid = 0,
        costtime = 0,
        costTime = {},
        toolbar, currentItem,
        html = {
            'scaffold': '<div id="sunit-header">\
                            <h1><a href="#">SUnit</a></h1>\
                        </div>\
                        <ul id="sunit-toolbar">\
                            <li id="noglobals">\
                                <i></i>noglobals\
                            </li>\
                            <li id="notrycatch">\
                                <i></i>notrycatch\
                            </li>\
                            <li id="hidepass">\
                                <i></i>Hide passed tests\
                            </li>\
                        </ul>\
                        <h2 id="sunit-useragent"></h2>\
                        <p id="sunit-testresult">\
                            Tests completed in <span id="costtime"></span> milliseconds.<br/>\
                            1 tests of 1 passed, 0 failed.\
                        </p><ol id="sunit-test"></ol>',

            'test': '<strong>\
                        <span class="test-name">$</span>\
                        <b class="counts">(\
                        <b class="failed">0</b>,\
                        <b class="passed">0</b>, 0)</b>\
                    </strong>\
                    <a href="#">Rerun</a>\
                    <span class="runtime"></span>\
                    <ol></ol>',
            'item': '<li></li>'
        },
        blank = function() {};

//======================= Utility =================================
    var id = function(id) {
        return doc.getElementById(id);
    };

    var tag = function(el, tag) {
        return el.getElementsByTagName(tag);
    };

    var log = function() {
        console.log.apply(console, arguments);
    };

    var E = {
        handlers: {},

        on: function(name, handler) {
            var handlers = this.handlers[name];
            if(!handlers) {
                handlers = this.handlers[name] = [];
            }
            handlers.push(handler);
            return this;
        },

        off: function(name, handler) {
            var handlers = this.handlers[name],
                len;
            if(handlers) {
                if(handler) {
                    len = handlers.length;
                    while(len--) {
                        if(handlers[len] === handler) {
                            handlers.splice(1, len);
                        }
                    }
                } else {
                    this.handlers[name] = [];
                }
            }
            return this;
        },

        fire: function(name) {
            var args = Array.prototype.slice.call(arguments, 1),
                i,
                len,
                handlers = this.handlers[name];
            if(handlers) {
                len = handlers.length;
                for(i = 0; i < len; i++) {
                    handlers[i].apply(null, args);
                }
            }
            return this;
        }
    };

//======================= Utility End =================================

    SUnit.init = function() {
        var useragent = id('sunit-useragent');
        useragent.innerHTML = navigator.userAgent;

        el.result = id('sunit-testresult');
        el.area = id('sunit-test');
        el.costtime = id('costtime');
        el.li = doc.createElement('li');
        toolbar = {
            'noglobals': blank,
            'notrycatch': blank,
            'hidepass': function(flag) {
                el.area.className = flag ? 'hidepass' : '';
            }
        };

        initToolbar();
        E.on('pass', pass).
          on('fail', fail).
          on('before', before).
          on('after', after).
          on('test.before', beforeTest).
          on('test.after', afterTest);
    };

    function pass() {
        currentItem.className = 'pass';
    }

    function fail() {
        currentItem.className = 'fail';
    }

    function before() {

    }

    function after() {

    }

    function beforeTest(name) {
        if(isWindow) {
            var li = el.li.cloneNode(false);
            li.innerHTML = html.test.replace('$', name);
            el.area.appendChild(li);
            currentItem = li;
        }

        tests[tests.length++] = {
            name : name,
            id : guid++
        };
    }

    function afterTest(name) {
        if(isWindow) {
            //tag(li, 'span')[1].innerHTML = cur + ' ms';
            //el.costtime.innerHTML = (costtime += cur);
        }
    }

    /**
     * init toolbar
     * @return {[type]} [description]
     */
    var initToolbar = function() {
        var lis = id('sunit-toolbar').getElementsByTagName('li'),
            len = lis.length;
        while(len--) {
            lis[len].onclick = function() {
                var flag = false;
                this.className = this.className ? '' : (flag = true, 'on');
                toolbar[this.id](flag);
            };
        };
    };

    var core = function(fn, text) {
        E.fire('before');
        var flag = fn();
        E.fire(flag ? 'pass' : 'fail', text).
          fire('after');
    };


    //************* API Begin ****************
    g.test = function(name, fn) {
        var begin, end;
        E.fire('test.before', name);
        fn();
        E.fire('test.after', name);
    };

    g.assert = function(c, text) {
        core(function() {
            return !!c;
        }, text);
    };

    g.deepEqual = function() {

    };

    g.equal = function(a, b) {
        core(function() {
            return a == b;
        }, text);
    };

    g.notDeepEqual = function() {

    };

    g.notEqual = function() {
        core(function() {
            return a != b;
        }, text);
    };

    g.notStrictEqual = function() {
        core(function() {
            return a !== b;
        }, text);
    };

    g.ok = function(c, text) {
        core(function() {
            return !!c;
        }, text);
    };

    g.strictEqual = function() {
        core(function() {
            return a === b;
        }, text);
    };
    //************* API End ****************

    g.SUnit = SUnit;
})();

SUnit.init();

/*
 * APIs which need to be implemented:
 *     throws
 *     expect
 *     module
 *
 * Async
 *     asyncTest
 *     start
 *     stop
 *
 *  Seperate the UI and the logic.
 */