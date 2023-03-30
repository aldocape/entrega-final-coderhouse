import { model, ObjectId, Schema } from 'mongoose';

import { productsCollection } from './products';

export const cartsCollection = 'cart';

const collection: string = productsCollection;

interface ICart extends Document {
  productos: [
    {
      prodId: ObjectId;
      nombre: string;
      cantidad: number;
    }
  ];
  direccion_entrega: string;
}

// La estructura del carrito contiene una propiedad llamada 'productos', que es un array de objetos cuyo id
// es un ObjectId de productos que referencia a dicha colección, y otra propiedad cantidad representada por un número
const cartSchema: Schema = new Schema(
  {
    productos: [
      {
        prodId: {
          type: Schema.Types.ObjectId,
          ref: collection,
          required: true,
        },
        nombre: { type: String, require: true },
        cantidad: { type: Number, require: true },
      },
    ],
    direccion_entrega: { type: String, require: true },
  },
  { timestamps: true, versionKey: false }
);

export default model<ICart>(cartsCollection, cartSchema);
