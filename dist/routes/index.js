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
const products_services_1 = require("../services/products.services");
const products_routes_1 = __importDefault(require("./products.routes"));
const carts_routes_1 = __importDefault(require("./carts.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const messages_routes_1 = __importDefault(require("./messages.routes"));
const orders_routes_1 = __importDefault(require("./orders.routes"));
const info_routes_1 = __importDefault(require("./info.routes"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Obtengo todos los productos para mostrarlos en la 'home'
    const response = yield (0, products_services_1.getAllProducts)();
    const productos = response;
    res.render('index', { productos });
}));
// En el caso de usersRouter uso el path '/' porque login, logout, signup, etc
// van al path directamente sin pasar por /api/usuarios, pero son funciones implementadas en el controller de usuarios
router.use('/', users_routes_1.default);
// Endpoint que muestra datos del servidor donde está el sitio web
router.use('/info', info_routes_1.default);
router.use('/api/productos', products_routes_1.default);
router.use('/api/mensajes', messages_routes_1.default);
router.use('/api/carrito', carts_routes_1.default);
router.use('/api/ordenes', orders_routes_1.default);
exports.default = router;
