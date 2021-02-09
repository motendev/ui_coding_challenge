import './App.css';
import React from 'react';
import ProductList from './ui/productList.js';
import Product from './ui/product.js';
import CurrencyPicker from './ui/currencyPicker.js'
import ProductService from './services/productService.js'
import CurrencyService from './services/currencyService.js'
import { CurrencyContext } from './code/CurrencyContext';

class App extends React.Component {

    constructor(props) {
        super(props)

        //TODO: config for defaultCurrency

        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onProductCreated = this.onProductCreated.bind(this);
        this.onProductSelected = this.onProductSelected.bind(this);
        this.onProductEdit = this.onProductEdit.bind(this);

        this.state = {
            ...this.NO_PRODUCT,
            currentCurrency: 'AUD',
            onCurrencyChange: this.onCurrencyChange,
            productService: new ProductService(),
            currencyService: new CurrencyService(),
        }
    }

    NEW_PRODUCT = { selectedProductId: null, createNewProduct: true, productIsEditing: true }
    EDIT_PRODUCT = { createNewProduct: true, productIsEditing: false }
    NO_PRODUCT = { selectedProductId: null, createNewProduct: false, productIsEditing: false, }

    onCurrencyChange(currency) {
        this.setState({ currentCurrency: currency })
    }

    onProductCreated(id) {
        this.setState({ createNewProduct: false, productIsEditing: false, selectedProductId: id })
    }

    onProductEdit(isEdit) {
        this.setState({ productIsEditing: isEdit })
    }

    onProductSelected(selectedProductId) {
        this.setState({ selectedProductId: selectedProductId });
    }

    relatedProductsText() {
        if (this.state.selectedProductId !== null) {
            return <h3>Related Products</h3>
        }

        return <h1>Products</h1>;
    }

    renderList() {
        if (this.state.createNewProduct || this.state.productIsEditing)
            return;

        return (
            <React.Fragment>
                {this.relatedProductsText()}
                <ProductList
                    selectedProductId={this.state.selectedProductId}
                    productService={this.state.productService}
                    currencyService={this.state.currencyService}
                    onProductSelected={this.onProductSelected}
                />
            </React.Fragment>
        )
    }

    renderNewProduct() {
        if (!this.state.createNewProduct && this.state.selectedProductId === null)
            return;

        return (
            <Product
                productId={this.state.selectedProductId}
                productService={this.state.productService}
                currencyService={this.state.currencyService}
                isEditMode={this.state.createNewProduct}
                onProductChange={this.onProductCreated}
                onProductEdit={this.onProductEdit}
            />
        )
    }

    renderButtons() {
        return (
            <React.Fragment>
                <button type="button" className="btn btn-primary"
                    hidden={this.state.createNewProduct || this.state.productIsEditing}
                    onClick={() => { this.setState({ ...this.NEW_PRODUCT }) }}>New Product</button>
                <button type="button" className="btn btn-primary"
                    hidden={(this.state.selectedProductId === null || (this.state.selectedProductId !== null && this.state.productIsEditing))}
                    onClick={() => { this.setState({ ...this.NO_PRODUCT }) }}>Back</button>
            </React.Fragment>
        )
    }

    render() {
        return (
            <CurrencyContext.Provider value={this.state}>
                <div className="container">
                    <nav className="navbar navbar-expand-sm">
                        <div className="container-fluid">
                            <span className="navbar-brand">XYZ Clothing</span>
                            <div className="me-2">
                                <CurrencyPicker currencyService={this.state.currencyService} onCurrencyChange={this.onCurrencyChange} currentCurrency={this.state.currentCurrency} />
                            </div>
                        </div>
                    </nav>
                    <main>
                        {this.renderNewProduct()}
                        {this.renderList()}
                        {this.renderButtons()}
                    </main>
                </div>
            </CurrencyContext.Provider>
        );
    }

}

export default App;
