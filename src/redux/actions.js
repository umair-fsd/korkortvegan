export const getProductsAction = (products) => ({
  type: "GET_PRODUCTS",
  payload: tests,
});
export const addProductAction = (product) => ({
  type: "ADD_PRODUCT",
  payload: product,
});
export const deleteProductAction = (id) => ({
  type: "DELETE_PRODUCT",
  payload: id,
});
export const addToCart = (cart) => ({
  type: "ADD_TO_CART",
  payload: cart,
});
export const updateCart = (value) => ({
  type: "UPDATE_CART",
  payload: value,
});
export const emptyCart = (value) => ({
  type: "EMPTY_CART",
  payload: value,
});
export const deleteCartItem = (id) => ({
  type: "DELETE_CART_ITEM",
  payload: id,
});
export const initUser = (user) => ({
  type: "INIT_USER",
  payload: user,
});
