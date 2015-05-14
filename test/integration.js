/* global require, describe, it, before, process, after */
/* jshint esnext: true */

var phantom = require('phantom'),
    cp = require('child_process'),
    assert = require('assert'),
    browser = {},
    server;

const PORT = '4567';

describe('django-dashing tests:', function() {
    before(function() {
        // verify django in path
        cp.exec('which django-admin.py' , function (err, stdout) {
            if (!stdout) throw new Error('django-admin.py not found');
        });
        // start django test server
        cp.exec('which python', function (err, stdout) {
            var pythonPath = stdout.replace('\n', '');
            server = cp.spawn(pythonPath, ['test/test_app/manage.py',
                                           'runserver', PORT],
                                            {detached: true});
        });
        // create a browser instance
        phantom.create(function (ph) {
            ph.createPage(function (page) {
                browser.open = function(pathname, callback) {
                    page.open.apply(page,
                            ['http://127.0.0.1:' + PORT + pathname,
                             callback.bind(page)]);
                };
                browser.exit = ph.exit.bind(null);
            });
        });
    });
    it('should run a django server', function(done) {
        (function waitingForResources() {
            if (server === undefined || browser.open === undefined) {
                setTimeout(waitingForResources, 100);
            }
            else {
                // Waiting for the overall server load
                setTimeout(done, 1000);
            }
        }());
    });
    describe('displaying starter dashboard', function() {
        it('should display dashboard page with the right title', function(done) {
            browser.open('/dashboard/', function (status) {
                var page = this;
                assert.equal('success', status);
                page.evaluate(
                    function () {
                        return document.title;
                    },
                    function (title) {
                        assert.equal(title, 'Django Dashing');
                        done();
                    });
            });
        });
        it('should have a variable called ´dashboard´', function(done) {
            browser.open('/dashboard/', function (status) {
                var page = this;
                assert.equal('success', status);
                page.evaluate(
                    function () {
                        /* jshint ignore:start */
                        return (dashboard instanceof Dashboard);
                        /* jshint ignore:end */
                    },
                    function (instanceofDashboard) {
                        assert.ok(instanceofDashboard);
                        done();
                    });
            });
        });
        it('should have an active dashboard', function(done) {
            browser.open('/dashboard/', function (status) {
                var page = this;
                assert.equal('success', status);
                page.evaluate(
                    function () {
                        /* jshint ignore:start */
                        return dashboard.grid.active;
                        /* jshint ignore:end */
                    },
                    function (isActive) {
                        assert.ok(isActive);
                        done();
                    });
            });
        });
        it('should display four widgets', function(done) {
            browser.open('/dashboard/', function (status) {
                var page = this;
                assert.equal('success', status);
                page.evaluate(
                    function () {
                        /* jshint ignore:start */
                        return dashboard.listWidgets().length;
                        /* jshint ignore:end */
                    },
                    function (length) {
                        assert.equal(length, 4);
                        done();
                    });
            });
        });
    });
    describe('displaying multiple dashboards', function() {
        it('should display dashboard page with the right title', function(done) {
            browser.open('/multiple_dashboards/', function (status) {
                var page = this;
                assert.equal('success', status);
                page.evaluate(
                    function () {
                        return document.title;
                    },
                    function (title) {
                        assert.equal(title, 'Multiple Dashboards');
                        done();
                    });
            });
        });
        it('should show the menu overlay when toggleOverlay is fired' +
           'with the ctrl key down event', function(done) {
            browser.open('/multiple_dashboards/', function (status) {
                var page = this;
                assert.equal('success', status);
                page.evaluate(
                    function () {
                        /* jshint ignore:start */
                        scope.toggleOverlay({which: 17});
                        return $('#overlayContainer>div').hasClass('in');
                        /* jshint ignore:end */
                    },
                    function (overlayShown) {
                        assert.ok(overlayShown);
                        done();
                    });
            });
        });
    });
    after(function() {
        browser.exit();
        process.kill(-server.pid);
    });
});
