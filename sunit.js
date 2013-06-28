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
        lineFeed = String.fromCharCode(10),
        toolbar, currentItem,
        userAgent = { chrome : 3, firefox : 4 },
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

            'stack': '<table>\
                        <tbody>\
                            <tr class="test-source">\
                                <th>Source:\
                                </th>\
                                <td>\
                                    <pre>$</pre>\
                                </td>\
                            </tr>\
                        </tbody>\
                    </table>'
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

    var dir = function() {
        console.dir.apply(console, arguments);
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
                            handlers.splice(len, 1);
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

    var position = function() {
        if(!userAgent) return '';

        var err = (function () {
            try { throw Error(); } catch(err) { return  err; };
        }());
        var stack = err.stack;
        if(stack) {
            stack = stack.split(lineFeed);
        }
        return stack && stack[stack.length - userAgent];
    };

//======================= Utility End =================================

    SUnit.init = function() {
        var useragentEl = id('sunit-useragent'),
            agentStr = navigator.userAgent;
        useragentEl.innerHTML = agentStr;
        if(agentStr.indexOf('Chrome') > -1) {
            userAgent = userAgent.chrome;
        } else if(agentStr.indexOf('Firefox') > -1) {
            userAgent = userAgent.firefox;
        } else {
            userAgent = null;
        }


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
        initTestArea();
        E.on('before', before).
          on('after', after).
          on('test.before', beforeTest).
          on('test.after', afterTest);
    };


    function before() {

    }

    function after(flag, text, pos) {
        var ol = tag(currentItem, 'ol')[0],
            li = el.li.cloneNode(false),
            stack,
            className = currentItem.className;

        if(flag) {
            currentItem.className = className ? className : 'pass';
            li.className = 'pass';
            li.innerHTML = '<span class="test-message">Passed!</span>';
        } else {
            currentItem.className = 'fail';
            stack = html.stack.replace('$', pos);
            li.className = 'fail';
            li.innerHTML = '<span class="test-message">' + text + '</span>' + stack;
        }
        ol.appendChild(li);
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
        if (!isWindow) return;
        var lis = id('sunit-toolbar').getElementsByTagName('li'),
            len = lis.length;
        while(len--) {
            lis[len].onclick = function() {
                var flag = false;
                this.className = this.className ? '' : (flag = true, 'on');
                toolbar[this.id](flag);
            };
        }
    };

    var initTestArea = function() {
        if (!isWindow) return;
        el.area.onclick = function(e) {
            var el = e.target,
                tagName = el.tagName.toLowerCase(),
                className = el.className,
                ol;
            if(tagName == 'li' && 'pass fail'.indexOf(className) > -1) {
                ol = tag(el, 'ol');
                if(ol && ol.length > 0) {
                    ol[0].style.display = 'block';
                }
            }
        };
    }

    var core = function(fn, text) {
        E.fire('before');
        E.fire('after', fn(), text, position());
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