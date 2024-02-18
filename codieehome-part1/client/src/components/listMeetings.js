import React, { Component } from "react";
import axios from "axios";

class ListMeetings extends Component {
  state = {
    loader: true,
    meetings: [],
    error: false,
  };
  async componentDidMount() {
    const code = this.props.location.search.split("code=")[1];
    if (code) {
      let response;
      try {
        response = await axios.post("/api/meetingslist", { code });
      } catch (error) {
        this.setState({ error: "Something went wrong.", loader: false });
        return;
      }
      console.log(response.data);
      if (response.data.success) {
        this.setState({
          loader: false,
          meetings: response.data.meetings,
        });
      }
    } else {
      this.props.history.push("/");
    }
  }

  renderData = (data) => {
    return data.map((item, i) => {
      return (
        <div className="col-sm-4 meetingArea">
          <h2>Meeting Name: {item.topic}</h2>
          <p>
            <span className="bold"> Duration: {item.duration} min</span>
          </p>
          <p>
            <span className="bold"> Start Time:{item.start_time}</span>
          </p>
          <p>
            <span className="bold"> Timezone: {item.timezone}</span>
          </p>
          <a href={`${item.join_url}`} className="btn btn-success">
            Join
          </a>
        </div>
      );
    });
  };

  render() {
    if (this.state.loader) {
      return <div className="loader"></div>;
    }

    if (this.state.error) {
      return (
        <div>
          <div className="container meetings">
            <div className="row" style={{ textAlign: "center" }}>
              <span className="text-danger">{this.state.error}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="container meetings">
          <div className="row">{this.renderData(this.state.meetings)}</div>
        </div>
      </div>
    );
  }
}

export default ListMeetings;
