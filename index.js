const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextID = 0;

    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      if (this.products.length > 0) {
        this.nextID = Math.max(...this.products.map((product) => product.id));
      }
    } catch (error) {
      this._saveData();
    }
  }

  _saveData() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, 'utf8');
  }

  addProduct(product) {
    this.nextID++;
    product.id = this.nextID;
    this.products.push(product);
    this._saveData();
    return product.id;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
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
