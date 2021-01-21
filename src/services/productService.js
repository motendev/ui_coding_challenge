import fetcher from '../code/fetcher'

export default function getProductData()
{
    return fetcher('/data/products.json')
}