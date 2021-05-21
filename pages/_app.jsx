import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import PropTypes from "prop-types";
import { useRef } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/globals.css";
import "../styles/reset.css";
import "../styles/typography.css";
import "../styles/utils.css";
import { AuthProvider, useAuthContext } from "../context/AuthContext";
import Spinner from "../components/loading-spinner/Spinner";
import { ModalProvider } from "../context/ModalContext";

const AppRoutes = ({ component: Component, pageProps }) => {
  const authContext = useAuthContext();

  if (authContext.authState == null) {
    return <Spinner show />;
  }

  return <Component {...pageProps} />;
};

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <>
      <Head>
        <title>mBooks</title>
      </Head>
      <QueryClientProvider client={queryClientRef.current}>
        <AuthProvider>
          <ModalProvider>
            <Hydrate state={pageProps.dehydratedState}>
              <ReactQueryDevtools />
              {/* <Component {...pageProps} /> */}
              <AppRoutes component={Component} pageProps={pageProps} />
            </Hydrate>
          </ModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};

AppRoutes.propTypes = {
  component: PropTypes.any,
  pageProps: PropTypes.any,
};

export default MyApp;
