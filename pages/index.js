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
import ProductQuery from "./../components/ProductQuery";

const GET_PRODUCTS = gql`
  query getProducts {
    products(first: 2) {
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

class AnnotatedLayout extends React.Component {
  state = {
    products: []
  };

  render() {
    return (
      <Page>
        <Query query={GET_PRODUCTS}>
          {({ data, loading, error }) => {
            if (loading) return <div>loading products to memory</div>;
            if (error) return <div>{error.message}</div>;
            console.log(data);
            return <div>success!</div>;
          }}
        </Query>
      </Page>
    );
  }
  handleSubmit = () => {
    this.setState({
      find: this.state.find,
      replace: this.state.replace
    });
    console.log("submission", this.state);
  };
  handleChange = field => {
    return value => this.setState({ [field]: value });
  };
  handleToggle = () => {
    this.setState(({ enabled }) => {
      return { enabled: !enabled };
    });
  };
}

export default AnnotatedLayout;
