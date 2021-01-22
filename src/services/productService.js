import fetcher from '../code/fetcher'

export default class ProductService 
{
    constructor()
    {
        this.productCache = null;
    }

    getProductData() {
        return fetcher('/data/products.json')
    }

    getCacheProductData() {

        if(this.productCache === null)
        {
            return this.getProductData().then(
                (res) => {
                  this.productCache = res;
                }
            );
        }

        return new Promise(x => this.productCache);        
    }

    getProductById(id, products) {
        return products.filter((obj) => obj.id == id)
    }
}