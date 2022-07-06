const mongoose = {
    url: "mongodb+srv://klein994:Kl3in171@cluster0.pg7zl.mongodb.net/?retryWrites=true&w=majority",
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    collections: {
        products: {
            name: "products",
            schema: {
                title: { type: String, require: true },
                price: { type: Number, require: true },
                thumbnail: { type: String, require: true }
            }
        },
        messages:{
            name: "messages",
            schema: {
                author: {
                    email: { type: String, require: true }, 
                    nombre: { type: String, require: true },
                    apellido: { type: String, require: true },
                    edad: { type: Number, require: true },
                    alias: { type: String, require: true },
                    avatar: { type: String, require: true },
                },
                text: { type: String, require: true },
                dateString: { type: String, require: true }
            }
        }
    }
}

export default mongoose;