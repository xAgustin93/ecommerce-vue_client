import { uniqBy, countBy } from "lodash";
import { API_URL, PRODUCTS } from "../utils/constants";

export function addProductCartApi(idProduct) {
  const products = getCartApi();
  products.push(idProduct);

  localStorage.setItem(PRODUCTS, JSON.stringify(products));
}

export function getCartApi() {
  const products = localStorage.getItem(PRODUCTS);

  if (!products) return [];

  return JSON.parse(products);
}

export async function getProductsCartApi() {
  const idProducts = getCartApi();

  if (idProducts.lenght === 0) return null;

  try {
    const products = [];

    for await (const idProduct of idProducts) {
      const response = await fetch(`${API_URL}/products/${idProduct}`);
      const result = await response.json();
      products.push(result);
    }

    const productsCount = countBy(products, (product) => {
      return product.name;
    });

    const combined = uniqBy(products, (product) => {
      const productTemp = product;
      productTemp.quantity = productsCount[product.name];
      return productTemp.name;
    });

    return combined;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function deleteProductCartApi(idProduct) {
  const products = getCartApi();

  const index = products.indexOf(idProduct);
  if (index > -1) products.splice(index, 1);

  localStorage.setItem(PRODUCTS, JSON.stringify(products));
}

export function deleteAllProductCartApi(idProduct) {
  const products = getCartApi();

  const index = products.indexOf(idProduct);

  if (index > -1) {
    products.splice(index, 1);
    localStorage.setItem(PRODUCTS, JSON.stringify(products));
    deleteAllProductCartApi(idProduct);
  }
}

export function deleteCartApi() {
  localStorage.removeItem(PRODUCTS);
}
