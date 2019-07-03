import {
  Button,
  Card,
  Form,
  FormLayout,
  Heading,
  Layout,
  Page,
  SettingToggle,
  Stack,
  TextField,
  TextStyle
} from "@shopify/polaris";

class AnnotatedLayout extends React.Component {
  state = {
    find: "",
    replace: ""
  };

  render() {
    const { find, replace } = this.state;

    return (
      <div>
        <Layout.Section>
          <Layout.AnnotatedSection
            title="Find & Replace"
            description="Search product descriptions."
          >
            <Card sectioned>
              <Form onSubmit={this.handleSubmit}>
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      value={find}
                      onChange={this.handleChange("find")}
                      label="Find"
                      type="find"
                    />
                    <TextField
                      value={replace}
                      onChange={this.handleChange("replace")}
                      label="Replace"
                      type="replace"
                    />
                  </FormLayout.Group>
                  <Button primary submit>
                    Find
                  </Button>
                </FormLayout>
              </Form>
            </Card>
          </Layout.AnnotatedSection>
        </Layout.Section>
        {this.state.find ? <ProductQuery find={this.state.find} /> : null}
      </div>
    );
  }
  handleSubmit = () => {
    this.setState({
      find: this.state.find,
      replace: this.state.replace
    });
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
