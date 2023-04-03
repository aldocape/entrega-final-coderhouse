import logger from '../../middlewares/logger';
import { v4 as uuidv4 } from 'uuid';
import ProductsDTO from '../../dto/products.dto';
import MessagesDTO from '../../dto/messages.dto';

const products: any = [
  {
    id: 'cc31e62d-d874-4278-94c1-aefc46989a0a',
    nombre: 'Heladera inverter no frost Samsung RT32K5070',
    descripcion:
      'Tipo de deshielo: no frost. Capacidad de 321 litros. Con freezer superior. Eficiencia energética A+.',
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

const carts: any = [
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
const messages: any = [];
const orders: any = [];

export default class DaoMemory {
  private collection: string;
  private static instance: DaoMemory;
  private recurso: any;

  private constructor(collection: string) {
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

  public static getInstance(collection: string): DaoMemory {
    DaoMemory.instance = new DaoMemory(collection);

    logger.info(`Instancia de clase: ${collection} iniciada`);
    return DaoMemory.instance;
  }

  async getAll() {
    try {
      const items = this.recurso;
      if (items.length)
        switch (this.collection) {
          case 'product':
            return items.map(
              (producto: any) => new ProductsDTO(producto, false)
            );
          case 'message':
            return items.map((message: any) => new MessagesDTO(message, false));
          default:
            break;
        }

      return items;
    } catch (err: any) {
      logger.error(`ERROR => ${err}`);
    }
  }

  async save(document: any) {
    document.id = uuidv4();
    this.recurso.push(document);
    return document;
  }

  async getById(id: string) {
    try {
      const item = this.recurso.find((e: any) => id === e.id);
      if (item) return item;
      return 0;
    } catch (err) {
      logger.error(`ERROR => ${err}`);
    }
  }

  leerId(elem: any) {
    return elem.id;
  }

  async getMany(query: any) {
    try {
      const keys = Object.keys(query);
      const items: any[] = [];

      this.recurso.forEach((element: any) => {
        if (element[keys[0]] === query[keys[0]]) {
          items.push(element);
        }
      });

      if (items)
        switch (this.collection) {
          case 'product':
            return items.map(
              (producto: any) => new ProductsDTO(producto, false)
            );
          case 'message':
            return items.map((message: any) => new MessagesDTO(message, false));
          default:
            break;
        }
    } catch (err) {
      logger.error(`ERROR => ${err}`);
    }
  }

  async update(id: string, item: any) {
    try {
      const index = this.recurso.findIndex((elem: any) => id === elem.id);

      if (index < 0) return 0;

      // Si el item buscado existe, lo reemplazo con el nuevo que viene por parámetro
      this.recurso.splice(index, 1, item);
      // Devuelvo el elemento modificado
      return item;
    } catch (err: any) {
      // Devuelvo error a la api en caso de que no haya podido leer el archivo
      logger.error(`ERROR => ${err}`);
    }
  }

  async deleteById(id: string) {
    try {
      const index = this.recurso.findIndex((elem: any) => id === elem.id);

      if (index < 0) return 0;

      return this.recurso.splice(index, 1);
    } catch (err: any) {
      // Devuelvo error a la api en caso de que no haya podido leer el archivo
      logger.error(`ERROR => ${err}`);
    }
  }

  async deleteAll() {
    try {
      const deleted = this.recurso.splice(0, this.recurso.length);

      return deleted;
    } catch (err: any) {
      // Devuelvo error a la api en caso de que no haya podido leer el archivo
      logger.error(`ERROR => ${err}`);
    }
  }
}
