import {
  saveCart,
  getCartById,
  deleteCartById,
  updateCart,
} from '../services/carts.services';

// Importo función getProductById para asegurarme de que un producto existe
// al momento de agregarlo al carrito
import { getProductById, compareProducts } from '../services/products.services';

import { Router, Request, Response } from 'express';
import { Carrito } from '../interfaces';

const router = Router();

export const saveCartController = async (req: any, res: Response) => {
  const productsCart = req.body.productos;

  try {
    // Creo products como un array vacío
    let products: [any?] = [];

    // Verifico si tengo un prodId que viene por body, creo un array con ese elemento, sino el array queda vacío
    if (productsCart) {
      for (let i = 0; i < productsCart.length; i++) {
        const prod = productsCart[i];
        products.push(prod);
      }
    }

    const cart: Carrito = {
      productos: products,
      direccion_entrega: req.body.direccion_entrega,
    };

    // Guardo carrito en la BD
    const newCart = await saveCart(cart);

    if (newCart) {
      res.status(201).json({
        msg: 'Carrito creado con éxito',
        newCart,
      });
    } else {
      res.json({
        msg: 'Hubo un error al cargar el carrito',
        newCart,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getCartController = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const cart = await getCartById(id);

    if (cart) {
      if (cart.error) {
        res.json(cart);
      } else
        res.json({
          success: true,
          cart,
        });
    } else {
      res.json({
        success: false,
        msg: 'No se ha encontrado un carrito con el id enviado',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const deleteCartController = async (req: Request, res: Response) => {
  try {
    const result = await deleteCartById(req.params.id);

    if (result)
      res.json({
        msg: `El carrito con id "${req.params.id}" ha sido eliminado`,
      });
    else res.json(result);
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const addProdCartController = async (req: Request, res: Response) => {
  const productos: [any] = req.body.productos;

  try {
    // Busco el carrito en la DB
    const productsCart = await getCartById(req.params.id);

    if (!productsCart || productsCart.error) {
      res.status(400).json({
        msg: `No existe el carrito con id: ${req.params.id}`,
      });
    } else {
      // Verifico que existe la propiedad 'productos' en el objeto que recibo
      if (productsCart.productos) {
        // Creo una variable auxiliar 'array' para poder 'pushear'
        // porque si lo hago directamente con la propiedad 'productos', TypeScript marca un error
        const array: [any?] = productsCart.productos;

        // Recorro el array de productos que viene desde el front
        for (let i = 0; i < productos.length; i++) {
          // Busco el producto en la DB
          const prodId = productos[i].prodId;
          const product = await getProductById(prodId);

          if (!product) {
            res.status(400).json({
              msg: `No existe el producto con id: ${prodId}`,
            });
          }
          // Si existe el carrito y el producto, agrego el producto
          // al array de productos del carrito (verificando primero si existe, en cuyo caso sólo aumento la cantidad)
          else {
            let insertItem = true;

            for (let j = 0; j < productsCart.productos.length; j++) {
              if (
                compareProducts(
                  productsCart.productos[j].prodId,
                  productos[i].prodId
                )
              ) {
                array[j].cantidad += productos[i].cantidad;
                insertItem = false;
              }
            }

            if (insertItem) {
              productos[i].nombre = product.nombre;
              array.push(productos[i]);
            }
          }
        }

        const carrito = {
          productos: array,
          direccion_entrega: req.body.direccion_entrega,
        };

        // Actualizo con el nuevo carrito en la base de datos
        const updatedCart = await updateCart(req.params.id, carrito);
        res.json(updatedCart);
      } else {
        res.status(400).json({
          msg: 'Hubo un error al intentar actualizar el carrito',
        });
      }
    }
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const deleteProductCartController = async (
  req: Request,
  res: Response
) => {
  try {
    //Obtengo el carrito desde la DB
    const productsCart = await getCartById(req.params.id);

    // Si el carrito no existe en la DB, mando un error
    if (!productsCart || productsCart.error) {
      res.status(400).json({
        msg: 'No existe ningún carrito con el id proporcionado',
      });
    } else {
      // Si el carrito existe, busco el producto
      let index = -1;

      for (let i = 0; i < productsCart.productos.length; i++) {
        if (productsCart.productos[i].prodId.equals(req.params.id_prod))
          index = i;
      }

      // Si index = -1, el producto con ese id no existe en el carrito, devuelvo un error
      if (index == -1) {
        res.status(400).json({
          msg: 'El id de producto seleccionado no existe en el carrito',
        });
      } else {
        // Si el producto buscado existe, lo elimino en el array de productos con el método 'splice'
        // Creo una variable auxiliar 'array' para poder eliminar
        // porque si lo hago directamente con la propiedad 'productos', TypeScript marca un error
        const array: [any?] = productsCart.productos;
        array.splice(index, 1);

        const carrito = {
          productos: array,
          direccion_entrega: productsCart.direccion_entrega,
        };

        // Actualizo el carrito en la BD
        const updatedCart = await updateCart(req.params.id, carrito);

        // Si salió todo bien muestro carrito actualizado, sino muestro un error
        if (updatedCart) {
          res.json(updatedCart);
        } else {
          res.status(400).json({
            msg: 'Hubo un error al intentar actualizar el carrito',
          });
        }
      }
    }
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
    });
  }
};
