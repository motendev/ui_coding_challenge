import AbstractService from './abstractService.js'

export default class ProductService extends AbstractService {
    constructor() {
        super('id', '/data/products.json')
    }

    getRelatedProducts(id, existingProduct) {
        var prod = existingProduct;

        if (!prod)
            prod = this.getById(id);

        return prod.relatedProducts.map(relId => this.getById(relId))
    }

    cleanupRelatedProducts(oldId, newId) {

        this.cache.forEach(prod => {

            var index = prod.relatedProducts.indexOf(oldId)

            if (index === -1)
                return;

            prod.relatedProducts[index] = newId;

        });
    }

    updateRelatedProductIds(id, prevRelatedProducts, currRelatedProducts) {

        var dels = prevRelatedProducts.filter(val => !currRelatedProducts.includes(val));
        var adds = currRelatedProducts.filter(val => !prevRelatedProducts.includes(val));

        dels.forEach(relProdId => {

            var relProd = this.getById(relProdId);

            if (!relProd)
                return;

            var ind = relProd.relatedProducts.indexOf(id)

            if (ind === -1)
                return;

            relProd.relatedProducts.splice(ind, 1);
        });

        adds.forEach(relProdId => {

            var relProd = this.getById(relProdId);

            if (!relProd)
                return;

            var ind = relProd.relatedProducts.indexOf(id)

            if (ind !== -1)
                return;

            relProd.relatedProducts.push(id);
        });
    }
}