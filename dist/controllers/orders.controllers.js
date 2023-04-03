"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOrderController = exports.getOrderController = exports.saveOrderController = void 0;
const orders_services_1 = require("../services/orders.services");
// Importo getCartById para asegurarme que existe el carrito que llegue por parámetro,
// y updateCart para dejar el carrito vacío cuando se genere la orden de compra
const carts_services_1 = require("../services/carts.services");
const express_1 = require("express");
// Importo el enum 'Estado' para tener todos los posibles estados de la orden
const interfaces_1 = require("../interfaces");
const config_1 = __importDefault(require("../config"));
// Importo EmailService para poder enviar mail al momento de generar la orden de compra
const email_services_1 = require("../services/email.services");
// Importo getUserById para asegurarme de que el usuario que genera la orden es un usuario válido
const users_services_1 = require("../services/users.services");
const sendMail = (orden, direccion_entrega, username) => __awaiter(void 0, void 0, void 0, function* () {
    // Orden creada, armo cuerpo de mensaje y envío el mail
    const destination = config_1.default.GMAIL_EMAIL || 'aldocape@gmail.com';
    const subject = 'Nueva Orden de compra';
    const ordenId = (0, orders_services_1.leerIdOrden)(orden);
    let content = `
      <p>Id de la orden: ${ordenId}<br />
      Dirección de entrega: ${direccion_entrega}<br /></p>
      <p>Productos:<br /><ul>`;
    for (let i = 0; i < orden.productos.length; i++) {
        content += `<li>Nombre:${orden.productos[i].prodId.nombre} - Cantidad: ${orden.productos[i].cantidad} - Precio: $${orden.productos[i].precio}</li>`;
    }
    content += `</ul></p><p>Generada el día y hora: ${orden.createdAt}<br />
      E-mail del usuario que generó la orden: ${username}<br />
      Estado de la orden: ${orden.estado}</p>`;
    const email = yield email_services_1.EmailService.sendEmail(destination, subject, content);
    return email;
});
const router = (0, express_1.Router)();
// Función para crear una nueva orden de compra
const saveOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, userId } = req.body;
    try {
        const cart = yield (0, carts_services_1.getCartById)(cartId);
        if (cart) {
            const orden = {
                userId,
                estado: interfaces_1.Estado.Generada,
            };
            let orderItems = [];
            let idProd;
            // Este mapeo lo hago para poder incorporar el precio actual, al array de productos y cantidades
            for (let i = 0; i < cart.productos.length; i++) {
                idProd = (0, orders_services_1.leerIdOrden)(cart.productos[i].prodId);
                orderItems.push({
                    prodId: idProd,
                    cantidad: cart.productos[i].cantidad,
                    // Debido a que 'precio' es en realidad un 'populate' de prodId, el precio en realidad
                    // está llegando desde la BD de productos (precio actual) y no de la BD de carrito
                    precio: cart.productos[i].prodId.precio,
                });
            }
            const carrito = {
                productos: [],
                direccion_entrega: cart.direccion_entrega,
            };
            // Actualizo el carrito en la BD quitando los productos
            const updatedCart = yield (0, carts_services_1.updateCart)(cartId, carrito);
            // Obtengo datos del usuario para pasar el mail del usuario por parámetro a sendMail
            const user = yield (0, users_services_1.getUserById)(userId);
            orden.productos = orderItems;
            const order = yield (0, orders_services_1.newOrder)(orden);
            if (order) {
                // Si la orden se generó correctamente, obtengo datos completos de sus productos
                // y armo envío de mail pasando por parámetro la orden, la dirección de entrega (que figura en el carrito)
                // y el username (mail) del usuario que generó la orden
                const ordenId = (0, orders_services_1.leerIdOrden)(order);
                const orderDetails = yield (0, orders_services_1.getOrderById)(ordenId);
                sendMail(orderDetails, carrito.direccion_entrega, user.username);
            }
            res.status(201).json({
                status: 'ok',
                msg: 'Orden de compra generada exitosamente! Muchas gracias por su compra!',
                order,
                updatedCart,
            });
        }
        else {
            res.status(400).json({
                status: 'error',
                msg: 'El carrito seleccionado no existe',
            });
        }
    }
    catch (err) {
        res.status(500).json({
            msg: err.message,
        });
    }
});
exports.saveOrderController = saveOrderController;
// Función para obtener todas las órdenes de un usuario
// Recibe parámetro userId
const getOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, orders_services_1.getOrders)({ userId: req.user._id });
        if (orders)
            res.json({
                orders,
            });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
exports.getOrderController = getOrderController;
// Función para marcar una orden como completada
// Recibe como parámetro orderId
const completeOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        if (orderId) {
            const order = {
                estado: interfaces_1.Estado.Finalizada,
            };
            const modifiedOrder = yield (0, orders_services_1.updateOrder)(orderId, order);
            res.json({
                modifiedOrder,
            });
        }
        else {
            res.status(400).json({
                status: 'error',
                msg: 'Falta el argumento ordenId, o la orden no existe en la base de datos',
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});
exports.completeOrderController = completeOrderController;
