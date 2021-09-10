import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./Auth.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { Redirect } from "react-router-dom";

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

class Auth extends Component {
  state = {
    controls: {
      email: elementConfigHandler(
        "input",
        { type: "email", placeholder: "E-mail" },
        "",
        { required: true, isEmail: true },
        false,
        false
      ),
      password: elementConfigHandler(
        "input",
        { type: "password", placeholder: "Password" },
        "",
        { required: true, minLength: 6 },
        false,
        false
      ),
    },
    isSignUp: true,
  };

  componentDidMount(){
    if(!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
      this.props.onSetAuthRedirectPath();
    }
  }

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

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidation(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      },
    };

    this.setState({ controls: updatedControls });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls["email"].value,
      this.state.controls["password"].value,
      this.state.isSignUp ? true : false
    );
  };

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return {
        isSignUp: !prevState.isSignUp,
      };
    });
  };

  render() {
    const formElementsArray = [];

    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = (
      <form onSubmit={this.submitHandler}>
        {formElementsArray.map((formElement) => {
          return (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              changed={(event) =>
                this.inputChangedHandler(event, formElement.id)
              }
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}
            />
          );
        })}
        <Button btnType="Success">Submit</Button>
      </form>
    );

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = (
        <p className={classes.Error}>{this.props.error.message}</p>
      );
    }

    let authRedirect = null;

    if (this.props.isAuth) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        {form}
        <Button clicked={this.switchAuthModeHandler} btnType="Danger">
          Switch to {this.state.isSignUp ? "SignIn" : "SignUp"}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispachToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
      onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispachToProps)(Auth);
