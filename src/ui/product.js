import React from 'react';
import CurrencyPicker from './currencyPicker';
import ProductList from './productList'
import { setProperty } from '../code/setProperty'
import SimpleReactValidator from 'simple-react-validator';

/**
 * Renders a product with the ability to also edit/create products
 * Properties: 
 *  currencyService (required)
 *  productService (required)
 *  currentCurrency (required)
 *  productId (required) - the product to display
 *  isEditMode (optional) - if provided the component will load the product form allowing the user to edit if productId is provided, or create a new product otherwise
 */
class Product extends React.Component {

    constructor(props) {
        super(props)

        if (!props.isEditMode)
            var productState = this.buildProductState(this.props.productId);

        this.state = {
            ...productState,
            isEditMode: !!this.props.isEditMode
        }

        this.editProduct = this.editProduct.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onRelatedProductsChange = this.onRelatedProductsChange.bind(this);

        this.validator = new SimpleReactValidator({
            validators: {
                idValidator: {
                    message: "The id specified is already in use.",
                    rule: this.idValidatorRule.bind(this)
                }
            }
        });
    }

    //Returns true if valid: id is not being used already or the productid is set in the state and is the same as the form product id
    idValidatorRule(val) {
        var possiblyNewId = parseInt(val);
        var idExists = this.props.productService.doesIdExist(parseInt(val));

        //not valid if the id already exists unless you are currently editing the duplicated id
        return !idExists || this.state.productId === possiblyNewId;
    }

    buildProductState(id) {
        var product = this.props.productService.getById(id);
        var relatedProducts = product.relatedProducts.map(relId => this.props.productService.getById(relId))

        return {
            productId: id,
            product: product,
            relatedProducts: relatedProducts,
            workingProduct: { price: { base: this.props.currentCurrency } }
        }
    }

    onProductChange(id) {
        this.setState({ ...this.buildProductState(id) });
    }

    editProduct() {
        //quick clone with JSON
        this.setState({ isEditMode: true, workingProduct: JSON.parse(JSON.stringify(this.state.product)) });
    }

    saveProduct(e) {
        e.preventDefault();

        if (!this.validator.allValid()) {
            this.validator.showMessages();
            //force rerender as required by simple-react-validator
            this.forceUpdate();
            return;
        }

        var workingProduct = this.state.workingProduct;

        //productId exists if editing an existing product 
        var id = this.state?.productId ?? workingProduct.id;
        //Not a fan of parsing data in a save method. Need to automatically bind a form to a stongly typed object
        id = parseInt(id);
        workingProduct.id = id;
        //ensure property is declared, again solved by having a strongly typed object
        workingProduct.relatedProducts = workingProduct.relatedProducts ?? [];

        this.props.productService.upsert(id, workingProduct);

        if (this.props['onProductChange']) {
            this.props.onProductChange(id)
        }


        var productState = this.buildProductState(id);
        this.setState({
            ...productState,
            isEditMode: false
        });
    }

    productEditFormChange(property, value) {
        var workingProduct = { ...this.state.workingProduct };
        setProperty(workingProduct, property, value)
        this.setState({ workingProduct: workingProduct });
    }

    onChange(e) {
        var val = e.target.value
        if (e.target.type === 'number') {
            val = (val.indexOf('.') === -1 ? parseInt(val) : parseFloat(val))
        }
        this.productEditFormChange(e.target.name, val);
    }

    onCurrencyChange(currency) {
        this.productEditFormChange('price.base', currency);
    }

    onRelatedProductsChange(e) {
        var value = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        var workingProduct = { ...this.state.workingProduct };
        workingProduct.relatedProducts = value;
        this.setState({ workingProduct: workingProduct });
    }

    buildRelatedProductSelect() {
        function productAsSelectOption(product) { return (<option key={product.id} value={product.id}>{product.id} - {product.name} - ${product.price.amount} {product.price.base}</option>) };

        //no self referencing allowed
        var allProducts = this.props.productService.cache.filter(prod => prod.id !== this.state.productId);

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

    render() {

        if (this.state.isEditMode) {
            return (
                <form className="" onSubmit={this.saveProduct}>

                    <div className="mb-3">
                        <label htmlFor="productId" className="form-label">Id</label>
                        <input type="number" step="1" className="form-control" id="productId" name="id" value={this.state?.workingProduct?.id} onChange={this.onChange} />
                        {this.validator.message('productId', this.state?.workingProduct?.id, 'required|idValidator|numeric|min:0,num')}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="productName" className="form-label">Product Name</label>
                        <input type="text" className="form-control" id="productName" name="name" value={this.state?.workingProduct?.name} onChange={this.onChange} />
                        {this.validator.message('productName', this.state?.workingProduct?.name, 'required|min:3')}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="productDescription" className="form-label">Description</label>
                        <input type="text" className="form-control" id="productDescription" name="description" value={this.state?.workingProduct?.description} onChange={this.onChange} />
                    </div>

                    <div className="mb-3 row">
                        <div className="col-sm">
                            <label htmlFor="productPrice" className="form-label">Price</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input type="number" step="0.01" className="form-control" id="productPrice" name="price.amount" value={this.state?.workingProduct?.price?.amount} onChange={this.onChange} />
                                {this.validator.message('productPrice', this.state?.workingProduct?.price.amount, 'required|numeric|min:0,num')}
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
                </form>
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