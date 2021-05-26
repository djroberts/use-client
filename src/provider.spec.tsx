import * as React from 'react'

import { render } from '@testing-library/react'

import { ClientProvider } from './provider'
import { ClientRequestContext } from './context'
import { ClientRequests } from './use-client'

describe('Provider', () => {
    it('it should render without crashing', () => {
        const { container } = render(
          <ClientProvider>
            <div>Child element</div>
          </ClientProvider>,
            {
                container: document.createElement('div'),
            },
        )

        expect(container).toMatchSnapshot()
    })

    it('it should render with an empty context object', async () => {
        expect.assertions(1)

        const promise = new Promise(resolve => {
            const Child = () => {
                const requests = React.useContext<ClientRequests>(ClientRequestContext)

                resolve(requests)

                return <div>Child element</div>
            }

            render(
              <ClientProvider>
                <Child />
              </ClientProvider>,
                {
                    container: document.createElement('div'),
                },
            )
        })

        await expect(promise).resolves.toMatchObject({})
    })
})
