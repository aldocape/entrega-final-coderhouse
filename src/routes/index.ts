import { Router, Request, Response } from 'express';

import { getAllProducts } from '../services/products.services';
import productsRouter from './products.routes';
import cartsRouter from './carts.routes';
import usersRouter from './users.routes';
import messagesRouter from './messages.routes';
import ordersRouter from './orders.routes';
import infoRouter from './info.routes';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  // Obtengo todos los productos para mostrarlos en la 'home'
  const response: any = await getAllProducts();
  const productos = response;
  res.render('index', { productos });
});

// En el caso de usersRouter uso el path '/' porque login, logout, signup, etc
// van al path directamente sin pasar por /api/usuarios, pero son funciones implementadas en el controller de usuarios
router.use('/', usersRouter);
// Endpoint que muestra datos del servidor donde está el sitio web
router.use('/info', infoRouter);
router.use('/api/productos', productsRouter);
router.use('/api/mensajes', messagesRouter);
router.use('/api/carrito', cartsRouter);
router.use('/api/ordenes', ordersRouter);

export default router;
