import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import PropTypes from "prop-types";
import { useRef } from "react";
import "../styles/globals.css";
import "../styles/reset.css";
import "../styles/typography.css";

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};

export default MyApp;
