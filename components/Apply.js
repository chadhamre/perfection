import React, { Component } from "react";
import { Layout, Page, Stack, Spinner, TextStyle } from "@shopify/polaris";

export class Apply extends Component {
  state = {
    changes: [],
    change: 1
  };

  componentDidMount() {
    let changes = this.props.changes;
    this.setState({
      changes: changes
    });

    changes.forEach((change, index) => {
      console.log(change);
      this.setState({ change: index + 1 });
    });
  }

  render() {
    return (
      <Page fullWidth>
        <Layout>
          <Layout.Section>
            <Stack alignment="center">
              <Stack.Item>
                <Spinner />
              </Stack.Item>
              <Stack.Item>
                <TextStyle>
                  Updating {this.state.change} of {this.state.changes.length}{" "}
                  Product Descriptions
                </TextStyle>
              </Stack.Item>
            </Stack>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Apply;
