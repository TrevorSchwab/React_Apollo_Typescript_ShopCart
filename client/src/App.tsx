import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_PRODUCTS = gql`
  {
    products {
      category
      price
      stocked
      name
      inCart
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $category: String!
    $price: String!
    $stocked: Boolean!
    $name: String!
    $inCart: Boolean!
  ) {
    addProduct(
      category: $category
      price: $price
      stocked: $stocked
      name: $name
      inCart: $inCart
    ) {
      category
      price
      stocked
      name
      inCart
    }
  }
`;

const REMOVE_PRODUCT = gql`
  mutation _removeProduct($product: String!) {
    _removeProduct(product: $product) {
      category
      price
      stocked
      name
      inCart
    }
  }
`;

const UPDATE_CART = gql`
  mutation _updateCart($product: String!) {
    _updateCart(product: $product) {
      category
      price
      stocked
      name
      inCart
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation _removeFromCart($product: Product_Input!) {
    _removeFromCart(product: $product) {
      category
      price
      stocked
      name
      inCart
    }
  }
`;

const FilterableProductTable = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: mutationResult => [{ query: GET_PRODUCTS }],
  });

  const [_removeProduct] = useMutation(REMOVE_PRODUCT, {
    refetchQueries: mutationResult => [{ query: GET_PRODUCTS }],
  });

  const [_updateCart] = useMutation(UPDATE_CART, {
    refetchQueries: mutationResult => [{ query: GET_PRODUCTS }],
  });

  const [_removeFromCart] = useMutation(REMOVE_FROM_CART, {
    refetchQueries: mutationResult => [{ query: GET_PRODUCTS }],
  });

  const [allProducts, setAllProducts] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    if (data) {
      setAllProducts(data.products);
    }
  }, [data]);

  const checkInStock = () => {
    setInStockOnly(!inStockOnly);
  };

  const filterSearch = (filtered: string) => {
    setFilterText(filtered);
  };

  const newProduct = () => {
    setAddingProduct(!addingProduct);
  };

  type Product = {
    category: string;
    inCart: Boolean;
    name: string;
    price: string;
    stocked: Boolean;
  };

  const _addNewProduct = (product: Product) => {
    addProduct({ variables: product });
  };

  const removeProduct = (product: Product) => {
    const productName = product.name;
    _removeProduct({ variables: { product: productName } });
  };

  const updateCart = (product: Product) => {
    const newProduct = product.name;
    _updateCart({ variables: { product: newProduct } });
  };

  const removeFromCart = (product: Product) => {
    const removeProduct = { ...product, inCart: false };
    _removeFromCart({ variables: { product: removeProduct } });
  };

  const filterMemo = useMemo(() => {
    if (data) {
      const filterInStockProducts = data.products
        .filter((product: Product) =>
          product.name.toLowerCase().startsWith(filterText.toLowerCase())
        )
        .filter((product: Product) => product.stocked);

      const filterProducts = data.products.filter((product: Product) =>
        product.name.toLowerCase().startsWith(filterText.toLowerCase())
      );

      return (
        <ProductTable
          updateCart={updateCart}
          removeProduct={removeProduct}
          products={inStockOnly ? filterInStockProducts : filterProducts}
        />
      );
    }
  }, [filterText, inStockOnly, data]);

  if (loading || error) {
    return <div>loading or error</div>;
  }
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <SearchBar checkInStock={checkInStock} filterSearch={filterSearch} />
        <ShoppingCart products={allProducts} removeFromCart={removeFromCart} />
        <button style={{ bottom: '40px', right: '50px', position: 'fixed' }} onClick={newProduct}>
          +
        </button>
        {addingProduct ? (
          <NewProduct newProduct={newProduct} addNewProduct={_addNewProduct} />
        ) : null}
      </div>
      <div>{filterMemo}</div>
    </div>
  );
};

export default FilterableProductTable;

type Props = { checkInStock: Function; filterSearch: Function };

const SearchBar: React.FC<Props> = ({ checkInStock, filterSearch }) => {
  const _checkInStock = () => {
    checkInStock();
  };

  const handleChange = (e: any) => {
    // come back to 'any' type
    e.preventDefault();
    filterSearch(e.target.value);
  };

  return (
    <div>
      <input type="text" placeholder="search..." onChange={handleChange} />
      <p>
        <input type="checkbox" onClick={_checkInStock} /> Only show products in stock
      </p>
    </div>
  );
};

type Product = {
  category: string;
  inCart: Boolean;
  name: string;
  price: string;
  stocked: Boolean;
};

type ShopCartProps = { products: [Product] | null; removeFromCart: Function };

const ShoppingCart: React.FC<ShopCartProps> = ({ products, removeFromCart }) => {
  const _removeFromCart = (product: Product) => {
    removeFromCart(product);
  };
  return products ? (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
      <div>
        {products.map(product => {
          return product.inCart ? (
            <div key={product.name}>
              <button onClick={() => _removeFromCart(product)}>x</button>
              <span>{product.name}</span>
              <span>{product.price}</span>
            </div>
          ) : null;
        })}
      </div>
    </div>
  ) : (
    <div>Cart is empty</div>
  );
};

type NewProdProps = { newProduct: Function; addNewProduct: Function };

const NewProduct: React.FC<NewProdProps> = ({ newProduct, addNewProduct }) => {
  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');

  const _newProduct = () => {
    newProduct();
  };

  const _addNewProduct = (e: any) => {
    e.preventDefault();
    addNewProduct({
      category: category,
      inCart: false,
      name: productName,
      price: price,
      stocked: true,
    });
    newProduct();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        bottom: '0vh',
        height: '50vh',
        width: '100vw',
        position: 'fixed',
        backgroundColor: 'white',
        borderTop: 'black',
        borderTopStyle: 'solid',
      }}
    >
      <h4>Add a product</h4>
      <form>
        <label>
          Category:
          <input
            placeholder="Enter goal title here"
            type="text"
            onChange={e => setCategory(e.target.value)}
          />
        </label>
        <label>
          Product Name:
          <input
            placeholder="Enter goal title here"
            type="text"
            onChange={e => setProductName(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            placeholder="Enter goal title here"
            type="text"
            onChange={e => setPrice(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" onClick={_addNewProduct} />
      </form>
      <button style={{ bottom: '40px', right: '50px', position: 'fixed' }} onClick={_newProduct}>
        X
      </button>
    </div>
  );
};

type ProdTableProps = { products: [Product]; removeProduct: Function; updateCart: Function };

const ProductTable: React.FC<ProdTableProps> = ({ products, removeProduct, updateCart }) => {
  const categoryKeys = products.reduce((acc: any, cur) => {
    const key = cur.category;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      category: cur.category,
      inCart: cur.inCart,
      name: cur.name,
      price: cur.price,
      stocked: cur.stocked,
    });
    return acc;
  }, {});

  const _updateCart = (prod: Product) => {
    updateCart(prod);
  };

  const _removeProduct = (prod: Product) => {
    removeProduct(prod);
  };
  return (
    <div>
      <div>
        <span>Name</span>
        <span>Price</span>
      </div>
      {Object.keys(categoryKeys).map(product => {
        return (
          <div key={product}>
            <h4>{product}</h4>
            <ProductRow
              updateCart={_updateCart}
              removeProduct={_removeProduct}
              product={categoryKeys[product]}
            />
          </div>
        );
      })}
    </div>
  );
};

type ProdRowProps = { product: [Product]; removeProduct: Function; updateCart: Function };

const ProductRow: React.FC<ProdRowProps> = ({ product, updateCart, removeProduct }) => {
  const _updateCart = (prod: Product) => {
    updateCart(prod);
  };

  const _removeProduct = (prod: Product) => {
    removeProduct(prod);
  };
  return (
    <div>
      {product.map(prod => {
        return (
          <div key={prod.name} style={{ width: '400px' }}>
            <span>{prod.name} </span>
            <span>{prod.price}</span>
            <button onClick={() => _updateCart(prod)}>Add to cart</button>
            <button onClick={() => _removeProduct(prod)}>Remove product</button>
          </div>
        );
      })}
    </div>
  );
};
