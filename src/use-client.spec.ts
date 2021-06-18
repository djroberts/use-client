import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import usePrevious from 'use-previous';
import '@testing-library/jest-dom/extend-expect';

import { ClientRequestCall, ClientResponse, useClient, useClientCacheInvalidation } from './use-client';

describe('Use Client', () => {
    const RESULT = 'result';
    const NEXT_RESULT = 'next result';
    const ERROR_MESSAGE = 'This is an error';

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should invalidate a specific cache', async () => {
        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const hookCallback = () => {
            const { data, handleRequest } = useClient('test.invalidate', (requestData) => mockRequest(requestData), { cache: true });

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            return { data, handleRequest };
        };

        const invalidateHookCallback = () => {
            const { invalidate } = useClientCacheInvalidation();

            invalidate('test.invalidate');
        };

        const { result, waitForNextUpdate } = renderHook(hookCallback);

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        const { result: nextResult } = renderHook(hookCallback);

        expect(nextResult.current.data).toEqual(RESULT);

        renderHook(invalidateHookCallback);

        const { result: lastResult } = renderHook(hookCallback);

        expect(lastResult.current.data).toBeUndefined();
    });

    it('should try to invalidate a non exsisting cache', async () => {
        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const hookCallback = () => {
            const { data, handleRequest } = useClient('test.right', (requestData) => mockRequest(requestData), { cache: true });

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            return { data, handleRequest };
        };

        const invalidateHookCallback = () => {
            const { invalidate } = useClientCacheInvalidation();

            invalidate('test.wrong');
        };

        const { result, waitForNextUpdate } = renderHook(hookCallback);

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        const { result: nextResult } = renderHook(hookCallback);

        expect(nextResult.current.data).toEqual(RESULT);

        renderHook(invalidateHookCallback);

        const { result: lastResult } = renderHook(hookCallback);

        expect(lastResult.current.data).toEqual(RESULT);
    });

    it('should invalidate every cache', async () => {
        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const hookCallback = (cacheName) => () => {
            const { data, handleRequest } = useClient(cacheName, (requestData) => mockRequest(requestData), { cache: true });

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            return { data, handleRequest };
        };

        const invalidateHookCallback = () => {
            const { invalidateAll } = useClientCacheInvalidation();

            invalidateAll();
        };

        const { result, waitForNextUpdate } = renderHook(hookCallback('cache.first'));

        await waitForNextUpdate();

        const { result: otherResult, waitForNextUpdate: waitForOtherUpdate } = renderHook(hookCallback('cache.second'));

        await waitForOtherUpdate;

        renderHook(hookCallback);

        expect(result.current.data).toEqual(RESULT);
        expect(otherResult.current.data).toEqual(RESULT);

        renderHook(invalidateHookCallback);

        const { result: lastResult } = renderHook(hookCallback('cache.first'));
        const { result: otherLastResult } = renderHook(hookCallback('cache.second'));

        expect(lastResult.current.data).toBeUndefined();
        expect(otherLastResult.current.data).toBeUndefined();
    });

    it('should start', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        renderHook(() => {
            const { isStarted, handleRequest, isLoading } = useClient('test.result', (requestData) => mockRequest(requestData));

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            React.useEffect(() => {
                if (isStarted) {
                    expect(isLoading).toEqual(true);
                }
            }, [isStarted]);
        });
    });

    it('should execute the request and return a result', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        renderHook(() => {
            const { isLoading, data, handleRequest } = useClient('test.result', (requestData) => mockRequest(requestData));

            const wasLoading = usePrevious(isLoading);

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            React.useEffect(() => {
                if (wasLoading && !isLoading) {
                    expect(data).toEqual(RESULT);
                }
            }, [isLoading]);
        });
    });

    it('should pull data from cache', async () => {
        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const hookCallback = () => {
            const { data, handleRequest } = useClient('test.cache', (requestData) => mockRequest(requestData), { cache: true });

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            return { data, handleRequest };
        };

        const { result, waitForNextUpdate } = renderHook(hookCallback);

        expect(result.current.data).toBeUndefined();

        await waitForNextUpdate();

        const { result: nextResult } = renderHook(hookCallback);

        expect(nextResult.current.data).toEqual(RESULT);
    });

    it('should have an empty cache', () => {
        expect.assertions(2);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const hookCallback = () => {
            const { isLoading, data, handleRequest } = useClient('test.emptycache', (requestData) => mockRequest(requestData), { cache: false });

            const wasLoading = usePrevious(isLoading);

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            React.useEffect(() => {
                if (wasLoading && !isLoading) {
                    expect(data).toEqual(RESULT);
                }
            }, [isLoading]);
        };

        renderHook(hookCallback);
        renderHook(hookCallback);
    });

    it('should execute the request and return a result with cache enabled', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        renderHook(() => {
            const { isLoading, data, handleRequest } = useClient('test.second', (requestData) => mockRequest(requestData), { cache: true });

            const wasLoading = usePrevious(isLoading);

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            React.useEffect(() => {
                if (wasLoading && !isLoading) {
                    expect(data).toEqual(RESULT);
                }
            }, [isLoading]);
        });
    });

    it('should handle throwing an error', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (): Promise<ClientResponse<string>> => {
            throw Error(ERROR_MESSAGE);
        };

        renderHook(() => {
            const { isLoading, error, handleRequest } = useClient('test.error', (requestData) => mockRequest(requestData), { cache: true });

            const wasLoading = usePrevious(isLoading);

            React.useEffect(() => {
                handleRequest(RESULT);
            }, []);

            React.useEffect(() => {
                if (wasLoading && !isLoading) {
                    if (error) {
                        expect(error).toEqual(Error(ERROR_MESSAGE));
                    }
                }
            }, [isLoading]);
        });
    });

    it('should let the first request finish', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            await new Promise((r) => setTimeout(r, 100));

            return {
                data: requestData,
                status: null,
            };
        };

        const { result } = renderHook(() => {
            const { isLoading, data, handleRequest } = useClient('test.first', (requestData) => mockRequest(requestData), { priority: 'first' });

            const wasLoading = usePrevious(isLoading);

            React.useEffect(() => {
                act(() => {
                    handleRequest(RESULT);
                });
            }, []);

            React.useEffect(() => {
                if (wasLoading && !isLoading) {
                    expect(data).toEqual(RESULT);
                }
            }, [isLoading]);

            return {
                handleRequest,
            };
        });

        jest.advanceTimersByTime(50);
        result.current.handleRequest(NEXT_RESULT);
        jest.advanceTimersByTime(50);
    });

    it('should ignore first request finish and let the last request finish', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            await new Promise((r) => setTimeout(r, 100));

            return {
                data: requestData,
                status: null,
            };
        };

        const { result } = renderHook(() => {
            const { isLoading, data, handleRequest } = useClient('test.last', (requestData) => mockRequest(requestData), { priority: 'last' });

            const wasLoading = usePrevious(isLoading);

            React.useEffect(() => {
                act(() => {
                    handleRequest(RESULT);
                });
            }, []);

            React.useEffect(() => {
                if (wasLoading && !isLoading) {
                    expect(data).toEqual(NEXT_RESULT);
                }
            }, [isLoading]);

            return {
                handleRequest,
            };
        });

        jest.advanceTimersByTime(50);
        result.current.handleRequest(NEXT_RESULT);
        jest.advanceTimersByTime(150);
    });

    it('should set data', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const { result } = renderHook(() => {
            const { data, handleRequest, setData } = useClient('test.setdata', (requestData) => mockRequest(requestData));

            React.useEffect(() => {
                act(() => {
                    handleRequest(RESULT);
                });
            }, []);

            React.useEffect(() => {
                if (data === NEXT_RESULT) {
                    expect(data).toEqual(NEXT_RESULT);
                }
            }, [data]);

            return {
                setData,
            };
        });

        jest.advanceTimersByTime(10);
        result.current.setData(NEXT_RESULT);
    });

    it('should unmount', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse<string>> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const { unmount } = renderHook(() => {
            const { isStarted, handleRequest, isLoading } = useClient('test.result', (requestData) => mockRequest(requestData));

            React.useEffect(() => {
                act(() => {
                    jest.advanceTimersByTime(5000);
                    handleRequest(RESULT);
                });
            }, []);

            React.useEffect(() => {
                if (isStarted) {
                    expect(isLoading).toEqual(true);
                }
            }, [isStarted]);
        });

        unmount();
    });
});
