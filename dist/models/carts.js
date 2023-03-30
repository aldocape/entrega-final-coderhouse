"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartsCollection = void 0;
const mongoose_1 = require("mongoose");
const products_1 = require("./products");
exports.cartsCollection = 'cart';
const collection = products_1.productsCollection;
// La estructura del carrito contiene una propiedad llamada 'productos', que es un array de objetos cuyo id
// es un ObjectId de productos que referencia a dicha colección, y otra propiedad cantidad representada por un número
const cartSchema = new mongoose_1.Schema({
    productos: [
        {
            prodId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: collection,
                required: true,
            },
            nombre: { type: String, require: true },
            cantidad: { type: Number, require: true },
        },
    ],
    direccion_entrega: { type: String, require: true },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)(exports.cartsCollection, cartSchema);
