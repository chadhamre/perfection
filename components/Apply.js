import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import React, { Component } from "react";
import {
  Layout,
  Page,
  Stack,
  Spinner,
  TextStyle,
  Card
} from "@shopify/polaris";

const UPDATE_BODY = gql`
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
    }
  }
`;

export class Apply extends Component {
  state = {
    changes: [],
    change: 1,
    done: false
  };

  componentWillMount() {
    let changes = this.props.changes;
    this.setState({
      changes: changes
    });
  }

  render() {
    if (this.state.change === this.state.changes.length)
      window.location.reload();
    if (
      this.state.changes.length > 0 &&
      this.state.change <= this.state.changes.length
    )
      return (
        <div>
          <Layout>
            <Layout.Section>
              <Layout.AnnotatedSection
                title="Find & Replace"
                description="These changes cannot be undone. We recommend backing up your catalog to CSV before applying any changes."
              >
                <Card sectioned>
                  <div className="loader-holder">
                    <Stack alignment="center">
                      <Stack.Item>
                        <Spinner />
                      </Stack.Item>
                      <Stack.Item>
                        <TextStyle>
                          Updating {this.state.change} of{" "}
                          {this.state.changes.length} Product Descriptions
                        </TextStyle>
                      </Stack.Item>
                    </Stack>
                  </div>
                </Card>
              </Layout.AnnotatedSection>
            </Layout.Section>
          </Layout>
          <Mutation
            mutation={UPDATE_BODY}
            variables={{
              input: {
                id: this.state.changes[this.state.change - 1].node.id,
                descriptionHtml: this.state.changes[this.state.change - 1].node
                  .descriptionHtmlAfter
              }
            }}
            onCompleted={() => {
              this.setState({ done: true, change: this.state.change + 1 });
            }}
          >
            {(postMutation, { loading, error, data, called }) => {
              if (!called || this.state.done) {
                postMutation();
                this.setState({ done: false });
              }
              return null;
            }}
          </Mutation>
        </div>
      );
    return null;
  }
}

export default Apply;
