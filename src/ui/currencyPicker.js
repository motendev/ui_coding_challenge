import React from 'react';
import { CurrencyContext } from '../code/CurrencyContext';

/**
 * Renders a list of products either from 'product' property or retrieved from required 'productService' property.
 * Properties: 
 *  onCurrencyChange (required) - new value will be passed when select.onChange occurs
 */
class CurrencyPicker extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            currencies: [],
            onCurrencyChange: this.props.onCurrencyChange
        }
    }

    componentDidMount() {
        this.props.currencyService.getCachedData().then(
            (res) => this.setState({ currencies: res, isLoaded: true }),
            (error) => this.setState({ error: error })
        )
    }

    listCurrencies() {
        return this.state.currencies.map((obj) =>
            <option key={obj.base} value={obj.base}>
                {obj.base}
            </option>
        );
    }

    render() {

        return (
            <CurrencyContext.Consumer>
                {({ currentCurrency, onCurrencyChange }) => (
                    <select className="form-select" aria-label="Default select siteCurrency" onChange={(e) => onCurrencyChange(e.target.value)} value={currentCurrency}>
                        {this.listCurrencies()}
                    </select>
                )}
            </CurrencyContext.Consumer>
        )
    }
}

export default CurrencyPicker;