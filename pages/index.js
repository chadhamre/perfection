import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Page } from "@shopify/polaris";

const GET_PRODUCTS = gql`
  query getProducts($cursor: String) {
    products(first: 5, after: $cursor) {
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
      <Page>
        <Query query={GET_PRODUCTS}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) return <div>loading products to memory...</div>;
            if (error) return <div>{error.message}</div>;
            if (data.products.pageInfo.hasNextPage) {
              fetchMore({
                variables: {
                  cursor:
                    data.products.edges[data.products.edges.length - 1].cursor
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  let combinedData = {
                    products: {
                      pageInfo: { ...fetchMoreResult.products.pageInfo },
                      edges: [
                        ...previousResult.products.edges,
                        ...fetchMoreResult.products.edges
                      ],
                      __typename: fetchMoreResult.products.__typename
                    }
                  };
                  return combinedData;
                }
              });
            }
            console.log("HERE", data);
            return <div>{JSON.stringify(data)}</div>;
          }}
        </Query>
      </Page>
    );
  }
}

export default Index;
