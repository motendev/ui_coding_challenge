import React from 'react';
import ReactDOM from 'react-dom';


class CurrencyPicker extends React.Component {

    constructor(props)
    {
        super(props)

        this.state = {
            defaultCurrency: props.defaultCurrency,
            currencies: [],
            onCurrencyChange: this.props.onCurrencyChange
        }

        this.props.currencyService.getCachedData().then(
        (res) => {
            console.log(res)
            this.setState({currencies:res, isLoaded: true})
        },
        (error) => 
            this.setState({error: error})
        )        
    }

    listCurrencies()
    {
        return this.state.currencies.map((obj) =>
            <option value={obj.base.toString()}>
                {obj.base}
            </option>
       );
    }

    render() {
        
        return (
            <select onChange={(e)=>this.state.onCurrencyChange(e.target.value)} value={this.state.defaultCurrency}>
                {this.listCurrencies()}
            </select>
        )
    }
}

export default CurrencyPicker;