import AbstractService from "./abstractService";

export default class CurrencyService extends AbstractService
{
    constructor()
    {
        super('base', '/data/exchange_rates.json')
    }

    convertFromXToY(xId, yId, xPrice)
    {
        var xCurrency = super.getById(xId);
        var yCurrency = super.getById(yId);
        return yCurrency.rates[xId] * xPrice
    }
}