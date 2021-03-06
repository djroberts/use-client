import { Action, State } from './use-client';
import { reducer } from './reducer';

describe('Reducer', () => {
    it('it should start', () => {
        const MOCK_ACTION: Action<null> = {
            type: 'start',
        };

        const MOCK_STATE: State<null> = {
            isStarted: false,
            isLoading: false,
            data: null,
            error: null,
            response: null,
            index: 1,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);

        expect(result).toMatchObject({ data: null, error: null, index: 2, isLoading: true, response: null, statusCode: null });
    });

    it('it should set data', () => {
        const MOCK_ACTION: Action<string> = {
            type: 'setData',
            data: 'data',
        };

        const MOCK_STATE: State<null> = {
            isStarted: false,
            isLoading: false,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);

        expect(result).toMatchObject({ data: 'data', error: null, index: 3, isLoading: false, response: null, statusCode: null });
    });

    it('it should set data that is null', () => {
        const MOCK_ACTION: Action<null> = {
            type: 'setData',
        };

        const MOCK_STATE: State<null> = {
            isStarted: false,
            isLoading: false,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);

        expect(result).toMatchObject({ data: null, error: null, index: 3, isLoading: false, response: null, statusCode: null });
    });

    it('it should be a success', () => {
        const MOCK_ACTION: Action<string> = {
            type: 'success',
            response: {
                data: 'data',
                status: 1,
            },
        };

        const MOCK_STATE: State<null> = {
            isStarted: true,
            isLoading: true,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);

        expect(result).toMatchObject({ data: 'data', error: null, index: 2, isLoading: false, response: { data: 'data', status: 1 }, statusCode: 1 });
    });

    it('it should be a success with empty response', () => {
        const MOCK_ACTION: Action<null> = {
            type: 'success',
        };

        const MOCK_STATE: State<null> = {
            isStarted: true,
            isLoading: true,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);

        expect(result).toMatchObject({ data: null, error: null, index: 2, isLoading: false, response: null, statusCode: null });
    });

    it('it should provide an error', () => {
        const MOCK_ACTION: Action<null> = {
            type: 'error',
            error: {
                message: 'error',
            },
            response: {
                data: null,
                status: 1,
            },
        };

        const MOCK_STATE: State<null> = {
            isStarted: true,
            isLoading: true,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);

        expect(result).toMatchObject({ data: null, error: { message: 'error' }, index: 2, isLoading: false, response: { data: null, status: 1 }, statusCode: 1 });
    });

    it('it should provide an error with empty response', () => {
        const MOCK_ACTION: Action<null> = {
            type: 'error',
        };

        const MOCK_STATE: State<null> = {
            isStarted: true,
            isLoading: true,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);

        expect(result).toMatchObject({ data: null, error: null, index: 2, isLoading: false, response: null, statusCode: null });
    });

    it('it should throw an error', () => {
        const MOCK_ACTION = {
            type: 'something-else',
        };

        const MOCK_STATE = {
            isStarted: false,
            isLoading: false,
            data: null,
            error: null,
            response: null,
            index: 1,
            statusCode: null,
        } as State<null>;

        try {
            reducer(MOCK_STATE, MOCK_ACTION as Action<null>);
        } catch (exception) {
            expect(exception).toMatchObject(new Error('Action type not found: something-else'));
        }
    });
});
