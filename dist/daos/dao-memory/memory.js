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
const logger_1 = __importDefault(require("../../middlewares/logger"));
const uuid_1 = require("uuid");
const products_dto_1 = __importDefault(require("../../dto/products.dto"));
const messages_dto_1 = __importDefault(require("../../dto/messages.dto"));
const products = [
    {
        id: 'cc31e62d-d874-4278-94c1-aefc46989a0a',
        nombre: 'Heladera inverter no frost Samsung RT32K5070',
        descripcion: 'Tipo de deshielo: no frost. Capacidad de 321 litros. Con freezer superior. Eficiencia energética A+.',
        categoria: 'Electrodomesticos',
        foto: 'https://http2.mlstatic.com/D_NQ_NP_870654-MLA41133069889_032020-O.webp',
        codigo: '935984321',
        precio: 214999,
        stock: 50,
    },
    {
        id: 'a8d94e59-8b02-4e39-b382-f6a75343326d',
        nombre: 'Tablet Philco',
        descripcion: 'Tp10a332 10.1 Ips 32gb 2gb Android 11 Con Funda',
        categoria: 'Electrodomesticos',
        foto: 'https://http2.mlstatic.com/D_NQ_NP_886369-MLA52088853536_102022-O.webp',
        codigo: '498261984',
        precio: 30799,
        stock: 10,
    },
];
const carts = [
    {
        id: '6421fd48c1e8aa6ceb8c50ac',
        productos: [
            {
                prodId: 'a8d94e59-8b02-4e39-b382-f6a75343326d',
                nombre: 'Tablet Philco',
                cantidad: 3,
            },
        ],
        direccion_entrega: 'San Martín 2413',
    },
];
const messages = [];
const orders = [];
class DaoMemory {
    constructor(collection) {
        this.collection = collection;
        switch (collection) {
            case 'product':
                this.recurso = products;
                break;
            case 'cart':
                this.recurso = carts;
                break;
            case 'message':
                this.recurso = messages;
                break;
            case 'order':
                this.recurso = orders;
                break;
            default:
                break;
        }
    }
    static getInstance(collection) {
        DaoMemory.instance = new DaoMemory(collection);
        logger_1.default.info(`Instancia de clase: ${collection} iniciada`);
        return DaoMemory.instance;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = this.recurso;
                if (items.length)
                    switch (this.collection) {
                        case 'product':
                            return items.map((producto) => new products_dto_1.default(producto, false));
                        case 'message':
                            return items.map((message) => new messages_dto_1.default(message, false));
                        default:
                            break;
                    }
                return items;
            }
            catch (err) {
                logger_1.default.error(`ERROR => ${err}`);
            }
        });
    }
    save(document) {
        return __awaiter(this, void 0, void 0, function* () {
            document.id = (0, uuid_1.v4)();
            this.recurso.push(document);
            return document;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = this.recurso.find((e) => id === e.id);
                if (item)
                    return item;
                return 0;
            }
            catch (err) {
                logger_1.default.error(`ERROR => ${err}`);
            }
        });
    }
    getMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = Object.keys(query);
                const items = [];
                this.recurso.forEach((element) => {
                    if (element[keys[0]] === query[keys[0]]) {
                        items.push(element);
                    }
                });
                if (items)
                    switch (this.collection) {
                        case 'product':
                            return items.map((producto) => new products_dto_1.default(producto, false));
                        case 'message':
                            return items.map((message) => new messages_dto_1.default(message, false));
                        default:
                            break;
                    }
            }
            catch (err) {
                logger_1.default.error(`ERROR => ${err}`);
            }
        });
    }
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const index = this.recurso.findIndex((elem) => id === elem.id);
                if (index < 0)
                    return 0;
                // Si el item buscado existe, lo reemplazo con el nuevo que viene por parámetro
                this.recurso.splice(index, 1, item);
                // Devuelvo el elemento modificado
                return item;
            }
            catch (err) {
                // Devuelvo error a la api en caso de que no haya podido leer el archivo
                logger_1.default.error(`ERROR => ${err}`);
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const index = this.recurso.findIndex((elem) => id === elem.id);
                if (index < 0)
                    return 0;
                return this.recurso.splice(index, 1);
            }
            catch (err) {
                // Devuelvo error a la api en caso de que no haya podido leer el archivo
                logger_1.default.error(`ERROR => ${err}`);
            }
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = this.recurso.splice(0, this.recurso.length);
                return deleted;
            }
            catch (err) {
                // Devuelvo error a la api en caso de que no haya podido leer el archivo
                logger_1.default.error(`ERROR => ${err}`);
            }
        });
    }
}
exports.default = DaoMemory;
