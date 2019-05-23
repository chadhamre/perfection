import App from "next/app";
import Head from "next/head";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/styles.css";
import Cookies from "js-cookie";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include"
  }
});

class MyApp extends App {
  state = {
    shopOrigin: Cookies.get("shopOrigin")
  };
  render() {
    const { Component, pageProps } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Perfection</title>
          <meta charSet="utf-8" />
          <script type="text/javascript">
            {`var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || {widgetcode:"c0e3f4fc1b09d3c2dbb972730d6d92e1c50a5fb3b6485104189c6bdb63b010841a2010ab7b6727677d37b27582c0e9c4", values:{},ready:function(){}};var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;s.src="https://salesiq.zoho.com/widget";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);d.write("<div id='zsiqwidget'></div>");`}
          </script>
        </Head>
        <AppProvider
          shopOrigin={this.state.shopOrigin}
          apiKey={API_KEY}
          forceRedirect
        >
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </AppProvider>
      </React.Fragment>
    );
  }
}

export default MyApp;
