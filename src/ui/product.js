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
        var product = this.props.productService.getProductById(id);
        var relatedProducts = product.relatedProducts.map(relId => this.props.productService.getProductById(relId))

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

    render() {
        return (
        <div key={this.state.productId}>
            {this.state.product.name}
            {this.state.product.description}
            {this.state.product.price.amount}

            <div>
                <ProductList products={this.state.relatedProducts} productService={this.props.productService} onProductChange={this.onProductChange.bind(this)} />
            </div>
        </div>
        )
    }
}

export default Product;