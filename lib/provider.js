"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const context_1 = require("./context");
exports.ClientProvider = (props) => {
    const requestsRef = React.useRef({});
    const { children } = props;
    return React.createElement(context_1.ClientRequestContext.Provider, { value: requestsRef.current }, children);
};
