import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <div style={{
          textAlign: "center",
          minHeight: "72vh",
          padding: "10%"
      }}>
        <a
          href="https://zoom.us/oauth/authorize?client_id=oqBPN9_iRGmgmrjwZlIBCQ&response_type=code&redirect_uri=https%3A%2F%2Fintense-retreat-84859.herokuapp.com%2Flist"
          type="button"
          className="btn btn-success"
        >
          Login with Zoom
        </a>
      </div>
    );
  }
}

export default Home;
