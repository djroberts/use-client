"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const initialState = {
    isLoading: false,
    data: null,
    error: null,
    response: null,
    index: 1,
    statusCode: null,
};
const QueriesContext = React.createContext({});
exports.QueriesProvider = (props) => {
    const queriesRef = React.useRef({});
    const { children } = props;
    return React.createElement(QueriesContext.Provider, { value: queriesRef.current }, children);
};
const reducer = (state, action) => {
    if (action.type === 'start') {
        return Object.assign(Object.assign({}, state), { isLoading: true, data: null, error: null, response: null, statusCode: null, index: state.index + 1 });
    }
    if (action.type === 'success') {
        return Object.assign(Object.assign({}, state), { isLoading: false, data: action.response && action.response.data, response: action.response || null, statusCode: action.response && action.response.status ? action.response.status : null });
    }
    if (action.type === 'error') {
        return Object.assign(Object.assign({}, state), { isLoading: false, data: null, response: action.response || null, error: action.error || null, statusCode: action.response && action.response.status ? action.response.status : null });
    }
    return Object.assign({}, state);
};
const initialOptions = {
    priority: 'last',
};
exports.useQuery = (name, query, options = {}) => {
    const runningOptions = Object.assign(Object.assign({}, initialOptions), options);
    const queries = React.useContext(QueriesContext);
    if (queries[name]) {
        queries[name].call = query;
        if (runningOptions.priority === 'last') {
            queries[name].running = false;
        }
    }
    else {
        queries[name] = {
            call: query,
            running: false,
            index: 0,
        };
    }
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const handleRequest = async (data) => {
        if (runningOptions.priority === 'first' && queries[name].running) {
            return;
        }
        queries[name].index = state.index;
        dispatch({
            type: 'start',
        });
        try {
            const promise = query.call(data);
            queries[name].running = true;
            const response = await promise;
            if (state.index !== queries[name].index) {
                return;
            }
            dispatch({
                type: 'success',
                response,
            });
            queries[name].running = false;
        }
        catch (error) {
            dispatch({
                type: 'success',
                error,
            });
            queries[name].running = false;
        }
    };
    return Object.assign(Object.assign({}, state), { handleRequest });
};
