"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const provider_engine_error_1 = require("./errors/provider-engine-error");
const create_payload_1 = require("./util/create-payload");
// The base class which ProviderEngine will extend from that provides the basic Web3 Provider interface
class BaseProvider extends events_1.EventEmitter {
    // Modern send method
    send(method, params = []) {
        const payload = create_payload_1.createPayload({ method, params });
        return this.sendPayload(payload).then((response) => {
            return response.result;
        });
    }
    // Legacy sendAsync method
    sendAsync(payload, cb) {
        this.sendPayload(payload).then((response) => {
            cb(null, response);
        }).catch((error) => {
            cb(error, null);
        });
    }
    // Whether or not this provider supports subscriptions
    supportsSubscriptions() {
        // Override this in your subclass if you support subscriptions
        return false;
    }
    // Method to subscribe to a given subscription type
    subscribe(_subscribeMethod, _subscriptionMethod, _parameters) {
        // Override this with subscription implementation
        return Promise.reject(new provider_engine_error_1.ProviderEngineError('Subscriptions are not supported', provider_engine_error_1.ProviderEngineErrorCode.UnsupportedFeature));
    }
    // Method to unsubscribe
    unsubscribe(_subscriptionId, _unsubscribeMethod) {
        // Override this with unsubscribe implementation
        return Promise.reject(new provider_engine_error_1.ProviderEngineError('Subscriptions are not supported', provider_engine_error_1.ProviderEngineErrorCode.UnsupportedFeature));
    }
}
exports.default = BaseProvider;
