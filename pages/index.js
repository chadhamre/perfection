import "./app.css";

import { Layout, Page } from "@shopify/polaris";

import { Find } from "./../components/Find";
import { Loading } from "./../components/Loading";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_PRODUCTS = gql`
  query getProducts($cursor: String) {
    products(first: 250, after: $cursor) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          title
          descriptionHtml
        }
        cursor
      }
    }
  }
`;

class Index extends React.Component {
  state = {
    products: []
  };

  render() {
    return (
      <Page fullWidth>
        <Layout>
          <Layout.Section>
            <Query query={GET_PRODUCTS}>
              {({ data, loading, error, fetchMore }) => {
                if (loading) return <Loading />;
                if (error) return <div>{error.message}</div>;

                if (data.products.pageInfo.hasNextPage) {
                  console.log("FETCHING MORE");
                  fetchMore({
                    variables: {
                      cursor:
                        data.products.edges[data.products.edges.length - 1]
                          .cursor
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      return {
                        products: {
                          pageInfo: { ...fetchMoreResult.products.pageInfo },
                          edges: [
                            ...previousResult.products.edges,
                            ...fetchMoreResult.products.edges
                          ],
                          __typename: fetchMoreResult.products.__typename
                        }
                      };
                    }
                  });
                }

                if (!data.products.pageInfo.hasNextPage) {
                  return <Find products={data.products.edges}>Done</Find>;
                }
                return <Loading />;
              }}
            </Query>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Index;
