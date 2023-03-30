"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessagesDTO {
    constructor(data, esMongo) {
        if (esMongo)
            this.id = data._id;
        else
            this.id = data.id;
        this.time = data.time;
        this.message = data.message;
        this.user = {
            username: data.user.username,
            nombre: data.user.nombre,
        };
    }
}
exports.default = MessagesDTO;
