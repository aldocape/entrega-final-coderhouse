// Obtengo elementos del DOM para renderizar el panel del Usuario

const userPanel = document.getElementById('userPanel');
const domicilio = document.getElementById('domicilio');
const bienvenido = document.getElementById('bienvenido');
const user_id = document.getElementById('user_id');
const carrito_id = document.getElementById('carrito_id');

// Obtengo elementos del DOM para renderizar y hacer operaciones con el formulario de Login

const formLogin = document.getElementById('login-form');
const inputUserName = document.getElementById('username');
const inputPassword = document.getElementById('password');
// accessOK es una capa que le indica al usuario que inició sesión y que puede cargar productos
const accessMsg = document.getElementById('accessOK');

// Obtengo form de productos
const formProduct = document.getElementById('product-form');

// Armo el túnel con el server (Handshake)
const socket = io.connect();

function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}

// Función que utilizo para poder acceder a la API usando los verbos GET, POST y PUT
async function api(
  endpoint = '/api/productos',
  method = 'POST',
  body = undefined
) {
  if (body) {
    body = JSON.stringify(body);
  }

  // Obtengo el token de localStorage y lo paso como header en la request
  const token = localStorage.getItem('token');
  const headers = {
    'Content-type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${endpoint}`, {
    method,
    body,
    headers,
  });

  const data = await response.json();

  return data;
}

// Aquí inicia la App
async function initApp() {
  // Verifico si hay algún token almacenado en local storage
  if (isLoggedIn()) {
    // Verifico que el token no esté vencido, usando el middleware 'checkAuth' en el endpoint '/usuarios/session'
    const user = await api('/usuarios/session', 'GET');
    // Si el token no es válido, nos llegará un status de error, en ese caso eliminamos el token y recargamos la página
    if (user.status === 'error') {
      localStorage.clear();
      document.location.reload();
    } else {
      // Si el token es válido, mostramos el panel de usuario y los accesos del mismo
      // y además habilitamos el chatBot para consultas
      updateLoginStatus(user.user);
      socket.emit('newBot', user.user);
    }
  } else {
    // Si el usuario aún no se ha logueado, muestro el formulario de login
    formLogin.classList.remove('is-hidden');
  }
}

// Usuario logueado
function updateLoginStatus(user) {
  // Si es administrador, muestro form de crear producto y mensaje de que tiene ese form abajo de la página
  if (user.admin) {
    formProduct.classList.remove('is-hidden');
    accessMsg.classList.add('msgAccess');
    accessMsg.classList.remove('is-hidden');
  }
  // Oculto formulario de login
  formLogin.classList.add('is-hidden');

  // Muestro panel de usuario, le agrego sus datos (nombre, avatar y domicilio),
  // y guardo su id y el id de su carrito para usar en otras funciones
  userPanel.classList.remove('is-hidden');
  bienvenido.innerHTML = `Bienvenido ${user.nombre} &nbsp;&nbsp;<img src="${user.avatar}" width="70" />`;
  domicilio.innerHTML = `Domicilio: ${user.direccion}`;
  document.getElementById('user_id').value = user._id;
  document.getElementById('carrito_id').value = user.carrito;

  // Muestro el chatBot
  document.getElementById('chat-bot').classList.remove('is-hidden');

  const btnCarrito = document.getElementById('btnCarrito');
  // Verifico que btnCarrito existe (en la vista productList.ejs validamos que haya productos para mostrarlo)
  // entonces si no existe btnCarrito, significa que no hay productos, por lo tanto tampoco activamos los checks para elegir cantidad y confirmar carrito
  if (btnCarrito) {
    // Cargo la dirección de entrega del usuario en un input y muestro checkboxes para armar carrito
    const direccion_entrega = document.getElementById('direccion_entrega');
    direccion_entrega.value = user.direccion;
    btnCarrito.classList.remove('is-hidden');

    const cartOptions = document.getElementsByClassName('cartOptions');
    for (let i = 0; i < cartOptions.length; i++) {
      cartOptions[i].classList.remove('is-hidden');
    }

    const optionsCart = document.getElementsByClassName('agregarCarrito');
    for (let i = 0; i < optionsCart.length; i++) {
      optionsCart[i].classList.remove('is-hidden');
    }

    // Muestro el carrito actual del usuario
    outputCart(user.carrito);
  }
}

async function login() {
  const username = inputUserName.value;
  const password = inputPassword.value;
  // llamo a la api para ver si el user y pass son correctos
  const response = await api('/login', 'post', { username, password });
  // si hubo algún error en el login, lo mostramos en un div debajo del form
  if (response.status === 'error') {
    document.getElementById('msgLogin').innerHTML = response.error;
  } else {
    // si el usuario y la password están ok, almacenamos el token en localStorage
    localStorage.setItem('token', response.token);
    updateLoginStatus(response.user);

    // Le aviso al server que un nuevo usuario se ha logueado
    socket.emit('newBot', response.user);
  }
}

async function logout() {
  // Obtengo el user_id de un input hidden del front end, para pasarlo como parámetro a logout
  // y así poder mostrar su nombre y apellido
  const user_id = document.getElementById('user_id').value;
  document.location.href = `/logout/${user_id}`;
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;
  const nombre = document.getElementById('nombre').value;
  const direccion = document.getElementById('direccion').value;
  const edad = document.getElementById('edad').value;
  const telefono = document.getElementById('telefono').value;
  const avatar = document.getElementById('avatar').value;
  const admin = document.getElementById('admin');
  // llamo a la api para hacer el signup
  const response = await api('/signup', 'post', {
    username,
    password,
    password2,
    nombre,
    direccion,
    edad,
    telefono,
    avatar,
    admin: admin.checked,
  });
  // si hay algún error, por ejemplo, username ya existe, lo mostramos en un div debajo del form
  if (response.status === 'error') {
    document.getElementById('msgRegister').innerHTML = response.msg;
  } else {
    // si el usuario fue encontrado, almacenamos el token en localStorage
    localStorage.setItem('token', response.token);
    document.getElementById('msgRegister').innerHTML = response.msg;
    setTimeout(() => {
      location.href = '/';
    }, 2000);
  }
}

async function createProduct() {
  // Obtengo datos de los input del form
  const nombre = document.getElementById('nombre');
  const descripcion = document.getElementById('descripcion');
  const categoria = document.getElementById('categoria');
  const codigo = document.getElementById('codigo');
  const foto = document.getElementById('foto');
  const precio = document.getElementById('precio');
  const stock = document.getElementById('stock');

  // Creo un objeto con los datos obtenidos
  const newProduct = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    categoria: categoria.value,
    codigo: codigo.value,
    foto: foto.value,
    precio: precio.value,
    stock: stock.value,
  };

  // Hago un 'POST' a la API usando el endpoint de productos y le paso el objeto nuevo
  api('/api/productos', 'POST', newProduct).then((data) => {
    // Obtengo del DOM una capa invisible del formulario, que uso para mostrar mensajes de error si los hubiera
    const divProd = document.getElementById('msgProd');

    if (data.newProd) {
      divProd.innerHTML = '';

      // Emite un evento 'newProduct' al server
      socket.emit('newProduct', data.newProd);

      const btnCarrito = document.getElementById('btnCarrito');
      // Si no existe la capa 'btnCarrito', es porque aún no hay productos
      // Recargo la página para que la vista productList.ejs renderice la capa btnCarrito
      if (!btnCarrito) {
        setTimeout(() => {
          document.location.reload();
        }, 2000);
      }
    }
    // Si salió todo bien, se va a mostrar un mensaje de que se guardó correctamente, sino mostrará cuál es el error
    divProd.innerHTML = data.msg;
  });
}

// Función para mostrar campo de texto de cantidad cuando se tilda un checkbox
function verificarCheck(id) {
  const checkBox = document.getElementById(id);
  const field = document.getElementById(`input_${id}`);
  if (checkBox.checked) field.style.display = 'block';
  else field.style.display = 'none';
}

// aquí nos trae el evento 'onclick' del botón Confirmar carrito en lista de productos
async function armarCarrito() {
  // Obtengo todos los checkbox del DOM
  const checkBoxs = document.getElementsByClassName('carritoCheck');

  // Filtro los checkbox que estén en estado "checked" para guardar el nombre y cantidad de ese producto
  const productsCart = [];
  for (let check of checkBoxs) {
    if (check.checked) {
      productsCart.push({
        prodId: check.id,
        cantidad: parseInt(
          document.getElementById(`input_cant_${check.id}`).value
        ),
      });
    }
  }

  // Obtengo datos del usuario para poder ver el id del carrito asociado al mismo
  const userData = await api('/usuarios/session', 'GET');

  // Hago un 'POST' a la API usando el endpoint de carrito y le paso el carrito nuevo y el id de carrito del usuario
  const cart = await api(
    `/api/carrito/${userData.user.carrito}/productos`,
    'POST',
    {
      productos: productsCart,
      direccion_entrega: document.getElementById('direccion_entrega').value,
    }
  );

  // Obtengo del DOM una capa invisible del formulario, que uso para mostrar mensajes de error si los hubiera
  const divCart = document.getElementById('msgCart');

  if (cart) {
    divCart.innerHTML = 'El/los producto/s ha/n sido agregado/s al carrito.';
    outputCart(userData.user.carrito);
  } else {
    divCart.innerHTML =
      'Ha ocurrido un error al agregar el o los productos seleccionados al carrito.';
  }
}

// Función para renderizar agregado de productos usando el DOM
function outputProduct(product) {
  const divTabla = document.getElementById('tabla');
  const divProducts = document.getElementById('products');
  const btnCarrito = document.getElementById('btnCarrito');

  // Trato de obtener el elemento que indica que no hay productos para mostrar (h3)
  const sinProductos = document.getElementById('sinProductos');

  // Si existe ese elemento h3, significa que no había productos en la BD, entonces
  // limpio todo el contenido a la capa contenedora 'tabla', incluyendo ese h3 que
  // antes decía que no había elementos para mostrar
  if (sinProductos) {
    divTabla.innerHTML = '';
  }

  // Agrego el nuevo producto al listado, usando el DOM
  divProducts.innerHTML += `
  <div class="col-sm-4">
    <div class="card mt-4 prod-item">
    <input type="hidden" id="input_nombre_${product.id}" value="${product.nombre}" />
      <img
        class="card-img-top"
        src="${product.foto}"
        alt="Imagen del producto"
        style="max-height: 280"
      />
      <div class="card-body">
        <h5 class="card-title">${product.nombre}</h5>
        <p class="card-text">
          ${product.descripcion}
        </p>
        <p class="card-text">Precio ARS: $${product.precioARS}</p>
        <p class="card-text">Precio USD: $${product.precioUSD}</p>
        
        <p class="card-text agregarCarrito"><input type="checkbox" id="${product.id}" class="carritoCheck" onclick="verificarCheck('${product.id}')" />&nbsp;&nbsp;Agregar al carrito</p>
        <p class="card-text" id="input_${product.id}" style="display:none">
        <br />
        Cantidad:&nbsp;&nbsp;<input type="number" id="input_cant_${product.id}" />
        
        </p>
      </div>
    </div>
  </div>`;
  divTabla.appendChild(divProducts);
  if (divProducts.nextSibling) {
    divProducts.parentNode.insertBefore(btnCarrito, divProducts.nextSibling);
  } else {
    divProducts.parentNode.appendChild(btnCarrito);
  }
}

// Función para renderizar el nuevo carrito usando el DOM
function outputCart(cartId) {
  api(`/api/carrito/${cartId}/productos`, 'GET').then((cart) => {
    let text;

    if (cart.success && cart.cart.productos.length) {
      text =
        '<p>Su carrito de compras tiene los siguientes elementos:<br /><br />';

      for (let i = 0; i < cart.cart.productos.length; i++) {
        text += `&#x25cb;&nbsp;&nbsp;${cart.cart.productos[i].nombre} - Cantidad: ${cart.cart.productos[i].cantidad}<br />`;
      }
      text += `<br />-&nbsp;&nbsp;Dirección de entrega:&nbsp;&nbsp;${cart.cart.direccion_entrega}</p>`;

      text += `<button class="btn btn-success mt-4"
      onclick="event.preventDefault(); generarOrden('${cartId}')">Generar orden de compra</button><div style="color: red" id="msgOrder"></div>`;
    } else {
      text = '<p>Aún no posee productos en su carrito de compras</p>';
    }

    datos_carrito.innerHTML = `${text}`;
    datos_carrito.classList.remove('is-hidden');
  });
}

function sendMessage() {
  const mensaje = document.getElementById('message').value;

  // Uso la función api para hacer 'POST' a la API de mensajes, enviándole el mensaje nuevo
  api('/api/mensajes', 'POST', { mensaje, chatBot: false }).then((data) => {
    const divChat = document.getElementById('chatMsg');
    if (data.status === 'ok') {
      divChat.innerHTML = '';

      // Consulto si el mensaje enviado por el usuario es 'carrito'
      if (data.newMsg.message === 'carrito') {
        api('/usuarios/session', 'GET').then((userData) => {
          if (userData.status !== 'error') {
            // Si salió ok la operación de obtener datos del usuario, obtengo los productos de su carrito
            api(`/api/carrito/${userData.user.carrito}/productos`, 'GET').then(
              (cart) => {
                // Hago un map para mostrar solamente nombres y cantidades de cada producto del carrito
                const carrito = cart.cart.productos.map((product) => {
                  return {
                    nombre: product.nombre,
                    cantidad: product.cantidad,
                  };
                });

                data.newMsg.object = carrito;
                socket.emit('newMessage', data.newMsg);
              }
            );
          }
        });
        // Consulto si el mensaje que envía el usuario es 'stock'
      } else if (data.newMsg.message === 'stock') {
        api('/api/productos', 'GET').then((products) => {
          data.newMsg.object = products;
          socket.emit('newMessage', data.newMsg);
        });
      } else {
        // Emite un evento 'newMessage' al server
        socket.emit('newMessage', data.newMsg);
      }
    } else {
      // Si hubo un error, lo muestro en la capa ubicada debajo del input para enviar mensajes
      divChat.innerHTML = data.msg;
    }
  });
}

// Función para generar orden de compra
async function generarOrden(cartId) {
  // Armo un objeto con el cartId que viene por parámetro, y el user_id que obtengo del hidden que está en el userPanel
  const order = {
    cartId,
    userId: document.getElementById('user_id').value,
  };
  // Inserto la nueva orden de compra en la BD y muestro mensaje que salió ok
  const newOrder = await api(`/api/ordenes`, 'POST', order);
  if (newOrder) {
    document.getElementById(
      'msgOrder'
    ).innerHTML = `<p style="margin-top: 20px">${newOrder.msg}</p>`;
    // Debido a que el endpoint /api/ordenes deja vacío el carrito del user, lo que hago después es
    // recargar la página para que me traiga el mismo carrito del usuario, pero ahora vacío
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
}

// Función para mostrar productos de distintas categorías en el front
async function cambiarCategoria(categoria) {
  const productos = await api(`/api/productos/categoria/${categoria}`, 'GET');

  const divProductos = document.getElementById('products');
  divProductos.innerHTML = '';

  if (productos.length) {
    productos.forEach((product) => {
      outputProduct(product);
    });
    if (isLoggedIn()) {
      document.getElementById('btnCarrito').classList.remove('is-hidden');
    } else {
      const optionsCart = document.getElementsByClassName('agregarCarrito');
      for (let i = 0; i < optionsCart.length; i++) {
        optionsCart[i].classList.add('is-hidden');
      }
    }
  } else {
    document.getElementById('btnCarrito').classList.add('is-hidden');
    divProductos.innerHTML +=
      '<h3 id="sinProductos">No hay productos para mostrar</h3>';
  }
}

// Escucho un evento de nuevo Producto desde el server
socket.on('createProduct', (product) => {
  // Muestro el nuevo producto al final de la tabla, usando el DOM
  document.getElementById('formProduct').reset();
  outputProduct(product);
});

// Escucho un evento createBot desde el server
socket.on('createBot', (nombre) => {
  // Agrego nombre de usuario (que viene por parámetro) a la capa del chatBot
  document.getElementById(
    'botMessages'
  ).innerHTML = `<p>Hola ${nombre}! Soy el ChatBOT del sitio y estoy para ayudarte!</p>`;
  document.getElementById('usrChatLabel').innerHTML = nombre;
});

async function guardarMsg(res) {
  // La variable booleana chatBot le indica si el mensaje lo envió el user o el chatBot
  await api('/api/mensajes', 'POST', { mensaje: res, chatBot: true });
}

// Escucho evento de respuesta de chat
socket.on('newResponse', (res) => {
  // Guardo el mensaje del chatbot en la BD y lo muestro en el front
  guardarMsg(res);
  document.getElementById('botMessages').innerHTML += res;
});
