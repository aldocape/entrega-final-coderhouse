export enum Categoria {
  Almacen = 'Almacen',
  Muebles = 'Muebles',
  Electro = 'Electrodomesticos',
  Ropa = 'Indumentaria',
}

export interface Producto {
  _id: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  foto?: string;
  precio: number;
  stock: number;
  categoria: Categoria;
}

// Carrito es un array de ObjectId de productos
export interface Carrito {
  productos: [
    {
      prodId: string;
      nombre: string;
      cantidad: number;
    }?
  ];
  direccion_entrega: string;
}

export interface Mensaje {
  _id: string;
  time: string;
  message: string;
  user: {
    username: string; // Es el email del autor del mensaje, es único y lo identifica, no se repite
    nombre: string;
    direccion: string;
    telefono: string;
  };
}

export interface Usuario {
  _id: string;
  username: string;
  password: string;
  admin: boolean;
  nombre: string;
  direccion: string;
  edad?: number;
  telefono?: string;
  avatar?: string;
  carrito?: any;
}

export enum Estado {
  Generada = 'Generada',
  Pagada = 'Pagada',
  Enviando = 'Enviando',
  Finalizada = 'Finalizada',
}

export interface Orden {
  _id: string;
  userId: string;
  productos: [
    {
      prodId: string;
      cantidad: number;
      precio: number;
    }
  ];
  estado: Estado;
}
