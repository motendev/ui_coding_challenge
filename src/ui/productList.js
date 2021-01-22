import React from 'react';
import ReactDOM from 'react-dom';
import Product from './product'


class ProductList extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = {
            products: props.products ?? [],
            selectedProduct: null,
            isLoaded: (props.products ?? []).length >= 1,
            error: null,
            onProductChange: this.props['onProductChange']
        }

        if(this.state.products.length === 0)
        {
          this.props.productService.getCachedProductData().then(
            (res) => {
              console.log(res)
              this.setState({products:res, isLoaded: true})
            },
            (error) => 
              this.setState({error: error})
          )
        }        
    }
 
    listProductItems() {
        if(!Array.isArray(this.state.products))
            return;

       return this.state.products.map((obj) =>
        <li key={obj.id.toString()}>
            <b onClick={() => this.selectProduct(obj.id)}>{obj.name}</b>
            <br/>
            <small>{obj.description}</small>
        </li>
       );
    }

    selectProduct(id) {

      if(this.state.onProductChange)
        this.state.onProductChange(id)
      else 
        this.setState({selectedProduct: id})
    }

    render() {

      const {products, isLoaded, error, selectedProduct} = this.state

      if(!isLoaded)
        return (<div>Loading...</div>)

      if(error)
        return (<div>An error has occurred</div>)

      if(selectedProduct)
        return (
          <div>
            <Product productId={selectedProduct} productService={this.props.productService} />
            <br/>
            <button onClick={() => this.selectProduct(null)}>Back</button>
          </div>
        )

      return (
        <div className="productList">
          <h1>Listing products</h1>
          <ul>
              {this.listProductItems()}
          </ul>
        </div>
      );
    }
}

export default ProductList;