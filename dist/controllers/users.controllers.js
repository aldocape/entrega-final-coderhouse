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
exports.logout = exports.getSession = exports.loginController = exports.signUpController = void 0;
const users_services_1 = require("../services/users.services");
const carts_services_1 = require("../services/carts.services");
const auth_jwt_1 = require("../utils/auth_jwt");
const logger_1 = __importDefault(require("../middlewares/logger"));
const config_1 = __importDefault(require("../config"));
const email_services_1 = require("../services/email.services");
const sendMail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Usuario creado, armo cuerpo de mensaje y envío el mail
    const destination = config_1.default.GMAIL_EMAIL || 'aldocape@gmail.com';
    const subject = 'Nuevo Registro de Usuario';
    const content = `
      <p>Username: ${user.username}<br />
      Nombre y apellido: ${user.nombre}<br />
      Dirección: ${user.direccion}<br />
      Edad: ${user.edad}<br />
      Teléfono: ${user.telefono}<br />
      Administrador: ${user.admin ? 'Si' : 'No'}
      </p>`;
    const email = yield email_services_1.EmailService.sendEmail(destination, subject, content);
    return email;
});
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, users_services_1.findOneUser)({ username: req.user.username });
    if (user)
        return res
            .status(400)
            .json({ status: 'error', msg: 'Error: El E-Mail ya existe' });
    // Creamos un carrito vacío para el nuevo usuario
    const newCart = yield (0, carts_services_1.saveCart)({
        productos: [],
        direccion_entrega: req.user.direccion,
    });
    req.user.carrito = newCart;
    // Guardamos el usuario en la BD
    const newUser = yield (0, users_services_1.saveUser)(req.user);
    // Enviamos mail con los datos del nuevo usuario registrado y creamos un token de acceso
    sendMail(newUser);
    const token = (0, auth_jwt_1.generateAuthToken)(newUser);
    logger_1.default.info('Signup ha sido exitoso!');
    // Redirigimos a la home, con el token de acceso
    res.header('authentication', `Bearer ${token}`).json({
        status: 'Signup OK',
        msg: 'El usuario ha sido creado correctamente! Redirigiendo a la home...',
        token,
    });
});
exports.signUpController = signUpController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield (0, users_services_1.findOneUser)({ username });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                error: 'El usuario o la contraseña son incorrectos',
            });
        }
        else {
            // Si el usuario existe, comparo la password que llega con la de la BD, con el método matchPassword
            const match = yield user.matchPassword(password);
            // Si la contraseña es igual a la que está registrada en la clase (desencriptada), devuelve true
            if (match) {
                const token = (0, auth_jwt_1.generateAuthToken)(user);
                res.header('authorization', `Bearer ${token}`).json({
                    token,
                    user,
                    status: 'Usuario logueado',
                });
            }
            else {
                res.status(401).json({
                    status: 'error',
                    error: 'El usuario o la contraseña son incorrectos',
                });
            }
        }
    }
    catch (err) {
        logger_1.default.error(err);
    }
});
exports.loginController = loginController;
// Esta función la utilizo para obtener datos del usuario a partir de su token,
// ya que antes de llegar aquí pasa por el middleware de autenticación de token
const getSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        status: 'ok',
        user: req.user,
    });
});
exports.getSession = getSession;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const user = yield (0, users_services_1.getUserById)(user_id);
    res.render('logout', { nombre: user.nombre });
});
exports.logout = logout;
