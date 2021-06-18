import * as React from 'react';
import { ReducerAction } from 'react';
import { reducer } from './reducer';
import { ClientRequestContext } from './context';

export interface ClientError {
    [key: string]: any;
}

export interface ClientResponse<T> {
    data: T;
    status: number | string | null;
    [key: string]: any;
}

export interface ClientRequestPromise<T = any> extends Promise<ClientResponse<T>> {}

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
    isStarted: boolean;
    data: T | null;
    error: ClientError | null;
    response: ClientResponse<T> | null;
    index: number;
    statusCode: string | number | null;
}

export interface UseClientResult<T> extends State<T> {
    handleRequest: (data?: any) => void;
    setData: (data: any) => void;
    data: T | null;
}

const initialState: State<any> = {
    isLoading: false,
    isStarted: false,
    data: null,
    error: null,
    response: null,
    index: 1,
    statusCode: null,
};

export interface Action<T> {
    type: 'start' | 'success' | 'error' | 'setData';
    data?: T | null;
    response?: ClientResponse<T>;
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
    const mounted = React.useRef<boolean>(true);

    React.useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

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

    const [state, dispatch] = React.useReducer<React.Reducer<State<T>, Action<T>>>(reducer, initialState);

    const dispachtMounted = (data: Action<T>) => {
        if (!mounted.current) {
            return;
        }

        dispatch(data);
    };

    const handleRequest = async (data?: any) => {
        if (runningOptions.priority === 'first' && requests[name].running) {
            return;
        }

        requests[name].index = state.index;

        dispachtMounted({
            type: 'start',
        });

        try {
            const promise = query(data);

            requests[name].running = true;

            const response: ClientResponse<T> = await promise;

            if (state.index !== requests[name].index) {
                return;
            }

            dispachtMounted({
                type: 'success',
                response,
            });

            if (runningOptions.cache) {
                requests[name].data = response.data;
            }

            requests[name].running = false;
        } catch (error) {
            dispachtMounted({
                type: 'error',
                error,
            });

            requests[name].running = false;
        }
    };

    const getData = (): T | null => {
        if (state.data) {
            return state.data;
        }

        if (!runningOptions.cache) {
            return null;
        }

        return requests[name].data;
    };

    const setData = (data: T | null): void => {
        requests[name].index = state.index;

        dispachtMounted({
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

export const useClientCacheInvalidation = () => {
    const requests = React.useContext<ClientRequests>(ClientRequestContext);

    const invalidate = (name: string): void => {
        if (requests[name]) {
            delete requests[name];
        }
    };

    const invalidateAll = () => {
        const keys = Object.keys(requests);

        keys.forEach((key: string) => {
            delete requests[key];
        });
    };

    return {
        invalidate,
        invalidateAll,
    };
};
