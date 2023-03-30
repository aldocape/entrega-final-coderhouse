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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMsgController = exports.getAllController = void 0;
const messages_services_1 = require("../services/messages.services");
// Importo función para agregar fecha y hora a los mensajes
const tools_1 = require("../utils/tools");
// Obtiene todos los mensajes
const getAllController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const messages = yield (0, messages_services_1.getAllMessages)({ username });
        if (messages) {
            res.json(messages);
        }
        else {
            res.status(400).json({
                msg: 'Hubo un error al obtener los mensajes',
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});
exports.getAllController = getAllController;
// Guarda un mensaje nuevo
const saveMsgController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, mensaje } = req.msgData;
        const msg = (0, tools_1.formatMessage)(usuario, mensaje);
        const newMsg = yield (0, messages_services_1.saveMessage)(msg);
        if (newMsg) {
            res.status(201).json({
                status: 'ok',
                newMsg,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            status: 'error',
            msg: 'Hubo un error al publicar el mensaje',
        });
    }
});
exports.saveMsgController = saveMsgController;
