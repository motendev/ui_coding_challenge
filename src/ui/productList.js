import React from 'react';
import ReactDOM from 'react-dom';
import ProductService from '../services/productService'


class ProductList extends React.Component {

    constructor(props)
    {
        let productService = new ProductService();

        super(props)
        this.state = {
            products: null,
            selectedProduct: null,
            isLoaded: false,
            error: null,
            productService: productService
        }

        productService.getProductData().then(
          (res) => {
            console.log(res)
            this.setState({products:res, isLoaded: true})
          },
          (error) => 
          this.setState({error: error})
        )
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
            {selectedProduct}
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