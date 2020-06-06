import { products } from "../fake_data";

// const Mutation = {
//   addMessage: (_, { title, body, author }) => {
//     const newMessage = { title, body, author };
//     messages.push(newMessage);
//     return newMessage;
//   }
// };

const Mutation = {
  addProduct: (_, { category, price, stocked, name, inCart }) => {
    const newProduct = { category, price, stocked, name, inCart };
    products.push(newProduct);
    console.log('here')
    return newProduct;
  },
  _removeProduct: (_, { product }) => {
    console.log('prodcut  ', product)
    const removedProduct = products.filter((prod) => prod.name !== product);
    console.log('removedProduct ', removedProduct);
    if (!removedProduct) {
      console.error('cant find product');
    }
    return removedProduct;
  },
  _updateCart: (_, {product}) => {
    console.log('product ', product)
    let updateProduct = products.find((prod) => prod.name === product);
    console.log('updateProduct ', updateProduct)
    let toggleCart = Object.assign(updateProduct, {inCart: true})
    console.log('toggleCart ', toggleCart)
    if (!updateProduct) {
      console.error('cant find product');
    }
    return toggleCart
  },
  _removeFromCart: (_, {product}) => {
    let updateProduct = products.find((prod) => prod.name === product.name);
    if (!updateProduct) {
      console.error('cant find product');
    }
    updateProduct = Object.assign(updateProduct, product)
    return updateProduct
  }
};

export default Mutation;
