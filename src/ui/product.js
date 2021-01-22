import React from 'react';
import ReactDOM from 'react-dom';
import ProductList from './productList'


class Product extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = {
            productId: this.props.productId,
            product:null,
            relatedProducts: [],
            isEditMode: false
        }

        this.onProductChange(this.state.productId)
    }

    onProductChange(id) 
    {
        var product = this.props.productService.getProductById(id);
        var relatedProducts = product.relatedProducts.map(relId => this.props.productService.getProductById(relId))

        this.state = {
            productId: id,
            product: product,
            relatedProducts: relatedProducts
        }
    }

    render() {
        return (
        <div>
            {this.state.product.name}
            {this.state.product.description}
            {this.state.product.price.amount}

            <div>
                <ProductList products={this.state.relatedProducts} productService={this.props.productService} onProductChange={this.onProductChange} />
            </div>
        </div>
        )
    }
}

export default Product;