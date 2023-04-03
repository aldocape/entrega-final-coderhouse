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
exports.leerId = exports.compare = exports.matchPassword = exports.encrypt = exports.getMany = exports.findOne = exports.update = exports.deleteAll = exports.deleteById = exports.getWithPopulate = exports.getById = exports.getAll = exports.save = void 0;
const config_1 = __importDefault(require("../config"));
const factory_1 = require("./factory");
let DAO;
const daoArgs = config_1.default.ARGS.dao;
if (daoArgs === 'mongo')
    DAO = factory_1.DaoFactory.create(daoArgs, true);
else
    DAO = factory_1.DaoFactory.create(daoArgs, false);
let productsHandler;
let cartsHandler;
let usersHandler;
let messagesHandler;
let ordersHandler;
if (DAO) {
    productsHandler = DAO.productHandler();
    cartsHandler = DAO.cartsHandler();
    messagesHandler = DAO.messagesHandler();
    ordersHandler = DAO.ordersHandler();
}
// Si me llega por línea de comandos una dao distinta a mongo, le paso el parámetro false
// para indicarle que use de la BD de mongo la colección usuarios, pero todo el resto
// que lo haga con la dao seleccionada
if (daoArgs !== 'mongo') {
    DAO = factory_1.DaoFactory.create('mongo', false);
}
// constantes que utilizo para probar que no se vuelvan a crear nuevas instancias del DAO
const DAO2 = factory_1.DaoFactory.create(daoArgs, false);
const DAO3 = factory_1.DaoFactory.create(daoArgs, false);
usersHandler = DAO.usersHandler();
// En cada operación con la BD, trabajo individualmente con cada uno de los objetos instanciados
function save(collection, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'product':
                return yield productsHandler.save(obj);
            case 'cart':
                return yield cartsHandler.save(obj);
            case 'user':
                return yield usersHandler.save(obj);
            case 'message':
                return yield messagesHandler.save(obj);
            case 'order':
                return yield ordersHandler.save(obj);
            default:
                break;
        }
    });
}
exports.save = save;
function getAll(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'product':
                return yield productsHandler.getAll();
            case 'cart':
                return yield cartsHandler.getAll();
            case 'user':
                return yield usersHandler.getAll();
            case 'message':
                return yield messagesHandler.getAll();
            case 'order':
                return yield ordersHandler.getAll();
            default:
                break;
        }
    });
}
exports.getAll = getAll;
function getById(collection, id) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'product':
                return yield productsHandler.getById(id);
            case 'cart':
                return yield cartsHandler.getById(id);
            case 'user':
                return yield usersHandler.getById(id);
            case 'message':
                return yield messagesHandler.getById(id);
            case 'order':
                return yield ordersHandler.getById(id);
            default:
                break;
        }
    });
}
exports.getById = getById;
function getWithPopulate(collection, id) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'cart':
                return yield cartsHandler.getWithPopulate(id);
            case 'order':
                return yield ordersHandler.getWithPopulate(id);
            default:
                break;
        }
    });
}
exports.getWithPopulate = getWithPopulate;
function deleteById(collection, id) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'product':
                return yield productsHandler.deleteById(id);
            case 'cart':
                return yield cartsHandler.deleteById(id);
            case 'user':
                return yield usersHandler.deleteById(id);
            case 'message':
                return yield messagesHandler.deleteById(id);
            default:
                break;
        }
    });
}
exports.deleteById = deleteById;
function deleteAll(collection) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'product':
                return yield productsHandler.deleteAll();
            case 'cart':
                return yield cartsHandler.deleteAll();
            case 'user':
                return yield usersHandler.deleteAll();
            case 'message':
                return yield messagesHandler.deleteAll();
            default:
                break;
        }
    });
}
exports.deleteAll = deleteAll;
function update(collection, id, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'product':
                return yield productsHandler.update(id, obj);
            case 'cart':
                return yield cartsHandler.update(id, obj);
            case 'user':
                return yield usersHandler.update(id, obj);
            case 'message':
                return yield messagesHandler.update(id, obj);
            case 'order':
                return yield ordersHandler.update(id, obj);
            default:
                break;
        }
    });
}
exports.update = update;
function findOne(collection, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (collection === 'user')
            return yield usersHandler.findOne(query);
    });
}
exports.findOne = findOne;
function getMany(collection, query) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'product':
                return yield productsHandler.getMany(query);
            case 'cart':
                return yield cartsHandler.getMany(query);
            case 'user':
                return yield usersHandler.getMany(query);
            case 'message':
                return yield messagesHandler.getMany(query);
            case 'order':
                return yield ordersHandler.getMany(query);
            default:
                break;
        }
    });
}
exports.getMany = getMany;
function encrypt(collection, password) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'user':
                return yield usersHandler.encryptPswd(password);
            default:
                break;
        }
    });
}
exports.encrypt = encrypt;
function matchPassword(collection, password1, password2) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (collection) {
            case 'user':
                return yield usersHandler.matchPassword(password1, password2);
            default:
                break;
        }
    });
}
exports.matchPassword = matchPassword;
function compare(collection, object1, object2) {
    switch (collection) {
        case 'product':
            return productsHandler.compare(object1, object2);
        default:
            break;
    }
}
exports.compare = compare;
function leerId(collection, elem) {
    switch (collection) {
        case 'order':
            return ordersHandler.leerId(elem);
        default:
            break;
    }
}
exports.leerId = leerId;
