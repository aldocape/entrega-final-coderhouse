import { save, getMany, update, getById, leerId } from '../daos/daos';
import { Orden } from '../interfaces';

export async function newOrder(order: Orden) {
  const newOrder = await save('order', order);
  return newOrder;
}

export async function getOrders(query: any) {
  const orders = await getMany('order', query);
  return orders;
}

export async function getOrderById(id: string) {
  const order = await getById('order', id);
  return order;
}

export async function updateOrder(id: string, order: Orden) {
  const orderModified = await update('order', id, order);
  return orderModified;
}

export function leerIdOrden(order: Orden) {
  const id = leerId('order', order);
  return id;
}
