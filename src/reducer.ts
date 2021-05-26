import { Action, State } from './use-client';
import { Reducer } from 'react';

export const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
    if (action.type === 'start') {
        return {
            ...state,
            isLoading: true,
            isStarted: true,
            data: null,
            error: null,
            response: null,
            statusCode: null,
            index: state.index + 1,
        };
    }

    if (action.type === 'setData') {
        return {
            ...state,
            data: action.data ? action.data : null,
            index: state.index + 1,
        };
    }

    if (action.type === 'success') {
        return {
            ...state,
            isLoading: false,
            data: action.response && action.response.data,
            response: action.response || null,
            statusCode: action.response && action.response.status ? action.response.status : null,
        };
    }

    if (action.type === 'error') {
        return {
            ...state,
            isLoading: false,
            data: null,
            response: action.response || null,
            error: action.error || null,
            statusCode: action.response && action.response.status ? action.response.status : null,
        };
    }

    throw Error(`Action type not found: ${action.type}`);
};
