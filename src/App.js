import logo from './logo.svg';
import './App.css';
import React from 'react';
import ProductList from './ui/productList.js';
import CurrencyPicker from './ui/currencyPicker.js'
import ProductService from './services/productService.js'
import CurrencyService from './services/currencyService.js'

class App extends React.Component {

  constructor(props) {
    super(props)

    //TODO: config for defaultCurrency

    this.state = {
      currentCurrency: "AUD",
      productService: new ProductService(),
      currencyService: new CurrencyService(),
    }


  }

  onCurrencyChange(currency) {
    this.setState({currentCurrency: currency})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Glorious product store of the glorious state of New Productonia</h1>
        </header>
        <main>
          <CurrencyPicker currencyService={this.state.currencyService} defaultCurrency={this.state.currentCurrency} onCurrencyChange={this.onCurrencyChange.bind(this)} />
          {this.state.currentCurrency}
          <ProductList productService={this.state.productService} />
        </main>
      </div>
    );
  }

}

export default App;
