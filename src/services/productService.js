import fetcher from '../code/fetcher'

export default class ProductService 
{
    constructor()
    {
        this.productCache = null;
    }

    //Get fresh product data
    getProductData() {
        return fetcher('/data/products.json')
    }

    //Get product data from cache if available
    getCachedProductData(cacheBust) {

        if(this.productCache === null || cacheBust)
        {
            return this.getProductData().then(
                (res) => {
                  this.productCache = res;
                  return res;
                }
            );
        }

        return new Promise(x => this.productCache);        
    }

    //Get product id from cache or list of provided products, does not fill cache if empty
    getProductById(id, products) {

        if(products === null || this.productCache === null)
            return;
        
        //FIXME: array may be empty
        return (products ?? this.productCache).filter((obj) => obj.id == id)[0]
    }
}