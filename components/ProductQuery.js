import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail
} from "@shopify/polaris";
import store from "store-js";
import { Redirect } from "@shopify/app-bridge/actions";
import * as PropTypes from "prop-types";

const GET_PRODUCTS_BY_DESCRIPTION_QUERY = gql`
  query Product($find: String!) {
    products(first: 5) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          descriptionHtml
        }
      }
    }
  }
`;

class ResourceListWithProducts extends React.Component {
  state = {
    item: ""
  };
  static contextTypes = {
    polaris: PropTypes.object
  };

  render() {
    return (
      <Query
        query={GET_PRODUCTS_BY_DESCRIPTION_QUERY}
        variables={{ find: `title:*${this.props.find}*` }}
      >
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          return (
            <Card sectioned>
              <ResourceList
                showHeader
                resourceName={{ singular: "Product", plural: "Products" }}
                items={data.products.edges}
                renderItem={item => {
                  return (
                    <ResourceList.Item
                      id={item.node.id}
                      accessibilityLabel={`View details for ${item.title}`}
                    >
                      <Stack vertical>
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.title}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item fill>{item.node.description}</Stack.Item>
                      </Stack>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
          );
        }}
      </Query>
    );
  }
}
export default ResourceListWithProducts;
