import React from 'react';
import ReactDOM from 'react-dom';
import getProductData from '../services/productService'


class ProductList extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = {
            products: null,
            isLoaded: false,
            error: null
        }

        getProductData().then(
          (res) => {
            console.log(res)
            this.setState({products:res})
          },
          (error) => 
          console.log(error)
        )
    }
 
    product() {
        if(!Array.isArray(this.state.products))
            return;

       return this.state.products.map((obj) =>
        <li key={obj.id.toString()}>
            <b>{obj.name}</b>
            <br/>
            <small>{obj.description}</small>
        </li>
       );

    }

    render() {

      const {products, isLoaded, error} = this.state

      return (
        <div className="productList">
          <h1>Listing products</h1>
        <ul>
            {this.product()}
        </ul>
        </div>
      );
    }
}

export default ProductList;