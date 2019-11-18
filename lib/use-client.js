"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reducer_1 = require("./reducer");
const context_1 = require("./context");
const initialState = {
    isLoading: false,
    data: null,
    error: null,
    response: null,
    index: 1,
    statusCode: null,
};
const initialOptions = {
    priority: 'last',
};
exports.useClient = (name, query, options = {}) => {
    const runningOptions = Object.assign(Object.assign({}, initialOptions), options);
    const requests = React.useContext(context_1.ClientRequestContext);
    if (requests[name]) {
        requests[name].call = query;
        if (runningOptions.priority === 'last') {
            requests[name].running = false;
        }
    }
    else {
        requests[name] = {
            call: query,
            running: false,
            index: 0,
        };
    }
    const [state, dispatch] = React.useReducer(reducer_1.reducer, initialState);
    const handleRequest = async (data) => {
        if (runningOptions.priority === 'first' && requests[name].running) {
            return;
        }
        requests[name].index = state.index;
        dispatch({
            type: 'start',
        });
        try {
            const promise = query.call(data);
            requests[name].running = true;
            const response = await promise;
            if (state.index !== requests[name].index) {
                return;
            }
            dispatch({
                type: 'success',
                response,
            });
            requests[name].running = false;
        }
        catch (error) {
            dispatch({
                type: 'success',
                error,
            });
            requests[name].running = false;
        }
    };
    return Object.assign(Object.assign({}, state), { handleRequest });
};
