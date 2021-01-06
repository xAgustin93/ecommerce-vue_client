<template>
  <BasicLayout>
    <h1>Carrito</h1>
    <table class="ui celled table" v-if="products">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Pricio</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.quantity }}</td>
          <td>{{ product.price }} €</td>
          <td style="text-align: center">
            <i class="close icon" @click="deleteAllProductCart(product.id)"></i>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>Total:</td>
          <td colspan="2">{{ getTotal() }} €</td>
        </tr>
      </tbody>
    </table>

    <button
      class="ui button primary fluid"
      @click="createOrder"
      v-if="products"
    >
      Generar pedido
    </button>

    <h3 v-if="!products">No tienes productos en el carrito</h3>
  </BasicLayout>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import jwtDecode from "jwt-decode";
import BasicLayout from "../layouts/BasicLayout";
import {
  getProductsCartApi,
  deleteAllProductCartApi,
  deleteCartApi,
} from "../api/cart";
import { createOrderApi } from "../api/order";
import { getTokenApi } from "../api/token";

export default {
  name: "Cart",
  components: {
    BasicLayout,
  },
  setup() {
    let products = ref(null);
    let realodCart = ref(false);
    const router = useRouter();

    watchEffect(async () => {
      realodCart.value;
      const response = await getProductsCartApi();
      products.value = response;
    });

    const getTotal = () => {
      let totalTemp = 0;
      products.value.forEach((product) => {
        totalTemp += product.price * product.quantity;
      });
      return totalTemp.toFixed(2);
    };

    const deleteAllProductCart = (idProduct) => {
      deleteAllProductCartApi(idProduct);
      realodCart.value = !realodCart.value;
    };

    const createOrder = async () => {
      const token = getTokenApi();
      const { id } = jwtDecode(token);

      const data = {
        user: id,
        totalPayment: getTotal(),
        data: products.value,
      };

      try {
        const response = await createOrderApi(data);
        deleteCartApi();
        router.push("/orders");
      } catch (error) {
        console.log(error);
      }
    };

    return {
      products,
      getTotal,
      deleteAllProductCart,
      createOrder,
    };
  },
};
</script>

<style>
</style>