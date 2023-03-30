import {
  saveProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  updateProduct,
  getManyProducts,
} from '../services/products.services';

import { Request, Response } from 'express';

// Importo enum de Categorías para tenerlas disponibles para carga o consulta
import { Categoria } from '../interfaces';

// Guardar producto nuevo
export const saveController = async (req: any, res: Response) => {
  try {
    const { nombre, descripcion, categoria, codigo, foto, precio, stock } =
      req.productData;

    const newProduct: any = {
      nombre,
      descripcion,
      categoria,
      codigo,
      foto,
      precio,
      stock,
    };

    const newProd = await saveProduct(newProduct);

    res.status(201).json({
      msg: 'Producto creado con éxito',
      newProd,
    });
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// Obtener todos los productos
export const getAllController = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();

    if (products) {
      res.json(products);
    } else {
      res.status(400).json({
        msg: 'Hubo un error al obtener los productos',
      });
    }
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// Obtener productos usando un criterio de búsqueda (en este caso: por Categoría)
export const getManyController = async (req: Request, res: Response) => {
  try {
    let { categoria } = req.params;
    let products;

    if (categoria !== 'Todas') {
      let cat: Categoria = Categoria.Almacen;

      switch (categoria) {
        case 'Muebles':
          cat = Categoria.Muebles;
          break;
        case 'Almacen':
          cat = Categoria.Almacen;
          break;
        case 'Electrodomesticos':
          cat = Categoria.Electro;
          break;
        case 'Indumentaria':
          cat = Categoria.Ropa;
          break;
        default:
          break;
      }

      products = await getManyProducts({ categoria: cat });
    } else {
      // Si la categoría que llega por parámetro es 'Todas', muestro todos los productos
      // Tuve que hacerlo de esta manera, debido a que si llega vacío, se va al endpoint de buscar producto por id
      products = await getAllProducts();
    }

    if (products) {
      res.json(products);
    } else {
      res.status(400).json({
        msg: 'Hubo un error al obtener los productos',
      });
    }
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// Obtiene una categoría por Id
// Recibe por parámetro Id del producto
export const getProdByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (product) res.json(product);
    else
      res.status(404).json({
        msg: 'El producto no ha sido encontrado',
      });
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// Elimina un producto por Id
// Recibe por parámetro Id del producto
export const deleteProdByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await deleteProductById(id);

    if (result)
      res.json({
        msg: `El producto con id "${id}" ha sido eliminado`,
      });
    else
      res.json({
        msg: 'El producto con el id seleccionado no existe',
      });
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// Modifica un producto
// Recibe: id por query params, y producto modificado por body
export const updateProdController = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    // Mando a la función toda la data válida que llega desde el middleware
    const prod = await updateProduct(id, req.productData);
    res.json(prod);
  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};
