import fetcher from '../code/fetcher'

export default class AbstractService 
{
    constructor(keyAccessor, dataUrl) {
        if (new.target === AbstractService) {
            throw new TypeError("Cannot construct AbstractService instances directly");
        }

        this.keyAccessor = keyAccessor;
        this.dataUrl = dataUrl;
        this.cache = null;
    }

    //Get fresh product data
    getData() {
        return fetcher(this.dataUrl)
    }

    //Get product data from cache if available
    getCachedData(cacheBust) {
        if(this.cache === null || cacheBust)
        {
            return this.getData().then(
                (res) => {
                  this.cache = res;
                  return res;
                }
            );
        }

        return new Promise((resolve, reject) => resolve(this.cache));        
    }

    //Get product id from cache or list of provided products, does not fill cache if empty
    getById(id, existingDataSet) {

        var array = this.findIndexOfId(id, existingDataSet);

        //multiple ids, undefined behaviour
        if(array.length > 1)
            return undefined;

        //not found
        if(array.length == 0)
            return null;

        return array[0];
    }

    findIndexOfId(id, existingDataSet)
    {
        if(existingDataSet === null || this.cache === null)
            return;
        
        return (existingDataSet ?? this.cache).filter((obj) => obj[this.keyAccessor] == id)
    }

    saveData(data) {
        var id = data[this.keyAccessor];
        var index = this.findIndexOfId(id);
        this.cache[index] = data;
    }
}