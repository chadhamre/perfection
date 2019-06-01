import { Card, Layout, Spinner, Stack, TextStyle } from "@shopify/polaris";

export class Loading extends React.Component {
  render() {
    return (
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
                <TextStyle>loading descriptions to memory...</TextStyle>
              </Stack.Item>
            </Stack>
          </div>
        </Card>
      </Layout.AnnotatedSection>
    );
  }
}
