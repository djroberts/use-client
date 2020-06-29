# useClient React Hook
Wrapper to turn any async call into a React hook, but primarily aimed at Axios requests.
 
Installation:

  ```sh
  npm i use-client
  ```

### Usage

```javascript
import * as React from 'react';
import { useClient } from './use-client';
import { fetchData, updateData } from './some-api';

const useFetchData = () => {
    const { isLoading, error, makeRequest, data, setData } = useClient('unique.name', () => fetchData(), { cache: true });
    
    React.useEffect(() => {
        makeRequest();    
    }, []);

    return {
        isLoading,
        error,
        makeRequest,
        data,    
        setData,
    };
}

const useUpdateData = () => {
    const { isLoading, error, makeRequest, data, setData } = useClient('other.unique.name', (data) => updateData(data));
    
    const update = (data) => {
        makeRequest(data);    
    }   

    return {
        isLoading,
        error,
        update,
        data,    
        setData,
    };
}

export { useFetchData, useUpdateData };

```

### Reference:

```javascript
    const { isLoading, error, data, setData, makeRequest, response } = useClient(uniqueName, call, options);

    options:
        cache: boolean -- Cache the request by the uniqueName
        priority: first | last -- Rules when multiple async requests are fired. First ignores all but the first request, last ignores all but the last request.
```






