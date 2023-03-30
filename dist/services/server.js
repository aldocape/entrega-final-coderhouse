"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myHTTPServer = exports.numCPUs = exports.MODE = exports.PORT = void 0;
const express_1 = __importDefault(require("express"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const index_1 = __importDefault(require("../routes/index"));
// Importo ProductsDTO para convertir un producto una vez creado, y mandarlo por websockets al front
const products_dto_1 = __importDefault(require("../dto/products.dto"));
// Importo librería swagger-ui-express y yamljs para la documentación del proyecto
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const http = require('http');
// Importo librería socket.io
const io = require('socket.io');
const app = (0, express_1.default)();
// Disponibilizo carpeta 'public' para acceder a los estilos css
const publicPath = path_1.default.resolve(__dirname, '../../public');
app.use(express_1.default.static(publicPath));
app.use(express_1.default.json()); //permite json
app.use(express_1.default.urlencoded({ extended: true })); //permite form data
// Le indico que voy a usar el motor de plantillas 'ejs'
app.set('view engine', 'ejs');
app.use('/', index_1.default);
// Indico el path del archivo yml de configuración de swagger
const swaggerPath = path_1.default.resolve(process.cwd(), './swagger.yml');
const swaggerDoc = yamljs_1.default.load(swaggerPath);
// Indico el path en donde se va a mostrar la documentación con swagger
// y le paso los middlewares correspondientes
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc));
let puerto;
// Verifico si estoy en desarrollo o en producción (en este último caso, el puerto se genera desde Railway, Heroku, etc)
if (config_1.default.NODE_ENV === 'development') {
    puerto = config_1.default.ARGS.port; // default: '8080'
}
else {
    puerto = process.env.PORT;
}
exports.PORT = puerto;
exports.MODE = config_1.default.ARGS.mode; // default: 'fork'
//Obtengo el numero de núcleos disponibles en mi PC
exports.numCPUs = os_1.default.cpus().length;
// Configuración de server http para websocket
exports.myHTTPServer = http.Server(app);
const myWSServer = io(exports.myHTTPServer);
// Escucho evento 'connection' con socket.io
myWSServer.on('connection', (socket) => {
    // Escucho evento newBot que llega desde el login del front
    socket.on('newBot', (user) => {
        // Emito un evento para el usuario para saludarlo con su nombre
        socket.emit('createBot', user.nombre);
    });
    // Escucho cuando se emite evento 'newProduct' desde el form de carga de productos
    socket.on('newProduct', (product) => {
        // Convierto el objeto usando DTO para que se muestre bien en el front
        const productModified = new products_dto_1.default(product, config_1.default.ARGS.dao === 'mongo');
        // Emito un evento de nuevo producto para todos los sockets conectados
        myWSServer.emit('createProduct', productModified);
    });
    // Escucho cuando se emite evento de nuevo mensaje desde el chatBot
    socket.on('newMessage', (newMsg) => {
        // Emito un evento para el usuario, contestando de acuerdo al mensaje recibido
        let response;
        switch (newMsg.message) {
            case 'stock':
                if (newMsg.object.length) {
                    response = '<p>Stock de todos los productos:<br />';
                    newMsg.object.forEach((product) => {
                        response += `- Nombre: ${product.nombre}, stock: ${product.stock}<br />`;
                    });
                    response += '</p>';
                }
                else {
                    response = '<p>No hay productos cargados</p>';
                }
                break;
            case 'orden':
                response =
                    '<p>Tu orden de compra está compuesta de muchos productos buenos y baratos!</p>';
                break;
            case 'carrito':
                if (newMsg.object.length) {
                    response =
                        '<p>Tu carrito tiene actualmente los siguientes productos:<br />';
                    newMsg.object.forEach((product) => {
                        response += `- Nombre: ${product.nombre}, cantidad: ${product.cantidad}<br />`;
                    });
                    response += '</p>';
                }
                else {
                    response = '<p>Tu carrito aún no tiene productos cargados</p>';
                }
                break;
            default:
                response =
                    '<p>No he podido comprender tu mensaje. Por favor ingresa una de las siguientes opciones:<br /><br />- Stock: Para conocer el stock de todos los productos.<br /><br />-Carrito: Para conocer el estado actual de tu carrito.</p>';
                break;
        }
        socket.emit('newResponse', response);
    });
});
