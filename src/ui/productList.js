import React from 'react';
import ReactDOM from 'react-dom';
import Product from './product'


class ProductList extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = {
            products: [],
            selectedProduct: null,
            isLoaded: (this.props.products ?? []).length >= 1,
            error: null
        }
    }

    componentDidMount()
    {
      if(!this.isLoaded)
      {
        this.loadData()
      }        
    }

    loadData()
    {
      this.props.productService.getCachedData().then(
        (res) => {
          console.log(res)
          this.setState({products:res, isLoaded: true})
        },
        (error) => 
          this.setState({error: error})
      )
    }

    getProducts()
    {
      return this.props.products ?? this.state.products;
    }
 
    listProductItems() {
      var products = this.getProducts();

      if(!Array.isArray(products))
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
      if(this.props['onProductChange'])
        this.props.onProductChange(id)
      else 
        this.setState({selectedProduct: id})
    }

    render() {

      const {isLoaded, error, selectedProduct} = this.state

      if(!isLoaded)
        return (<div>Loading...</div>)

      if(error)
        return (<div>An error has occurred</div>)

      if(selectedProduct)
        return (
          <div>
            <Product 
              productId={selectedProduct} 
              productService={this.props.productService} 
              currencyService={this.props.currencyService} 
              currentCurrency={this.props.currentCurrency}
              onProductChange={() => this.loadData()}
            />
            <br/>
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