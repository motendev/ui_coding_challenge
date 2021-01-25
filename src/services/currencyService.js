import AbstractService from "./abstractService";

export default class CurrencyService extends AbstractService {
    constructor() {
        super('base', '/data/exchange_rates.json')
    }

    convertFromXToY(xId, yId, xPrice) {
        if (xId === yId)
            return xPrice;

        var yCurrency = super.getById(yId);
        return Math.round((yCurrency.rates[xId] * xPrice * 100)) / 100
    }
}