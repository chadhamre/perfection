import "./Find.css";

import {
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Icon,
  Layout,
  Link,
  ResourceList,
  TextField,
  TextStyle
} from "@shopify/polaris";
import React, { Component } from "react";

import Apply from "./Apply";
import Cookies from "js-cookie";
import Interweave from "interweave";

export class Find extends Component {
  state = {
    products: [],
    find: "",
    replace: "",
    filteredProducts: [],
    applying: false,
    preview: false
  };

  useEffects() {
    this.setState({
      products: this.props.products
    });
  }

  render() {
    return (
      <div>
        {this.state.applying ? (
          <Apply changes={this.state.filteredProducts} />
        ) : (
          <Layout>
            <Layout.Section>
              <Layout.AnnotatedSection
                title="Find & Replace"
                description="These changes cannot be undone. We recommend backing up your catalog to CSV before applying any changes."
              >
                <Card sectioned>
                  <Form onSubmit={this.handleSubmit}>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          value={this.state.find}
                          onChange={this.handleChange("find")}
                          label="Find"
                          type="find"
                        />
                        <TextField
                          value={this.state.replace}
                          onChange={this.handleChange("replace")}
                          label="Replace"
                          type="replace"
                        />
                      </FormLayout.Group>
                      <ButtonGroup>
                        <Button primary submit>
                          Preview
                        </Button>

                        {this.state.preview &&
                        this.state.filteredProducts.length ? (
                          <Button
                            onClick={() => {
                              this.handleApply(this.state.filteredProducts);
                            }}
                          >
                            Replace All
                          </Button>
                        ) : null}

                        <div
                          className="clickable-grey"
                          onClick={() => this.props.refetch()}
                        >
                          refresh
                        </div>
                      </ButtonGroup>
                    </FormLayout>
                  </Form>
                </Card>
              </Layout.AnnotatedSection>
            </Layout.Section>
            <Layout.Section>
              <Card>
                {this.state.filteredProducts.length > 0 ? (
                  <ResourceList
                    showHeader
                    resourceName={{ singular: "product", plural: "products" }}
                    items={this.state.filteredProducts}
                    renderItem={item => {
                      return (
                        <ResourceList.Item
                          id={item.node.id}
                          // onClick={() =>
                          //   (window.parent.location.href = `https://${Cookies.get(
                          //     "shopOrigin"
                          //   )}/admin/products/${item.node.id
                          //     .split("gid://shopify/Product/")
                          //     .join("")}`)
                          // }
                        >
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.title}
                            </TextStyle>
                          </h3>
                          <Layout>
                            <Layout.Section oneHalf>
                              <div>
                                <TextStyle variation="negative">
                                  Before
                                </TextStyle>
                                <div>
                                  <Interweave
                                    content={
                                      item.node.descriptionHtmlBeforeHighlight
                                    }
                                  />
                                </div>
                              </div>
                            </Layout.Section>
                            <Layout.Section oneHalf>
                              <div>
                                <TextStyle variation="positive">
                                  After
                                </TextStyle>
                                <div>
                                  <Interweave
                                    content={
                                      item.node.descriptionHtmlAfterHighlight
                                    }
                                  />
                                </div>
                              </div>
                            </Layout.Section>
                          </Layout>
                        </ResourceList.Item>
                      );
                    }}
                  />
                ) : (
                  <ResourceList
                    items={["none"]}
                    renderItem={item => {
                      return (
                        <ResourceList.Item>
                          <h3>
                            <TextStyle variation="strong">No Results</TextStyle>
                          </h3>
                        </ResourceList.Item>
                      );
                    }}
                  />
                )}
              </Card>
            </Layout.Section>
          </Layout>
        )}
      </div>
    );
  }
  handleSubmit = () => {
    const searchString = JSON.stringify(this.state.find).slice(1,-1)
    const replaceString = JSON.stringify(this.state.replace).slice(1,-1)

    let filteredProducts = this.state.products.filter(
      item =>
        JSON.stringify(item.node.descriptionHtml).indexOf(searchString) !==
        -1
    );

    filteredProducts.forEach(item => {
      // stringify the description from shopify
      const stringifiedDescription = JSON.stringify(item.node.descriptionHtml)
      
      // build before block with green highlighting
      item.node.descriptionHtmlBeforeHighlight = JSON.parse(
        stringifiedDescription
          .split(searchString)
          .join(`<span class='highlight red'>${searchString}</span>`))

      // build after HTML for api update
      item.node.descriptionHtmlAfter = JSON.parse(
        stringifiedDescription
          .split(searchString)
          .join(replaceString)
      )

      // build after block with red highlighting
      item.node.descriptionHtmlAfterHighlight = JSON.parse(
        stringifiedDescription
          .split(searchString)
          .join(`<span class='highlight green'>${replaceString}</span>`));
    })

    this.setState({
      find: this.state.find,
      replace: this.state.replace,
      filteredProducts,
      preview: true
    });
  };
  handleChange = field => {
    return value => this.setState({ [field]: value, preview: false });
  };
  handleToggle = () => {
    this.setState(({ enabled }) => {
      return { enabled: !enabled };
    });
  };
  handleApply = changes => {
    this.setState({ applying: true });
  };
}

export default Find;
