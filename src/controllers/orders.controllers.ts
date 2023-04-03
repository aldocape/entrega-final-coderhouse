import {
  newOrder,
  getOrders,
  updateOrder,
  getOrderById,
  leerIdOrden,
} from '../services/orders.services';

// Importo getCartById para asegurarme que existe el carrito que llegue por parámetro,
// y updateCart para dejar el carrito vacío cuando se genere la orden de compra
import { getCartById, updateCart } from '../services/carts.services';

import { Router, Response } from 'express';
// Importo el enum 'Estado' para tener todos los posibles estados de la orden
import { Estado } from '../interfaces';

import config from '../config';

// Importo EmailService para poder enviar mail al momento de generar la orden de compra
import { EmailService } from '../services/email.services';
// Importo getUserById para asegurarme de que el usuario que genera la orden es un usuario válido
import { getUserById } from '../services/users.services';

const sendMail = async (
  orden: any,
  direccion_entrega: string,
  username: string
) => {
  // Orden creada, armo cuerpo de mensaje y envío el mail
  const destination = config.GMAIL_EMAIL || 'aldocape@gmail.com';
  const subject = 'Nueva Orden de compra';

  const ordenId = leerIdOrden(orden);
  let content = `
      <p>Id de la orden: ${ordenId}<br />
      Dirección de entrega: ${direccion_entrega}<br /></p>
      <p>Productos:<br /><ul>`;
  for (let i = 0; i < orden.productos.length; i++) {
    content += `<li>Nombre:${orden.productos[i].prodId.nombre} - Cantidad: ${orden.productos[i].cantidad} - Precio: ${orden.productos[i].precio}</li>`;
  }

  content += `</ul></p><p>Generada el día y hora: ${orden.createdAt}<br />
      E-mail del usuario que generó la orden: ${username}<br />
      Estado de la orden: ${orden.estado}</p>`;

  const email = await EmailService.sendEmail(destination, subject, content);
  return email;
};

const router = Router();

// Función para crear una nueva orden de compra
export const saveOrderController = async (req: any, res: Response) => {
  const { cartId, userId } = req.body;

  try {
    const cart = await getCartById(cartId);
    if (cart) {
      const orden: any = {
        userId,
        estado: Estado.Generada,
      };

      let orderItems = [];
      let idProd;
      // Este mapeo lo hago para poder incorporar el precio actual, al array de productos y cantidades
      for (let i = 0; i < cart.productos.length; i++) {
        idProd = leerIdOrden(cart.productos[i].prodId);
        orderItems.push({
          prodId: idProd,
          cantidad: cart.productos[i].cantidad,
          // Debido a que 'precio' es en realidad un 'populate' de prodId, el precio en realidad
          // está llegando desde la BD de productos (precio actual) y no de la BD de carrito
          precio: cart.productos[i].prodId.precio,
        });
      }

      const carrito: any = {
        productos: [],
        direccion_entrega: cart.direccion_entrega,
      };

      // Actualizo el carrito en la BD quitando los productos
      const updatedCart = await updateCart(cartId, carrito);

      // Obtengo datos del usuario para pasar el mail del usuario por parámetro a sendMail
      const user = await getUserById(userId);

      orden.productos = orderItems;
      const order = await newOrder(orden);

      if (order) {
        // Si la orden se generó correctamente, obtengo datos completos de sus productos
        // y armo envío de mail pasando por parámetro la orden, la dirección de entrega (que figura en el carrito)
        // y el username (mail) del usuario que generó la orden

        const ordenId = leerIdOrden(order);

        const orderDetails = await getOrderById(ordenId);

        sendMail(orderDetails, carrito.direccion_entrega, user.username);
      }

      res.status(201).json({
        status: 'ok',
        msg: 'Orden de compra generada exitosamente! Muchas gracias por su compra!',
        order,
        updatedCart,
      });
    } else {
      res.status(400).json({
        status: 'error',
        msg: 'El carrito seleccionado no existe',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// Función para obtener todas las órdenes de un usuario
// Recibe parámetro userId
export const getOrderController = async (req: any, res: Response) => {
  try {
    const orders = await getOrders({ userId: req.user._id });
    if (orders)
      res.json({
        orders,
      });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Función para marcar una orden como completada
// Recibe como parámetro orderId
export const completeOrderController = async (req: any, res: Response) => {
  try {
    const { orderId } = req.body;
    if (orderId) {
      const order: any = {
        estado: Estado.Finalizada,
      };
      const modifiedOrder = await updateOrder(orderId, order);
      res.json({
        modifiedOrder,
      });
    } else {
      res.status(400).json({
        status: 'error',
        msg: 'Falta el argumento ordenId, o la orden no existe en la base de datos',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
