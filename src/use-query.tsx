import * as React from 'react';

export interface Error {
    [key: string]: any;
}

export interface Response {
    data: any;
    status: number | string | null;
    [key: string]: any;
}

export interface QueryPromise<T = any> extends Promise<Response> {}

export type QueryCall = (data?: unknown) => QueryPromise;

export interface Query {
    call: QueryCall;
    running: boolean;
    index: number;
}

export interface Queries {
    [key: string]: Query;
}

export interface State<T> {
    isLoading: boolean;
    data: T | null;
    error: Error | null;
    response: Response | null;
    index: number;
    statusCode: string | number | null;
}

export interface UseQueryResult<T> extends State<T> {
    handleRequest: (data?: unknown) => void;
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
    type: string;
    response?: Response;
    error?: Error;
}

const QueriesContext = React.createContext<Queries>({});

interface QueriesProviderProps {
    children: React.ReactNode;
}

export const QueriesProvider = (props: QueriesProviderProps) => {
    const queriesRef = React.useRef<Queries>({});

    const { children } = props;

    return <QueriesContext.Provider value={queriesRef.current}>{children}</QueriesContext.Provider>;
};

const reducer: React.Reducer<State<null>, Action> = (state, action) => {
    if (action.type === 'start') {
        return {
            ...state,
            isLoading: true,
            data: null,
            error: null,
            response: null,
            statusCode: null,
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

    return {
        ...state,
    };
};

export interface Options {
    priority?: 'first' | 'last';
}

const initialOptions: Options = {
    priority: 'last',
};

export const useQuery = <T,>(name: string, query: QueryCall, options: Options = {}): UseQueryResult<T> => {
    const runningOptions: Options = {
        ...initialOptions,
        ...options,
    };

    const queries = React.useContext(QueriesContext);

    if (queries[name]) {
        queries[name].call = query;
        if (runningOptions.priority === 'last') {
            queries[name].running = false;
        }
    } else {
        queries[name] = {
            call: query,
            running: false,
            index: 0,
        };
    }

    const [state, dispatch] = React.useReducer(reducer, initialState);
    const handleRequest = async (data?: unknown) => {
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

            const response: Response = await promise;

            if (state.index !== queries[name].index) {
                return;
            }

            dispatch({
                type: 'success',
                response,
            });

            queries[name].running = false;
        } catch (error) {
            dispatch({
                type: 'success',
                error,
            });

            queries[name].running = false;
        }
    };

    return {
        ...state,
        handleRequest,
    };
};
