import { Router } from 'express';

import {
  completeOrderController,
  getOrderController,
  saveOrderController,
} from '../controllers/orders.controllers';

// Importo middleware de verificación de usuario logueado
import { checkAuth } from '../utils/auth_jwt';

const router = Router();

// Endpoint que crea una nueva orden. Recibe cartId y userId por body
// Endpoint: /api/ordenes Método: POST
router.post('/', checkAuth, saveOrderController);

// Endpoint para listar todas las órdenes de un usuario.
// No recibe parámetros. Los datos del usuario los obtiene del middleware de autenticación
// Endpoint: /api/ordenes Método: GET
router.get('/', checkAuth, getOrderController);

// Endpoint para marcar una orden como completada. Recibe orderId como parámetro por body
// Endpoint: /api/ordenes/completar Método: POST
router.post('/completar', checkAuth, completeOrderController);

export default router;
