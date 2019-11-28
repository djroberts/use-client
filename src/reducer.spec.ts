import { Action, State } from './use-client';
import { reducer } from './reducer';

describe('Reducer', () => {
    it('it should start', () => {
        const MOCK_ACTION: Action = {
            type: 'start',
        };

        const MOCK_STATE: State<null> = {
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
        const MOCK_ACTION: Action = {
            type: 'setData',
            data: 'data',
        };

        const MOCK_STATE: State<null> = {
            isLoading: false,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);
        expect(result).toMatchObject({ data: 'data', error: null, index: 2, isLoading: false, response: null, statusCode: null });
    });

    it('it should be a success', () => {
        const MOCK_ACTION: Action = {
            type: 'success',
            response: {
                data: 'data',
                status: 1,
            },
        };

        const MOCK_STATE: State<null> = {
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
        const MOCK_ACTION: Action = {
            type: 'success',
        };

        const MOCK_STATE: State<null> = {
            isLoading: true,
            data: null,
            error: null,
            response: null,
            index: 2,
            statusCode: null,
        };

        const result = reducer(MOCK_STATE, MOCK_ACTION);
        expect(result).toMatchObject({ data: undefined, error: null, index: 2, isLoading: false, response: null, statusCode: null });
    });

    it('it should provide an error', () => {
        const MOCK_ACTION: Action = {
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
        const MOCK_ACTION: Action = {
            type: 'error',
        };

        const MOCK_STATE: State<null> = {
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
            isLoading: false,
            data: null,
            error: null,
            response: null,
            index: 1,
            statusCode: null,
        } as State<null>;

        try {
            const result = reducer(MOCK_STATE, MOCK_ACTION as Action);
        } catch (exception) {
            expect(exception).toMatchObject(new Error('Action type not found: something-else'));
        }
    });
});
