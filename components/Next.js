import React, { Component } from "react";

export class Next extends Component {
  state = {
    products: []
  };
  componentWillMount() {
    this.setState({ products: this.props.products });
  }
  render() {
    console.log("STATE", this.state);
    return <div>Next</div>;
  }
}

export default Next;
