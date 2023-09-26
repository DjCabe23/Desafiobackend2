const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextID = 0;

  }

  _saveData(dataSave) {
    const data = JSON.stringify(dataSave, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  addProduct(product) {
    // preguntar si son validos los datos
    if (this.validarCampos(product)) {
      this.nextID++;
      product.id = this.nextID;
      this.products.push(product);
      this._saveData(product);
      return product.id;
    }
  }

  // validar los datos del producto
  validarCampos(product) {
    let validos = true;
    let values = Object.values(product);
    values.forEach((valor) => {
        if (valor === null || valor === undefined || valor.length === 0) {
        console.log("Los campos deben ser obligatorios");
        validos =  false;
        }
    });
    return validos;
  }

  async getProducts() {
    try {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log(`No se pudo leer el archivo. Error: ${err}`);
    }  
  }

  async getProductById(id) {
    try {
        const file = await fs.promises.readFile(this.path, 'utf-8');
        const data = JSON.parse(file); // aca ya tengo todos los productos en data
        
        // busco el producto que coincida con el id y lo retorno
        const prodId = data.find((product) => product.id === id);
        return prodId;
    } catch (error) {
        console.log(`El producto con ID no existe`);
    } 
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      updatedProduct.id = id;
      this.products[index] = updatedProduct;
      this._saveData();
      return true; 
    }
    return false;
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this._saveData();
      return true; 
    }
    return false;
  }
}


const productManager = new ProductManager('products.json');


const productId = productManager.addProduct({
    title: "producto de prueba",
    descripcion: "esto es un producto de prueba",
    price: 200,
    thumbnail: "imagen por ahora",
    code: "abc123",
    stock: 25,
});

console.log('Producto agregado con ID:', productId);

const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);

const product = productManager.getProductById(productId);
console.log('Producto consultado por ID:', product);

const updated = productManager.updateProduct(productId, {
    title: "Segundo producto de prueba",
    descripcion: "Esto es otro producto de prueba",
    price: 300,
    thumbnail: "otra imagen",
    code: "efg456",
    stock: 23,
});

console.log('Producto actualizado:', updated);

const deleted = productManager.deleteProduct(productId);
console.log('Producto eliminado:', deleted);

