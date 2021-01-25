import AbstractService from './abstractService.js'

export default class ProductService extends AbstractService {
    constructor() {
        super('id', '/data/products.json')
    }
}