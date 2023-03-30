"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
// Middleware que verifica si el usuario logueado es o no un admin
const authenticate = (req, res, next) => {
    if (req.user.admin)
        next();
    else {
        logger_1.default.error(`ruta '${req.baseUrl}' método '${req.method}' no autorizada`);
        res.status(401).json({
            status: 'error',
            msg: 'Usuario no autorizado para la operación que intenta realizar',
        });
    }
};
exports.default = authenticate;
