import * as React from 'react';
import { reducer } from './reducer';
import { ClientRequestContext } from './context';

export interface ClientError {
    [key: string]: any;
}

export interface ClientResponse {
    data: any;
    status: number | string | null;
    [key: string]: any;
}

export interface ClientRequestPromise<T = any> extends Promise<ClientResponse> {}

export type ClientRequestCall = (data?: any) => ClientRequestPromise;

export interface ClientRequest {
    call: ClientRequestCall;
    running: boolean;
    index: number;
    data?: any;
}

export interface ClientRequests {
    [key: string]: ClientRequest;
}

export interface State<T> {
    isLoading: boolean;
    data: T | null;
    error: ClientError | null;
    response: ClientResponse | null;
    index: number;
    statusCode: string | number | null;
}

export interface UseClientResult<T> extends State<T> {
    handleRequest: (data?: any) => void;
    setData: (data: any) => void;
    data: T | null;
}

const initialState: State<null> = {
    isLoading: false,
    data: null,
    error: null,
    response: null,
    index: 1,
    statusCode: null,
};

export interface Action {
    type: 'start' | 'success' | 'error' | 'setData';
    data?: any;
    response?: ClientResponse;
    error?: ClientError;
}

export interface Options {
    priority?: 'first' | 'last';
    cache?: boolean;
}

const initialOptions: Options = {
    priority: 'last',
    cache: false,
};

export const useClient = <T>(name: string, query: ClientRequestCall, options: Options = {}): UseClientResult<T> => {
    const runningOptions: Options = {
        ...initialOptions,
        ...options,
    };

    const requests = React.useContext<ClientRequests>(ClientRequestContext);

    if (requests[name]) {
        requests[name].call = query;
        if (runningOptions.priority === 'last') {
            requests[name].running = false;
        }
    } else {
        requests[name] = {
            call: query,
            running: false,
            index: 0,
        };
    }

    const [state, dispatch] = React.useReducer(reducer, initialState);
    const handleRequest = async (data?: any) => {
        if (runningOptions.priority === 'first' && requests[name].running) {
            return;
        }

        requests[name].index = state.index;

        dispatch({
            type: 'start',
        });

        try {
            const promise = query(data);

            requests[name].running = true;

            const response: ClientResponse = await promise;

            if (state.index !== requests[name].index) {
                return;
            }

            dispatch({
                type: 'success',
                response,
            });

            if (runningOptions.cache) {
                requests[name].data = response.data;
            }

            requests[name].running = false;
        } catch (error) {
            dispatch({
                type: 'success',
                error,
            });

            requests[name].running = false;
        }
    };

    const getData = (): any => {
        if (state.data) {
            return state.data;
        }

        if (!runningOptions.cache) {
            return null;
        }

        if (requests[name]) {
            return requests[name].data;
        }

        return null;
    };

    const setData = (data: any): void => {
        dispatch({
            type: 'setData',
            data,
        });
    };

    return {
        ...state,
        data: getData(),
        setData,
        handleRequest,
    };
};
