"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = __importDefault(require("./filter"));
//
// LogFilter
//
class LogFilter extends filter_1.default {
    constructor(opts) {
        // console.log('LogFilter - new')
        super();
        this.type = 'log';
        this.fromBlock = opts.fromBlock !== undefined ? opts.fromBlock : 'latest';
        this.toBlock = opts.toBlock !== undefined ? opts.toBlock : 'latest';
        const expectedAddress = opts.address && (Array.isArray(opts.address) ? opts.address : [opts.address]);
        this.address = expectedAddress && expectedAddress.map(normalizeHex);
        this.topics = opts.topics || [];
        this.updates = [];
        this.allResults = [];
    }
    update(logs) {
        // validate filter match
        const validLogs = [];
        logs.forEach((log) => {
            const validated = this.validateLog(log);
            if (!validated) {
                return;
            }
            // add to results
            validLogs.push(log);
            this.updates.push(log);
            this.allResults.push(log);
        });
        if (validLogs.length > 0) {
            this.emit('data', validLogs);
        }
    }
    getChanges() {
        // console.log('LogFilter - getChanges')
        return this.updates;
    }
    getAllResults() {
        // console.log('LogFilter - getAllResults')
        return this.allResults;
    }
    clearChanges() {
        // console.log('LogFilter - clearChanges')
        this.updates = [];
    }
    validateLog(log) {
        // console.log('LogFilter - validateLog:', log)
        // check if block number in bounds:
        // console.log('LogFilter - validateLog - blockNumber', this.fromBlock, this.toBlock)
        if (blockTagIsNumber(this.fromBlock) && hexToInt(this.fromBlock) >= hexToInt(log.blockNumber)) {
            return false;
        }
        if (blockTagIsNumber(this.toBlock) && hexToInt(this.toBlock) <= hexToInt(log.blockNumber)) {
            return false;
        }
        // address is correct:
        // console.log('LogFilter - validateLog - address', this.address)
        if (this.address && !this.address.map((a) => a.toLowerCase()).includes(log.address.toLowerCase())) {
            return false;
        }
        // topics match:
        // topics are position-dependant
        // topics can be nested to represent `or` [[a || b], c]
        // topics can be null, representing a wild card for that position
        // console.log('LogFilter - validateLog - topics', log.topics)
        // console.log('LogFilter - validateLog - against topics', this.topics)
        const topicsMatch = this.topics.reduce((previousMatched, topicPattern, index) => {
            // abort in progress
            if (!previousMatched) {
                return false;
            }
            // wild card
            if (!topicPattern) {
                return true;
            }
            // pattern is longer than actual topics
            const logTopic = log.topics[index];
            if (!logTopic) {
                return false;
            }
            // check each possible matching topic
            const subtopicsToMatch = Array.isArray(topicPattern) ? topicPattern : [topicPattern];
            const topicDoesMatch = subtopicsToMatch.filter((subTopic) => {
                return logTopic.toLowerCase() === subTopic.toLowerCase();
            }).length > 0;
            return topicDoesMatch;
        }, true);
        // console.log('LogFilter - validateLog - '+(topicsMatch ? 'approved!' : 'denied!')+' ==============')
        return topicsMatch;
    }
}
exports.default = LogFilter;
function blockTagIsNumber(blockTag) {
    return blockTag && ['earliest', 'latest', 'pending'].indexOf(blockTag) === -1;
}
function hexToInt(hexString) {
    return Number(hexString);
}
function normalizeHex(hexString) {
    return hexString.slice(0, 2) === '0x' ? hexString : '0x' + hexString;
}
