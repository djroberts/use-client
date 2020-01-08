import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import usePrevious from 'use-previous';
import '@testing-library/jest-dom/extend-expect';

import { ClientRequestCall, ClientResponse, useClient } from './use-client';

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

    it('it should execute the request and return a result', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            return {
                data: requestData,
                status: null,
            };
        };

        renderHook(() => {
            const { isLoading, data, error, handleRequest } = useClient('test.result', requestData => mockRequest(requestData));

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

    it('it should pull data from cache', () => {
        expect.assertions(2);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const hookCallback = () => {
            const { isLoading, data, error, handleRequest } = useClient('test.cache', requestData => mockRequest(requestData), { cache: true });

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

    it('it should have an empty cache', () => {
        expect.assertions(2);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const hookCallback = () => {
            const { isLoading, data, error, handleRequest } = useClient('test.emptycache', requestData => mockRequest(requestData), { cache: false });

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

    it('it should execute the request and return a result with cache enabled', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            return {
                data: requestData,
                status: null,
            };
        };

        renderHook(() => {
            const { isLoading, data, error, handleRequest } = useClient('test.second', requestData => mockRequest(requestData), { cache: true });

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

    it('it should handle throwing an error', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            throw Error(ERROR_MESSAGE);
        };

        renderHook(() => {
            const { isLoading, data, error, handleRequest } = useClient('test.error', requestData => mockRequest(requestData), { cache: true });

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

    it('it should let the first request finish', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            await new Promise(r => setTimeout(r, 100));

            return {
                data: requestData,
                status: null,
            };
        };

        const { result } = renderHook(() => {
            const { isLoading, data, error, handleRequest } = useClient('test.first', requestData => mockRequest(requestData), { priority: 'first' });

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

    it('it should ignore first request finish and let the last request finish', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            await new Promise(r => setTimeout(r, 100));

            return {
                data: requestData,
                status: null,
            };
        };

        const { result } = renderHook(() => {
            const { isLoading, data, handleRequest } = useClient('test.last', requestData => mockRequest(requestData), { priority: 'last' });

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

    it('it should set data', () => {
        expect.assertions(1);

        const mockRequest: ClientRequestCall = async (requestData): Promise<ClientResponse> => {
            return {
                data: requestData,
                status: null,
            };
        };

        const { result } = renderHook(() => {
            const { isLoading, data, error, handleRequest, setData } = useClient('test.setdata', requestData => mockRequest(requestData));

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
});
