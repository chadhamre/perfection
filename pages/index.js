import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Page } from "@shopify/polaris";

const GET_PRODUCTS = gql`
  query getProducts($cursor: String) {
    products(first: 1, after: $cursor) {
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
            <getProducts
              onLoadMore={() => {
                console.log("LOAD MORE");
                fetchMore({
                  variables: {
                    cursor: data.products.edges[0].cursor
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    console.log("FETCH MORE RESULTS", fetchMoreResult);
                    if (fetchMoreResult.products.edges.length) {
                      return [
                        ...previousResult.products.edges,
                        ...fetchMoreResults.products.edges
                      ];
                    }
                    return previousResult.products.edges;
                  }
                });
              }}
            />;
            if (loading) return <div>loading products to memory...</div>;
            if (error) return <div>{error.message}</div>;
            return <div>success!</div>;
          }}
        </Query>
      </Page>
    );
  }
}

export default Index;
