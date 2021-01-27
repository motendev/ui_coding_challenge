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

    updateRelatedProductIds(oldId, newId) {

        this.cache.forEach(prod => {

            var index = prod.relatedProducts.indexOf(oldId)

            if (index === -1)
                return;

            prod.relatedProducts[index] = newId;

        });

    }
}