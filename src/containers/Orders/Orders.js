import React, { Component } from "react";
import Order from "../../components/Order/Order";
import Spinner from "../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import WithErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

import axios from "../../axios-orders";

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props.token);
  }

  render() {
    let orders = this.props.orders.map((order) => {
      return (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={order.price}
        />
      );
    });

    if (this.props.loading) {
      orders = <Spinner />;
    }

    return <div>{orders}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token) => dispatch(actions.fetchOrders(token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WithErrorHandler(Orders, axios));
