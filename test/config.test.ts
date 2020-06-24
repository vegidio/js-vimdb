import * as config from 'config'

beforeAll(() => {
    expect.assertions(2)
})

describe('Configuration file', () =>
{
    test('Configuration node "server" is accessible', () => {
        const serverConfig = config.util.toObject(config.get('server'))
        expect(serverConfig.host).toBe('localhost')
        expect(serverConfig.port).toBe(8080)
    })
})