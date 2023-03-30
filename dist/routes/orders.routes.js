"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controllers_1 = require("../controllers/orders.controllers");
// Importo middleware de verificación de usuario logueado
const auth_jwt_1 = require("../utils/auth_jwt");
const router = (0, express_1.Router)();
// Endpoint que crea una nueva orden. Recibe cartId y userId por body
// Endpoint: /api/ordenes Método: POST
router.post('/', auth_jwt_1.checkAuth, orders_controllers_1.saveOrderController);
// Endpoint para listar todas las órdenes de un usuario.
// No recibe parámetros. Los datos del usuario los obtiene del middleware de autenticación
// Endpoint: /api/ordenes Método: GET
router.get('/', auth_jwt_1.checkAuth, orders_controllers_1.getOrderController);
// Endpoint para marcar una orden como completada. Recibe orderId como parámetro por body
// Endpoint: /api/ordenes/completar Método: POST
router.post('/completar', auth_jwt_1.checkAuth, orders_controllers_1.completeOrderController);
exports.default = router;
