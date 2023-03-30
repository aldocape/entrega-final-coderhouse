"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersCollection = void 0;
const mongoose_1 = require("mongoose");
exports.ordersCollection = 'order';
const products_1 = require("./products");
const collection = products_1.productsCollection;
const orderSchema = new mongoose_1.Schema({
    productos: [
        {
            prodId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: collection,
                required: true,
            },
            cantidad: { type: Number, require: true },
            precio: { type: Number, require: true },
        },
    ],
    userId: { type: String, require: true },
    estado: { type: String, require: true },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)(exports.ordersCollection, orderSchema);
