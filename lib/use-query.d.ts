import * as React from 'react';
export interface Error {
}
export interface Response {
    data: any;
    status: number | string | null;
}
export interface QueryPromise<T = any> extends Promise<Response> {
}
export declare type QueryCall = (data?: unknown) => QueryPromise;
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
export interface Action {
    type: string;
    response?: Response;
    error?: Error;
}
interface QueriesProviderProps {
    children: React.ReactNode;
}
export declare const QueriesProvider: (props: QueriesProviderProps) => JSX.Element;
export interface Options {
    priority?: 'first' | 'last';
}
export declare const useQuery: <T>(name: string, query: QueryCall, options?: Options) => UseQueryResult<T>;
export {};
