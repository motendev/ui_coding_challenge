import React from 'react';
import ReactDOM from 'react-dom';
import CurrencyPicker from './currencyPicker';
import ProductList from './productList'
import {setProperty} from '../code/setProperty'


class Product extends React.Component {

    constructor(props)
    {
        super(props)

        var productState = this.buildProductState(this.props.productId)

        this.state = {
            ...productState,
            isEditMode: false
        }        

        this.editProduct = this.editProduct.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onRelatedProductsChange = this.onRelatedProductsChange.bind(this);
    }

    buildProductState(id) 
    {
        var product = this.props.productService.getById(id);
        var relatedProducts = product.relatedProducts.map(relId => this.props.productService.getById(relId))

        return {
            productId: id,
            product: product,
            relatedProducts: relatedProducts
        }
    }

    onProductChange(id)
    {
        var productState = this.buildProductState(id);
        this.setState(productState);
    }

    renderProductList()
    {
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

    editProduct()
    {   
        //quick clone with JSON
        this.setState({isEditMode:true, workingProduct: JSON.parse(JSON.stringify(this.state.product))});
    }

    saveProduct(e)   {   
        e.preventDefault();
        this.props.productService.insertAtId(this.state.product.id, this.state.workingProduct);
        if(this.props['onProductChange'])
        {
            this.props.onProductChange(this.state.workingProduct.id)
        }            

        var state = this.buildProductState(this.state.workingProduct.id);

        this.setState({...state, isEditMode:false, product:this.state.workingProduct, workingProduct:null});
    }


    productEditFormChange(property, value) {

        setProperty(this.state.workingProduct, property, value)
        this.setState({workingProduct:this.state.workingProduct});
    }

    onChange(e)
    {
        this.productEditFormChange(e.target.name, e.target.value);
    }

    onCurrencyChange(currency)
    {
        this.productEditFormChange('price.base', currency);
    }

    onRelatedProductsChange(e)
    {
        var value = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        
        this.state.workingProduct.relatedProducts = value;

        this.setState({workingProduct: this.state.workingProduct})
    }

    buildRelatedProductSelect()
    {
        function productAsSelectOption(product){return (<option key={product.id} value={product.id}>{product.name}</option>)};

        var allProducts = this.props.productService.cache;

        return (
            <select 
                name="relatedProducts"
                className="form-select" 
                multiple
                aria-label="multiple select relatedProducts"
                value={this.state.workingProduct.relatedProducts}
                onChange={this.onRelatedProductsChange}
            >
                {allProducts.map(productAsSelectOption)}                
            </select>
        )
    }

    render() {

        if(this.state.isEditMode)
        {
            return(
            <form className="" onSubmit={this.saveProduct}>
                <div className="mb-3">
                    <label htmlFor="productId" className="form-label">Id</label>
                    <input type="number" className="form-control" id="productId" name="id" value={this.state.workingProduct.id} onChange={this.onChange}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input type="text" className="form-control" id="productName" name="name" value={this.state.workingProduct.name} onChange={this.onChange}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label">Description</label>
                    <input type="text" className="form-control" id="productDescription" name="description" value={this.state.workingProduct.description} onChange={this.onChange}/>
                </div>

                <div className="mb-3 row">
                    <div className="col-sm">
                        <label htmlFor="productPrice" className="form-label">Price</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input type="text" className="form-control" id="productPrice" name="price.amount" value={this.state.workingProduct.price.amount} onChange={this.onChange}/>
                        </div>
                    </div>
                    <div className="col-sm">
                        <label htmlFor="productCurrency" className="form-label">Currency</label>
                        <CurrencyPicker name="productCurrency" key="productCurrency" currencyService={this.props.currencyService} currentCurrency={this.state.workingProduct.price.base} onCurrencyChange={this.onCurrencyChange}/>
                    </div>
                </div>

                {this.buildRelatedProductSelect()}

                <button type="button" className="btn btn-primary" onClick={this.saveProduct}>Save</button>
            </form>
            )
        }
        
        return (
            <div key={this.state.productId}>
                <div className="card" style={{width: 18 + 'rem'}}>
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