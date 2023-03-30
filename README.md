# entrega-final-coderhouse

Proyecto E-Commerce del curso de programación backend

Iniciar app: npm start
Iniciar con nodemon: npm run dev
Build de la aplicación: npm run build

Parámetros línea de comandos (Después del build, con el comando: node dist/index.js):

--dao = mongo (default)
= file
= memory
--port
--mode = fork (default)
= cluster

# Consignas:

-- Se implementaron las rutas necesarias que permiten listar los productos existentes,
ingresar productos nuevos, borrar y modificar sus detalles, así como interactuar
con el carrito de compras.

- Endpoints:

  - /api/productos Método: GET
  - /api/productos Método: POST
  - /api/productos/:productId Método: DELETE
  - /api/productos/:productId Método: PUT

- respectivamente.

- Interacción de productos con el carrito de compras:

- Endpoints de interacción de carritos con productos:
  - /api/carrito/:cartId/productos Método: POST Agrega nuevos productos al carrito
  - /api/carrito/:cartId/productos Método: GET Lista los productos de un carrito
  - /api/carrito/:cartId/productos/:productId Método: DELETE Elimina un producto del carrito

-- Se ha implementado una API RESTful con los verbos get, post, put y delete para
cumplir con todas las acciones necesarias.

-- Se ha brindado al frontend un mecanismo de ingreso autorizado al sistema
basado en JWT (Json Web Token).

-- Los productos ingresados se pueden almacenar en una base de datos MongoDB, o en persistencia filesystem, o con persistencia en memoria. Al igual que los mensajes de chat, los carritos y órdenes de compra. Los usuarios se guardan siempre en MongoDB.

-- Hay una pantalla de registro '/register' a la que se accede desde la home, donde el usuario podrá registrar sus datos personales junto a sus credenciales de acceso (email y password) para
luego poder ingresar a su cuenta. Estas credenciales se guardan en la base de datos MongoDB encriptando la contraseña (usando para ello la librería bcrypt).

--El cliente tendrá una sesión activa de usuario con tiempo de expiración
configurable, para ello tenemos un archivo .env en la raíz del proyecto, con una variable TOKEN_KEEP_ALIVE que setea el tiempo mencionado. Posibles valores: los que están definidos en la libreria de jsonwebtoken.

-- Se implementó un canal de chat basado en websockets (un chatBot que se visualiza una vez que el usuario inicia sesión), el cual permite atender las consultas del cliente. En el caso de no entender el mensaje del usuario, le brinda opciones que pueden darle alguna respuesta.

-- La arquitectura del servidor está basada en capas (MVC).
Paths:

- Modelos: 'src/models
- Vistas: 'views'
- Controladores: 'src/controllers'

Se implementó un sistema que utiliza daos, dto y factory (path: src/daos, src/dto)

El servidor toma configuraciones desde un archivo externo (archivo .env que tiene las variables de entorno).

# Variables de entorno:

MONGO_ATLAS_SRV = string de conexión de Mongo Atlas
MONGO_ATLAS_TEST_SRV = string de conexión de MongoDB para testing
TOKEN_SECRET_KEY = key que se utilizará para codificar / decodificar el token JWT
TOKEN_KEEP_ALIVE = tiempo de duración del token JWT
GMAIL_EMAIL = e-mail que recibirá los correos electrónicos que envíe la aplicación
GMAIL_PASSWORD = password para la API configurado desde la cuenta de GMail del mail que recibe los correos
GMAIL_NAME = nombre de la persona / alias que envía los mails
NODE_ENV = si está seteado en 'development', utilizará el puerto 8080 para pruebas en localhost. Si está en 'production' utilizará el puerto del hosting donde esté nuestra aplicación (heroku, railway, etc.).

-- El sitio dispone de una vista creada con ejs, que permite ver la configuración del
servidor (objeto process e info del server). Path: '/info' al que se puede acceder también desde la home.

-- Se enviará un mail (a la casilla configurable desde las variables de entorno), por cada registro nuevo de usuario y con cada orden de compra generada. La librería utilizada para ello es 'nodemailer' y sus parámetros de configuración los seteamos en el archivo .env mencionado más arriba.

-- En todas las operaciones de la API Rest se ha implementado try/catch para que en caso de detectar algún error, el servidor mande por consola el detalle completo del mismo. También tenemos un archivo de logs que irá guardando los logs de errores (path: logs/error.log) y los de warning (path: logs/warn.log). Para ello se utilizó la librería Winston. La configuración de la misma, la encontramos en 'src/middlewares/logger.ts'.

-- Se ha desarrollado un frontend sencillo para hacer las pruebas que permitan:

- Iniciar sesión (login) desde la home.
- Registrar nuevo usuario (desde la ruta /register). Para ello no es necesario iniciar sesión.
- Ver la información del servidor (ruta /info).
- Cerrar sesión (logout) desde la home.
- Elegir la cantidad de productos que queramos y agregarlos al carrito del usuario.
- Cambiar la categoría de los productos que queremos que se muestren en el front.
- Cambiar la dirección de entrega donde queremos que llegue nuestra compra.
- Generar la orden de compra, una vez que tenemos armado nuestro carrito.
- Cargar nuevos productos (únicamente si nuestro usuario es admin).
- Interactuar con el chatBot para consultar stock de los productos, o nuestro carrito (válido para usuario común o para usuario admin).

# Colecciones implementadas:

- Usuarios
- Productos
- Mensajes
- Carritos
- Órdenes

**_ Importante: _**

**_ Contamos con la url '/api-docs' que tiene la documentación de todos los endpoints que podemos ejecutar desde nuestra aplicación web. Para generar esta vista, se utilizó swagger. _**

**_ Como hay operaciones que requieren autorización, para dichas operaciones debemos primero ir al botón 'Authorize' y cargar nuestro token (que se genera después de iniciar sesión correctamente). _**

**_ Si bien no es una buena práctica guardar este token del lado del cliente, únicamente a los fines prácticos y para facilitar la tarea del profesor, se configuró para que se guarde este token en localStorage. También para poder obtenerlo de manera rápida y enviarlo en los headers que requieran autenticación. _**

**_ En el caso de querer hacer pruebas de las rutas con autorización desde Postman, guardar el token en el header con el formato 'Bearer' _**

# Librerías utilizadas para el proyecto:

Node.js
MongoDB
JWT
Mongoose
Bcrypt
Websocket
Dotenv
Ejs
Nodemailer
Swagger-ui-express
Winston
Yargs
