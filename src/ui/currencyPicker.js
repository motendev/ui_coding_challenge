import React from 'react';

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
            <select className="form-select" aria-label="Default select siteCurrency" onChange={(e) => this.state.onCurrencyChange(e.target.value)} value={this.props.currentCurrency}>
                {this.listCurrencies()}
            </select>
        )
    }
}

export default CurrencyPicker;