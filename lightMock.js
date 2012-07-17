(function (exports) {
    exports.lightMock = function () {
        var _mock = {
            stubs: [],
            raiseFail: function (message) {
                ok(false, message);
            },
            raiseSuccess: function (message) {
                ok(true, message);
            },
            restoreAll: function () {
                for (var i = 0; i < this.stubs.length; i++) {
                    this.stubs[i].restore(0);
                }

                this.stubs.length = 0;
            },
            extend: function (obj) {
                ///<summary>Identifies the object that owns the fucntion to be stubbed</summary>
                var stubs = this.stubs;
                obj.stub = function (name, newBehavior) {
                    var callLimit = null, callCount = 0, callParameters = [];
                    var original = obj[name];

                    obj[name] = function () {
                        ++callCount;
                        if (callLimit !== null && callLimit < callCount) {
                            _mock.raiseFail("'" + name + "' has been called more than the expected limit of " + callLimit);
                        }
                        callParameters = arguments;
                        return newBehavior.apply(obj, arguments);
                    };
                    var stubDelegate = obj[name];
                    stubDelegate.original = original;
                    stubDelegate.parameters = function (n) {
                        return callParameters[n];
                    };
                    stubDelegate.restore = function () {
                        ///<summary>Removes the test stub and restores the original behavior</summary>
                        if (!!obj[name].original) {
                            obj[name] = obj[name].original;
                            var index = stubs.indexOf(obj[name]);
                            if (index >= 0) { stubs.splice(index, 1); }
                        }
                        return obj;
                    };
                    stubDelegate.atMost = function (n) {
                        ///<summary>Sets a limit on the expected calls to this method</summary>
                        callLimit = n;
                        return stubDelegate;
                    };
                    stubDelegate.assert = {
                        calledExactly: function (n) {
                            if (callCount !== n) {
                                _mock.raiseFail("'" + name + "' was called " + callCount + " time(s) but expecting " + n);
                            }
                            _mock.raiseSuccess("'" + name + "' was called " + callCount + " time(s)");
                            return stubDelegate;
                        },
                        callCount: function () {
                            return callCount;
                        }
                    };
                    _mock.stubs.push(stubDelegate);
                    return stubDelegate;
                };
                return obj;
            },
            xhrResult: {
                callResults: {},
                callStatus: 'fail',
                setup: function (options) {
                    this.callResults = options.results;
                    this.callStatus = options.status;
                },
                done: function (callback) {
                    if (this.callStatus === 'success') {
                        callback(this.callResults);
                    }
                    return this;
                },
                fail: function (callback) {
                    if (this.callStatus === 'fail') {
                        callback();
                    }
                    return this;
                },
                always: function (callback) {
                    callback();
                    return this;
                },
                //Pre-jQuery 1.8 promises
                success: function (callback) {
                    if (this.callStatus === 'success') {
                        callback(this.callResults);
                    }
                    return this;
                },
                error: function (callback) {
                    if (this.callStatus === 'fail') {
                        callback();
                    }
                    return this;
                },
                compelte: function (callback) {
                    callback();
                    return this;
                }
            }
        };
        return _mock;
    };
}(window));
