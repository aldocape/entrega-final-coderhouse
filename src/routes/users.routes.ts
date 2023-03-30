import { Router, Request, Response } from 'express';

import {
  loginController,
  signUpController,
  logout,
  getSession,
} from '../controllers/users.controllers';

import { inputUsrValidator } from '../middlewares/inputValidation';
import { getAllUsers } from '../services/users.services';

// Importo middlewares de autenticación de usuario autorizado
import adminAuth from '../middlewares/auth'; // Verifica si el usuario es admin
import { checkAuth } from '../utils/auth_jwt'; // Verifica que exista un usuario logueado

const router = Router();

// Renderizo vista Logout del usuario
// Endpoint: /logout Método: GET
router.get('/logout/:user_id', logout);

// Renderizo vista Registro de nuevo usuario
// Endpoint: /register Método: GET
router.get('/register', (req: Request, res: Response) => {
  res.render('register', { msg: '' });
});

// El router de obtener todos los usuarios lo implemento de esta manera
// porque no me permite importar el controlador, me da un error de Typescript
// Sólo puede acceder un usuario administrador
router.get(
  '/api/usuarios',
  checkAuth,
  adminAuth,
  async (req: Request, res: Response) => {
    try {
      const users = await getAllUsers();

      if (users) {
        res.json(users);
      } else {
        res.status(400).json({
          msg: 'Hubo un error al obtener los usuarios',
        });
      }
    } catch (err: any) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
);

// Creación de nuevo usuario
// Recibe por body todos los campos del formulario de nuevo usuario, y los valida con el middleware inputUsrValidator
router.post('/signup', inputUsrValidator, signUpController);
// Login de usuario
router.post('/login', loginController);
// Obtener datos del usuario logueado
router.get('/usuarios/session', checkAuth, getSession);

export default router;
