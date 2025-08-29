import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? <Redirect to="/dashboard" /> : <Component {...props} /> //if authentificated show dashboard
    }
  />
);

export default PublicRoute;
