import React from 'react';
import ReactDOM from 'react-dom';
import { gt, lt } from '../code/reactValidators'
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CurrencyPicker from './currencyPicker';
import ProductList from './productList'
import { setProperty } from '../code/setProperty'


class Product extends React.Component {

    constructor(props) {
        super(props)

        if(!props.isEditMode)
            var productState = this.buildProductState(this.props.productId);

        this.state = {
            ...productState,
            isEditMode: !!this.props.isEditMode,
            workingProduct: {price:{base:this.props.currentCurrency}}
        }

        this.editProduct = this.editProduct.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onRelatedProductsChange = this.onRelatedProductsChange.bind(this);
    }

    idValidator = (value, props) => {
        // get the maxLength from component's props
        if (this.props.productService.doesIdExist(value)) {
            // Return jsx
            return <span className="error">Id already exists</span>
        }
    };

    buildProductState(id) {
        var product = this.props.productService.getById(id);
        var relatedProducts = product.relatedProducts.map(relId => this.props.productService.getById(relId))

        return {
            productId: id,
            product: product,
            relatedProducts: relatedProducts
        }
    }

    onProductChange(id) {
        var productState = this.buildProductState(id);
        this.setState(productState);
    }

    renderProductList() {
        return (
            <div>
                <h3>Related Products</h3>
                <div>
                    <ProductList
                        products={this.state.relatedProducts}
                        productService={this.props.productService}
                        currencyService={this.props.currencyService}
                        currentCurrency={this.props.currentCurrency}
                        onProductChange={this.onProductChange.bind(this)}
                    />
                </div>
            </div>
        )
    }

    editProduct() {
        //quick clone with JSON
        this.setState({ isEditMode: true, workingProduct: JSON.parse(JSON.stringify(this.state.product)) });
    }

    saveProduct(e) {
        e.preventDefault();

        //id should be an int, easier if this was a typescript class
        this.state.workingProduct.id = parseInt(this.state.workingProduct.id);
        //set related products
        this.state.workingProduct.relatedProducts = this.state.workingProduct.relatedProducts ?? [];

        //product.id exists if editing an existing product 
        this.props.productService.upsert(this.state?.product?.id ?? this.state.workingProduct.id, this.state.workingProduct);

        if (this.props['onProductChange']) {
            this.props.onProductChange(this.state.workingProduct.id)
        }

        var state = this.buildProductState(this.state.workingProduct.id);

        this.setState({ ...state, isEditMode: false, product: this.state.workingProduct, workingProduct: {} });
    }

    productEditFormChange(property, value) {
        setProperty(this.state.workingProduct, property, value)
        this.setState({ workingProduct: this.state.workingProduct });
    }

    onChange(e) {
        this.productEditFormChange(e.target.name, e.target.value);
    }

    onCurrencyChange(currency) {
        this.productEditFormChange('price.base', currency);
    }

    onRelatedProductsChange(e) {
        var value = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        this.state.workingProduct.relatedProducts = value;
        this.setState({ workingProduct: this.state.workingProduct })
    }

    buildRelatedProductSelect() {
        function productAsSelectOption(product) { return (<option key={product.id} value={product.id}>{product.id} - {product.name} - ${product.price.amount} {product.price.base}</option>) };

        var allProducts = this.props.productService.cache;

        return (
            <select
                name="relatedProducts"
                className="form-select"
                multiple
                aria-label="multiple select relatedProducts"
                value={this.state?.workingProduct?.relatedProducts}
                onChange={this.onRelatedProductsChange}
            >
                {allProducts.map(productAsSelectOption)}
            </select>
        )
    }

    render() {    

        if (this.state.isEditMode) {
            return (
                <Form className="" onSubmit={this.saveProduct}>

                    <div className="mb-3">
                        <label htmlFor="productId" className="form-label">Id</label>
                        <Input type="number" className="form-control" id="productId" name="id" value={this.state?.workingProduct?.id} onChange={this.onChange} validations={[this.idValidator]} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="productName" className="form-label">Product Name</label>
                        <Input type="text" className="form-control" id="productName" name="name" value={this.state?.workingProduct?.name} onChange={this.onChange} minLength="3" validations={[gt]} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="productDescription" className="form-label">Description</label>
                        <Input type="text" className="form-control" id="productDescription" name="description" value={this.state?.workingProduct?.description} onChange={this.onChange} />
                    </div>

                    <div className="mb-3 row">
                        <div className="col-sm">
                            <label htmlFor="productPrice" className="form-label">Price</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <Input type="text" className="form-control" id="productPrice" name="price.amount" value={this.state?.workingProduct?.price?.amount} onChange={this.onChange} minLength="1" validations={[gt]} />
                            </div>
                        </div>
                        <div className="col-sm">
                            <label htmlFor="productCurrency" className="form-label">Currency</label>
                            <CurrencyPicker name="productCurrency" key="productCurrency" currencyService={this.props.currencyService} currentCurrency={this.state?.workingProduct?.price?.base} onCurrencyChange={this.onCurrencyChange} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="relatedProducts" className="form-label">Related Products</label>
                        {this.buildRelatedProductSelect()}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.saveProduct}>Save</button>
                </Form>
            )
        }

        return (
            <div key={this.state.productId}>
                <div className="card" style={{ width: 18 + 'rem' }}>
                    <div className="card-body">
                        <h5 className="card-title">{this.state.product.name}</h5>
                        <p className="card-text">{this.state.product.description}</p>
                        <p>${this.props.currencyService.convertFromXToY(this.props.currentCurrency, this.state.product.price.base, this.state.product.price.amount)}</p>
                        <div type="button" className="btn btn-primary" onClick={this.editProduct}>Edit</div>
                    </div>
                </div>
                {this.renderProductList()}
            </div>
        )
    }
}

export default Product;