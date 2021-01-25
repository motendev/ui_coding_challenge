import './App.css';
import React from 'react';
import ProductList from './ui/productList.js';
import Product from './ui/product.js';
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
            createNewProduct: false
        }

        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onProductCreated = this.onProductCreated.bind(this);
    }

    onCurrencyChange(currency) {
        this.setState({ currentCurrency: currency })
    }

    onProductCreated() {
        this.setState({ createNewProduct: false })
    }

    renderList() {
        if (this.state.createNewProduct)
            return;

        return (
            <ProductList productService={this.state.productService} currencyService={this.state.currencyService} currentCurrency={this.state.currentCurrency} />
        )
    }

    renderNewProduct() {
        if (!this.state.createNewProduct)
            return;

        return (
            <Product
                productId={null}
                productService={this.state.productService}
                currencyService={this.state.currencyService}
                currentCurrency={this.state.currentCurrency}
                isEditMode={true}
                onProductChange={this.onProductCreated}
            />
        )
    }

    renderButtons() {
        return (
            <React.Fragment>
                <button type="button" className="btn btn-primary" onClick={() => { this.setState({ createNewProduct: true }) }}>New Product</button>
                <br />
                <button type="button" className="btn btn-primary" hidden={!this.state.createNewProduct} onClick={() => { this.setState({ createNewProduct: false }) }}>Back</button>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-sm">
                    <div className="container-fluid">
                        <span className="navbar-brand">XYZ Clothing</span>
                        <div className="me-2">
                            <CurrencyPicker currencyService={this.state.currencyService} currentCurrency={this.state.currentCurrency} onCurrencyChange={this.onCurrencyChange} />
                        </div>
                    </div>
                </nav>
                <main>
                    {this.renderList()}
                    {this.renderNewProduct()}
                    {this.renderButtons()}
                </main>
            </div>
        );
    }

}

export default App;
