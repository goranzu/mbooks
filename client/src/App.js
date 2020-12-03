import { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthContext } from "./context/auth";
import Home from "./pages/home/Home";
import ReadingList from "./pages/reading-list/Readinglist";
import Search from "./pages/search/Search";

function PrivateRoute({ children, ...rest }) {
  const { isAuth } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() => (isAuth() ? children : <Redirect to="/" />)}
    />
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Layout>
          <Switch>
            <PrivateRoute path="/search">
              <Search />
            </PrivateRoute>
            <PrivateRoute path="/list">
              <ReadingList />
            </PrivateRoute>
            <PrivateRoute path="/finished">
              <div>
                <h1>Finished Reading Page</h1>
              </div>
            </PrivateRoute>
            <Route>
              {() => (
                <div>
                  <h1>404 Page</h1>
                </div>
              )}
            </Route>
          </Switch>
        </Layout>
      </Switch>
    </Router>
  );
}

export default App;
