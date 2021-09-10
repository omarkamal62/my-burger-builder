import React, { Component } from "react";
import axios from "../../axios-orders";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import Input from "../../components/UI/Input/Input";

import classes from "./ContactData.module.css";
import { connect } from "react-redux";
import * as orderActions from "../../store/actions/index";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const elementConfigHandler = (
  elementType,
  elementConfig,
  value,
  validation,
  valid,
  touched
) => {
  return {
    elementType,
    elementConfig,
    value,
    validation,
    valid,
    touched,
  };
};

class ContactData extends Component {
  state = {
    orderForm: {
      name: elementConfigHandler(
        "input",
        { type: "text", placeholder: "Your Name" },
        "",
        { required: true },
        false,
        false
      ),
      street: elementConfigHandler(
        "input",
        { type: "text", placeholder: "Street" },
        "",
        { required: true },
        false,
        false
      ),
      zipCode: elementConfigHandler(
        "input",
        { type: "text", placeholder: "ZIP CODE" },
        "",
        { required: true, minLength: 5, maxLength: 5 },
        false,
        false
      ),
      country: elementConfigHandler(
        "input",
        { type: "text", placeholder: "Country" },
        "",
        { required: true },
        false,
        false
      ),
      email: elementConfigHandler(
        "input",
        { type: "email", placeholder: "Your E-mail" },
        "",
        { required: true },
        false,
        false
      ),
      deliveryMethod: elementConfigHandler(
        "select",
        {
          options: [
            { value: "", displayValue: "Please select a value" },
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        "",
        { required: true },
        true,
        false
      ),
    },
    formIsValid: false,
  };

  checkValidation = (value, rules) => {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "";
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  };

  inputChangedHandler = (event, elementIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm,
    };
    const updatedFormElement = {
      ...updatedOrderForm[elementIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidation(
      updatedFormElement.value,
      updatedFormElement["validation"]
    );
    updatedFormElement.touched = true;
    updatedOrderForm[elementIdentifier] = updatedFormElement;

    let formIsValid = false;

    for (let formIdentifier in updatedOrderForm) {
      if (updatedOrderForm[formIdentifier].valid) {
        formIsValid = true;
      } else {
        formIsValid = false;
        break;
      }
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {};

    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] =
        this.state.orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId
    };

    this.props.onOrderBurger(order, this.props.token);
  };

  render() {
    const formElementsArray = [];

    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form>
        {formElementsArray.map((el) => (
          <Input
            key={el.id}
            elementType={el.config.elementType}
            elementConfig={el.config.elementConfig}
            value={el.config.value}
            changed={(event) => this.inputChangedHandler(event, el.id)}
            invalid={!el.config.valid}
            shouldValidate={el.config.validation}
            touched={el.config.touched}
          />
        ))}
        <Button
          btnType="Success"
          clicked={this.orderHandler}
          disabled={!this.state.formIsValid}
        >
          ORDER
        </Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(orderActions.purchaseBurger(orderData, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
