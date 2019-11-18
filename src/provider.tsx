import * as React from 'react';

import { ClientRequestContext } from './context';
import { ClientRequests } from './use-client';

export interface ClientProviderProps {
    children: React.ReactNode;
}

export const ClientProvider = (props: ClientProviderProps) => {
    const requestsRef = React.useRef<ClientRequests>({});

    const { children } = props;

    return <ClientRequestContext.Provider value={requestsRef.current}>{children}</ClientRequestContext.Provider>;
};
