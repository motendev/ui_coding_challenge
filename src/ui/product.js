import React from 'react';
import ReactDOM from 'react-dom';
import ProductList from './productList'


class Product extends React.Component {

    constructor(props)
    {
        super(props)

        var productState = this.buildProductState(this.props.productId)

        this.state = {
            ...productState,
            isEditMode: false
        }        
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
        var productState = this.buildProductState(id)
        this.setState(productState)
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
                    onProductChange={this.onProductChange.bind(this)}
                    allowDirectPurchase={false}
                    allowView={false}
                />
            </div>
        </div>
        )        
    }

    render() {
        
        return (
            <div key={this.state.productId}>
                <div className="card" style={{width: 18 + 'rem'}}>
                    <div className="card-body">
                        <h5 className="card-title">{this.state.product.name}</h5>
                        <p className="card-text">{this.state.product.description}</p>
                        <a href="#" className="btn btn-primary">${this.state.product.price.amount}</a>      
                    </div>
                </div>
                {this.renderProductList()}
            </div>
        )
    }
}

export default Product;