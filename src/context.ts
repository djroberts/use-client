import * as React from 'react';

import { ClientRequests } from './use-client';

export const ClientRequestContext = React.createContext<ClientRequests>({});
