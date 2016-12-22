/* global require, describe, it, before, process, after */
/* jshint esnext: true */

var phantom = require('phantom'),
    cp = require('child_process'),
    assert = require('assert'),
    promiseRetry = require('promise-retry'),
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
        phantom.create()
          .then(function (instance) {
            browser.instance = instance;
            return instance.createPage();
        })
        .then(function (page) {
            browser.page = page;
            browser.open = function(pathname) {
                var url = 'http://127.0.0.1:' + PORT + pathname;
                return page.open(url);
            };
        });
    });

    it('should run a django server', function(done) {
        this.timeout(10000);
        (function waitingForResources() {
            if (server === undefined || browser.open === undefined) {
                setTimeout(waitingForResources, 100);
            }
            else {
                // Waiting for the overall server load
                promiseRetry( function(retry) {
                    return browser.open('/')
                    .then(function(status) {
                        if (status != 'success') {
                            retry();
                        } else {
                            done();
                        }
                    });
                }, {minTimeout: 100, maxTimeout: 1000, retries: 10});
            }
        }());
    });
    describe('displaying starter dashboard', function() {
        it('should display dashboard page with the right title', function() {
            return browser.open('/dashboard/').then(function (status) {
                var page = browser.page;
                assert.equal('success', status);
                return page.evaluate( function () {
                    return document.title;
                });
            })
            .then( function (title) {
                assert.equal(title, 'Django Dashing');
            });
        });
        it('should have a variable called ´dashboard´', function() {
            return browser.open('/dashboard/').then( function (status) {
                var page = browser.page;
                assert.equal('success', status);
                return page.evaluate( function () {
                    /* jshint ignore:start */
                    return (dashboard instanceof Dashboard);
                    /* jshint ignore:end */
                });
            })
            .then( function (instanceofDashboard) {
                assert.ok(instanceofDashboard);
            });
        });
        it('should have an active dashboard', function() {
            return browser.open('/dashboard/').then( function (status) {
                var page = browser.page;
                assert.equal('success', status);
                return page.evaluate( function () {
                    /* jshint ignore:start */
                    return dashboard.grid.active;
                    /* jshint ignore:end */
                });
            })
            .then( function (isActive) {
                assert.ok(isActive);
            });
        });
        it('should display five widgets', function() {
            return browser.open('/dashboard/').then( function (status) {
                var page = browser.page;
                assert.equal('success', status);
                return page.evaluate( function () {
                    /* jshint ignore:start */
                    return dashboard.getWidgets().length;
                    /* jshint ignore:end */
                });
            })
            .then( function (length) {
                assert.equal(length, 5);
            });
        });
    });
    describe('displaying multiple dashboards', function() {
        it('should display dashboard page with the right title', function() {
            return browser.open('/multiple_dashboards/').then( function (status) {
                var page = browser.page;
                assert.equal('success', status);
                return page.evaluate( function () {
                    return document.title;
                });
            })
            .then( function (title) {
                assert.equal(title, 'Multiple Dashboards');
            });
        });
        it('should show the menu overlay when toggleOverlay is fired' +
           'with the ctrl key down event', function() {
            return browser.open('/multiple_dashboards/').then( function (status) {
                var page = browser.page;
                assert.equal('success', status);
                return page.evaluate( function () {
                    /* jshint ignore:start */
                    scope.toggleOverlay({which: 17});
                    return $('#overlayContainer>div').hasClass('in');
                    /* jshint ignore:end */
                });
            })
            .then( function (overlayShown) {
                assert.ok(overlayShown);
            });
        });
        it('should have both rickshaw and d3 available', function() {
            return browser.open('/multiple_dashboards/').then( function (status) {
                var page = browser.page;
                assert.equal('success', status);
                return page.evaluate( function () {
                    /* jshint ignore:start */
                    return d3 !== undefined && Rickshaw !== undefined;
                    /* jshint ignore:end */
                });
            })
            .then( function (isAvailable) {
                assert.ok(isAvailable);
            });
        });
    });
    after(function() {
        browser.instance.exit();
        process.kill(-server.pid);
    });
});
