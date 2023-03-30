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
exports.getAllMessages = exports.saveMessage = void 0;
const daos_1 = require("../daos/daos");
function saveMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = yield (0, daos_1.save)('message', message);
        return msg;
    });
}
exports.saveMessage = saveMessage;
function getAllMessages(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = yield (0, daos_1.getMany)('message', query);
        return messages;
    });
}
exports.getAllMessages = getAllMessages;
