import AbstractService from "./abstractService";

export default class CurrencyService extends AbstractService {
    constructor() {
        super('base', '/data/exchange_rates.json')
    }

    // converts x currency to y currency
    // e.g. AUD to USD = convertFrom('AUD', 'USD', 25.50)
    convertFromXToY(xId, yId, xPrice) {
        if (xId === yId)
            return xPrice;

        var yCurrency = super.getById(yId);
        return Math.round((yCurrency.rates[xId] * xPrice * 100)) / 100
    }
}