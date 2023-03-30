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
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const inputValidation_1 = require("../middlewares/inputValidation");
const users_services_1 = require("../services/users.services");
// Importo middlewares de autenticación de usuario autorizado
const auth_1 = __importDefault(require("../middlewares/auth")); // Verifica si el usuario es admin
const auth_jwt_1 = require("../utils/auth_jwt"); // Verifica que exista un usuario logueado
const router = (0, express_1.Router)();
// Renderizo vista Logout del usuario
// Endpoint: /logout Método: GET
router.get('/logout/:user_id', users_controllers_1.logout);
// Renderizo vista Registro de nuevo usuario
// Endpoint: /register Método: GET
router.get('/register', (req, res) => {
    res.render('register', { msg: '' });
});
// El router de obtener todos los usuarios lo implemento de esta manera
// porque no me permite importar el controlador, me da un error de Typescript
// Sólo puede acceder un usuario administrador
router.get('/api/usuarios', auth_jwt_1.checkAuth, auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, users_services_1.getAllUsers)();
        if (users) {
            res.json(users);
        }
        else {
            res.status(400).json({
                msg: 'Hubo un error al obtener los usuarios',
            });
        }
    }
    catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
}));
// Creación de nuevo usuario
// Recibe por body todos los campos del formulario de nuevo usuario, y los valida con el middleware inputUsrValidator
router.post('/signup', inputValidation_1.inputUsrValidator, users_controllers_1.signUpController);
// Login de usuario
router.post('/login', users_controllers_1.loginController);
// Obtener datos del usuario logueado
router.get('/usuarios/session', auth_jwt_1.checkAuth, users_controllers_1.getSession);
exports.default = router;
