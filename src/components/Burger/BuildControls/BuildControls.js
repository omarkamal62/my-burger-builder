import React from "react";
import classes from "./BuildControls.module.css";

import BuildControl from "./BuildControl/BuildControl";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" },
];

const buildControls = (props) => (
  <div className={classes.BuildControls}>
    <p>
      Current Price: <strong>{props.price.toFixed(2) + "$"}</strong>
    </p>
    {controls.map((ctrl) => (
      <BuildControl
        removed={() => props.ingredientRemoved(ctrl.type)}
        added={() => props.ingredientAdded(ctrl.type)}
        key={ctrl.label}
        label={ctrl.label}
        disabled={props.disabled[ctrl.type]}
      />
    ))}
    <button
      disabled={!props.purchasable}
      onClick={props.ordered}
      className={classes.OrderButton}
    >
      {props.isAuth ? "ORDER NOW" : "Sign Up To Order"}
    </button>
  </div>
);

export default buildControls;
