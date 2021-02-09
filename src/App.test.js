import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import App from './App';

const server = setupServer(
    rest.get('/data/products.json', (req, res, ctx) => {
        // respond using a mocked JSON body
        return res(ctx.json([{
            "id": 1,
            "name": "Brown Shoes",
            "description": "A brown shirt made from fine cotton.",
            "price": {
                "base": "USD",
                "amount": 50
            },
            "relatedProducts": [2]
        }]))
    }),


    rest.get('/data/products.json', (req, res, ctx) => {
        // respond using a mocked JSON body
        return res(ctx.json([{
            "id": 1,
            "name": "Brown Shoes",
            "description": "A brown shirt made from fine cotton.",
            "price": {
                "base": "USD",
                "amount": 50
            },
            "relatedProducts": [2]
        }]))
    })
)

// establish API mocking before all tests
beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())

test('renders learn react link', async () => {
    render(<App />);
    expect(screen.getByText("Brown Shoes")).toBeInTheDocument();
});