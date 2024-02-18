import React from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "./hoc/layout";
import Home from "./components/home";
import ListMeetings from "./components/listMeetings"

const NotFound = () => <div>Page not found</div>;

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/list" exact component={ListMeetings} />

        {/* Not Found Page */}
        <Route path="*" component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default Routes;
