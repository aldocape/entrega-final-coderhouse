import {
  save,
  getAll,
  getById,
  deleteById,
  deleteAll,
  update,
  getMany,
  compare,
} from '../daos/daos';
import { Producto } from '../interfaces';

export async function saveProduct(product: Producto) {
  const prod = await save('product', product);
  return prod;
}

export async function getAllProducts() {
  const products = await getAll('product');
  return products;
}

export async function getProductById(id: string) {
  const product = await getById('product', id);
  return product;
}

export async function getManyProducts(query: any) {
  const products = await getMany('product', query);
  return products;
}

export async function updateProduct(id: string, product: Producto) {
  const productModified = await update('product', id, product);
  return productModified;
}

export async function deleteProductById(id: string) {
  const product = await deleteById('product', id);
  return product;
}

export async function deleteAllProducts() {
  const product = await deleteAll('product');
  return product;
}

export function compareProducts(obj1: any, obj2: any) {
  return compare('product', obj1, obj2);
}
