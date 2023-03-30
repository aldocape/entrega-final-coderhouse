"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesCollection = void 0;
const mongoose_1 = require("mongoose");
exports.messagesCollection = 'message';
const MessageSchema = new mongoose_1.Schema({
    time: { type: String, require: true, max: 100 },
    message: { type: String, require: true, max: 600 },
    user: {
        username: { type: String, require: true, max: 50 },
        nombre: { type: String, require: true, max: 80 },
        direccion: { type: String, require: true, max: 100 },
        telefono: { type: String, max: 50 },
    },
}, { timestamps: false, versionKey: false });
exports.default = (0, mongoose_1.model)(exports.messagesCollection, MessageSchema);
