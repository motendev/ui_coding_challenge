import React from 'react';
import Product from './product'

/**
 * Renders a list of products either from 'product' property or retrieved from required 'productService' property.
 * Properties: 
 *  currencyService (required)
 *  productService (required)
 *  currentCurrency (required)
 *  onProductChange (optional) - if provided will be called when user selects a product, if not provided the default behaviour of viewing the product will occur
 *  products (optional) - if provided, limits the productList to render the given data
 */
class ProductList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            products: [],
            selectedProduct: null,
            isLoaded: (this.props.products ?? []).length >= 1,
            error: null
        }
    }

    componentDidMount() {
        if (!this.state.isLoaded) {
            this.loadData()
        }
    }

    loadData() {
        this.props.productService.getCachedData().then(
            (res) => this.setState({ products: res, isLoaded: true }),
            (error) => this.setState({ error: error })
        )
    }

    getProducts() {
        return this.props.products ?? this.state.products;
    }

    listProductItems() {
        var products = this.getProducts();

        if (!Array.isArray(products))
            return;

        return products.map((obj) =>
            <tr key={obj.id.toString()}>
                <th>{obj.id}</th>
                <td>{obj.name}</td>
                <td>${this.props.currencyService.convertFromXToY(this.props.currentCurrency, obj.price.base, obj.price.amount)}</td>
                <td><button type="button" className="btn btn-primary" onClick={() => this.onProductChange(obj.id)}>View</button></td>
            </tr>
        );
    }

    onProductChange(id) {
        if (this.props['onProductChange'])
            this.props.onProductChange(id)
        else
            this.setState({ selectedProduct: id })
    }

    render() {

        const { isLoaded, error, selectedProduct } = this.state

        if (!isLoaded)
            return (<div>Loading...</div>)

        if (error)
            return (<div>An error has occurred</div>)

        if (selectedProduct)
            return (
                <div>
                    <Product
                        productId={selectedProduct}
                        productService={this.props.productService}
                        currencyService={this.props.currencyService}
                        currentCurrency={this.props.currentCurrency}
                        onProductChange={() => this.loadData()}
                    />
                    <br />
                    <button type="button" className="btn btn-primary" onClick={() => this.onProductChange(null)}>View All</button>
                </div>
            )

        return (
            <div className="productList">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.listProductItems()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ProductList;