export interface ClientError {
    [key: string]: any;
}
export interface ClientResponse {
    data: any;
    status: number | string | null;
    [key: string]: any;
}
export interface ClientRequestPromise<T = any> extends Promise<ClientResponse> {
}
export declare type ClientRequestCall = (data?: any) => ClientRequestPromise;
export interface ClientRequest {
    call: ClientRequestCall;
    running: boolean;
    index: number;
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
    data: T | null;
}
export interface Action {
    type: 'start' | 'success' | 'error';
    response?: ClientResponse;
    error?: ClientError;
}
export interface Options {
    priority?: 'first' | 'last';
}
export declare const useClient: <T>(name: string, query: ClientRequestCall, options?: Options) => UseClientResult<T>;
