import { Card, Heading, Layout, List, TextContainer } from "@shopify/polaris";
import React, { Component } from "react";

export class Faq extends Component {
  render() {
    return (
      <Layout>
        <Layout.Section>
          <Layout.AnnotatedSection
            title="Find & Replace"
            description="These changes cannot be undone. We recommend backing up your catalog to CSV before applying any changes."
          >
            <Card title="Faq" sectioned>
              <TextContainer>
                <Heading>What does this app do?</Heading>
                <p>
                  This app will help you easily search all of your product
                  descriptions for specific characters or word, and replace them
                  with another.
                </p>
                <Heading>How do I use this app?</Heading>
                <p />
                <List type="number">
                  <List.Item>
                    After installing the app, all of your product descriptions
                    will be loaded.
                  </List.Item>
                  <List.Item>
                    Then you simply search for a word or character you'd like to
                    find.
                  </List.Item>
                  <List.Item>
                    Then you specify what you'd like to replace that word with.
                  </List.Item>
                  <List.Item>
                    This will generate on-screen preview for you to review.
                  </List.Item>
                  <List.Item>
                    If the preview looks good, then you press 'replace'.
                  </List.Item>
                  <List.Item>
                    The screen will show the progress as it updates each project
                    description one by one.
                  </List.Item>
                </List>
              </TextContainer>
            </Card>
          </Layout.AnnotatedSection>
        </Layout.Section>
      </Layout>
    );
  }
}

export default Faq;
