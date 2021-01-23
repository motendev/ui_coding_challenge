import React from 'react';
import ReactDOM from 'react-dom';


class CurrencyPicker extends React.Component {

    constructor(props)
    {
        super(props)

        this.state = {
            currentCurrency: props.defaultCurrency,
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
            <option key={obj.base} value={obj.base} {...(obj.base === this.state.currentCurrency && {selected:true})}>
                {obj.base}
            </option>
       );
    }

    render() {
        
        return (
            <select className="form-select" aria-label="Default select siteCurrency" onChange={(e)=>this.state.onCurrencyChange(e.target.value)}>
                {this.listCurrencies()}
            </select>
        )
    }
}

export default CurrencyPicker;