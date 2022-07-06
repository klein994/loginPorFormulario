import mongoose from "mongoose";

class ContainerMongoose {
    constructor(collection, url, options) {
        mongoose.connect(url, options).then(() => {
            this.collection = mongoose.model(collection.name, collection.schema);
        })
    }
    async save(elem){
        const added = new this.collection(elem);
        await added.save();
        return elem;
    }
    async getById(id){
        try{
            const element = await this.collection.findById(id).select({ __v: 0 }).lean();
            return element;
        }catch
        {
            throw new Error(`Error al Leer: Elemento no encontrado`)
        }
    }
    async getAll(){
        const elements = await this.collection.find().select({ __v: 0 }).lean();
        return elements;
    }
    async updateById(id, elem){
        try{
            const updated = await this.collection.findByIdAndUpdate(id, elem, { new: true });
            return updated;
        }
        catch{
            throw new Error(`Error al Actualizar: Elemento no encontrado`)
        }
    }
    async deleteById(id){
        try{
            const deleted = await this.collection.findByIdAndDelete(id);
            if(!deleted){ throw new Error(`Error al Borrar: Elemento no encontrado`) }
            return deleted;
        }
        catch{
            throw new Error(`Error al Borrar: Elemento no encontrado`)
        }
    }
    async deleteAll(){
        await this.collection.deleteMany({});
    }
    populate(generateObject, cant = 5){
        const array = [];
        for (let i = 0; i < cant; i++) {
            array.push(generateObject());
        }
        return array;
    }
}

export default ContainerMongoose;