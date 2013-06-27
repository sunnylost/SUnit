(function() {
    var g = this,
        SUnit = {},
        doc = document,
        el = {},
        toolbar, currentItem,
        costtime = 0,
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

    var id = function(id) {
        return doc.getElementById(id);
    };

    var tag = function(el, tag) {
        return el.getElementsByTagName(tag);
    };

    var log = function() {
        console.log.apply(console, arguments);
    };

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
        }

        initToolbar();
    };

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


    //************* API Begin ****************
    g.test = function(name, fn) {
        var begin, end, cur;
        var li = el.li.cloneNode(false);
        li.innerHTML = html.test.replace('$', name);
        el.area.appendChild(li);
        currentItem = li;
        begin = new Date();
        fn();
        end = new Date();
        cur = end - begin;
        tag(li, 'span')[1].innerHTML = cur + ' ms';
        el.costtime.innerHTML = (costtime += cur);
    };

    g.assert = function(c, text) {
        currentItem.className = c ? 'pass' : 'fail';
    };

    g.deepEqual = function() {

    };

    g.equal = function() {

    };

    g.notDeepEqual = function() {

    };

    g.notEqual = function() {

    };

    g.notStrictEqual = function() {

    };

    g.ok = function() {

    };

    g.strictEqual = function() {

    };
    //************* API End ****************

    g.SUnit = SUnit;
})();

SUnit.init();

/*
 * APIs which need to be implemented:
 *     deepEqual
 *     equal
 *     notDeepEqual
 *     notEqual
 *     notStrictEqual
 *     ok
 *     strictEqual
 *     throws
 *     expect
 *     module
 *
 * Async
 *     asyncTest
 *     start
 *     stop
 *
 */