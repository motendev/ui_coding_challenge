import fetcher from '../code/fetcher'

export default function getCurrencyInformation()
{
    return fetcher('/data/exchange_rates.json')
}