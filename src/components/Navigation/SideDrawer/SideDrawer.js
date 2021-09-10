import React from "react";

import classes from "./SideDrawer.module.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../Toolbar/NavigationItems/NavigationItems";
import Auxi from "../../../hoc/Auxi/Auxi";
import Backdrop from "../../UI/Backdrop/Backdrop";

const sideDrawer = (props) => {
  let assignedClasses = [classes.SideDrawer, classes.Close];

  if (props.open) {
    assignedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Auxi>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={assignedClasses.join(" ")} onClick={props.closed}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav>
          <NavigationItems isAuth={props.isAuth} />
        </nav>
      </div>
    </Auxi>
  );
};

export default sideDrawer;
