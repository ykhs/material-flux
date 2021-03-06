// LICENSE : MIT
"use strict";
import {EventEmitter} from "events";
import objectAssign from "object-assign";
class MaterialStore extends EventEmitter {
    constructor(context) {
        if (process.env.NODE_ENV !== 'production') {
            require("assert")(typeof context !== "undefined",
                `Constructor arguments is undefined.
                Please \`new ${this.constructor.name}(context)\`
                `
            )
        }
        this.context = context;
        this.state = undefined;
        this._handlers = {};
    }


    register(eventKey, handler) {
        if (process.env.NODE_ENV !== 'production') {
            require("assert")(typeof this.context !== "undefined",
                `Failed register event handler to store.
                    ${this.constructor.name} has not context.
                    Please \`new ${this.constructor.name}(context)\`
                    `
            )
        }
        if (typeof handler !== 'function') {
            return;
        }
        this._handlers[eventKey] = handler.bind(this);
        this.context._registerStore(this);
    }

    /**
     * This handler is dispatched with payload by context module.
     * @param {object} payload the payload has eventKey and passing arguments.
     */
    handler(payload) {
        let {
            args,
            eventKey
            } = payload;
        if (typeof this._handlers[eventKey] === "function") {
            var handler = this._handlers[eventKey];
            handler.apply(this, args);
        }
    }

    /**
     * add listener to "change" event.
     * @param {Function} callback event handler
     */
    onChange(callback) {
        this.on("change", callback);
    }

    /**
     * remove "change" listener
     * @param {Function} callback event handler
     */
    removeChangeListener(callback) {
        this.removeListener("change", callback);
    }

    /**
     * remove all "change" events
     */
    removeAllChangeListeners() {
        this.removeAllListeners("change");
    }

    waitFor(tokensOrStores) {
        // _waitFor come from context module.
        this._waitFor(tokensOrStores);
    }

    setState(newState) {
        if (typeof this.state === 'undefined') {
            this.state = {};
        }

        this.state = objectAssign({}, this.state, newState);
        this.emit('change');
    }
}
export default MaterialStore;