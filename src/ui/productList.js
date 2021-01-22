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
          this.props.productService.getCachedData().then(
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
        <tr key={obj.id.toString()}>
            <th>{obj.id}</th>
            <td>{obj.name}</td>
            <td>${this.props.currencyService.convertFromXToY(this.props.currentCurrency, obj.price.base, obj.price.amount)}</td>
            <td><button type="button" className="btn btn-primary" onClick={() => this.selectProduct(obj.id)}>View</button></td>     
        </tr>
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
            <Product 
              productId={selectedProduct} 
              productService={this.props.productService} 
              currencyService={this.props.currencyService} 
              currentCurrency={this.props.currentCurrency}
            />
            <br/>
            <button type="button" className="btn btn-primary" onClick={() => this.selectProduct(null)}>View All</button>
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