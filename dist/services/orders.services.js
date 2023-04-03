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
exports.leerIdOrden = exports.updateOrder = exports.getOrderById = exports.getOrders = exports.newOrder = void 0;
const daos_1 = require("../daos/daos");
function newOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        const newOrder = yield (0, daos_1.save)('order', order);
        return newOrder;
    });
}
exports.newOrder = newOrder;
function getOrders(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const orders = yield (0, daos_1.getMany)('order', query);
        return orders;
    });
}
exports.getOrders = getOrders;
function getOrderById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = yield (0, daos_1.getWithPopulate)('order', id);
        return order;
    });
}
exports.getOrderById = getOrderById;
function updateOrder(id, order) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderModified = yield (0, daos_1.update)('order', id, order);
        return orderModified;
    });
}
exports.updateOrder = updateOrder;
function leerIdOrden(order) {
    const id = (0, daos_1.leerId)('order', order);
    return id;
}
exports.leerIdOrden = leerIdOrden;
