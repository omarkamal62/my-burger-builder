import React, { Component } from "react";
import Order from "../../components/Order/Order";
import Spinner from "../../components/UI/Spinner/Spinner";

import axios from "../../axios-orders";

class Orders extends Component {
  state = {
    orders: [],
    loading: true,
  };

  componentDidMount() {
    const fetchedData = [];

    axios
      .get("/orders.json")
      .then((res) => {
        for (let key in res.data) {
          fetchedData.push({
            ...res.data[key],
            id: key,
          });
        }

        this.setState({ orders: fetchedData, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  render() {
    let orders = this.state.orders.map((order) => {
      console.log("O", order);
      return (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={order.price}
        />
      );
    });

    if (this.state.loading) {
      orders = <Spinner />;
    }

    return <div>{orders}</div>;
  }
}

export default Orders;
