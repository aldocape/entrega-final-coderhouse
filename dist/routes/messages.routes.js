"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controllers_1 = require("../controllers/messages.controllers");
// Importo middleware para validación de datos para creación de mensajes
const inputValidation_1 = require("../middlewares/inputValidation");
// Importo middleware para validación de usuario logueado
const auth_jwt_1 = require("../utils/auth_jwt");
const router = (0, express_1.Router)();
// Devuelvo todos los mensajes entre un usuario y el chatBot
// Endpoint: /api/mensajes/:username Método: GET
router.get('/:username', auth_jwt_1.checkAuth, messages_controllers_1.getAllController);
// Recibe y agrega un mensaje, y lo devuelve con su id asignado
// Endpoint: /api/mensajes/ Método: POST
router.post('/', auth_jwt_1.checkAuth, inputValidation_1.inputMsgValidator, messages_controllers_1.saveMsgController);
exports.default = router;
