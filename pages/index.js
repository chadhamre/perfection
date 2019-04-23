import gql from "graphql-tag";
import { Query } from "react-apollo";
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  SettingToggle,
  Stack,
  TextField,
  TextStyle,
  Heading
} from "@shopify/polaris";
import { ApolloConsumer } from "react-apollo";

class Index extends React.Component {
  state = {
    products: []
  };

  fetchProducts = (client, cursor, products = []) => {
    client
      .query({
        query: gql`
          query Products($cursor: String) {
            products(first: 5, after: $cursor) {
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
        `,
        variables: {
          cursor: cursor
        }
      })
      .then(async data => {
        products.push(...data.data.products.edges);
        if (
          data.data.products.edges[0].cursor &&
          data.data.products.pageInfo.hasNextPage
        ) {
          await this.fetchProducts(
            client,
            data.data.products.edges[0].cursor,
            products
          );
        } else console.log("ALL", JSON.stringify(products));
      })
      .catch(error => console.error(error));
  };

  render() {
    return (
      <ApolloConsumer>{client => this.fetchProducts(client)}</ApolloConsumer>
    );
  }
}

export default Index;
