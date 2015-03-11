// LICENSE : MIT
"use strict";
var assert = require("power-assert");
var Flux = require("../").Flux;
var Store = require("../").Store;
var Action = require("../").Action;

var expectedData = ["data is data"];
var keys = {
    "doSomething": "doSomething"
};
class UserAction extends Action {
    doSomething(data) {
        this.doSomething._isCalled = true;
        assert.equal(data, expectedData);
        this.dispatch(keys.doSomething, data);
    }
}
class UserStore extends Store {
    constructor(flux) {
        super(flux);
        this.register(keys.doSomething, this.onHandler);
    }

    onHandler(data) {
        this.onHandler._isCalled = true;
        assert.equal(data, expectedData);
    }
}
class UserFlux extends Flux {
    constructor() {
        super();
        this.userAction = new UserAction(this);
        this.userStore = new UserStore(this);
    }
}

describe("material-flux-test", function () {
    it("has store", function () {
        var flux = new UserFlux();
        flux.userAction.doSomething(expectedData);
        assert(flux.userAction.doSomething._isCalled);
        assert(flux.userStore.onHandler._isCalled);
    });
});