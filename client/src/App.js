import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/list">
            {() => (
              <div>
                <h1>Reading List Page</h1>
              </div>
            )}
          </Route>
          <Route path="/finished">
            {() => (
              <div>
                <h1>Finished Reading Page</h1>
              </div>
            )}
          </Route>
          <Route exact path="/">
            {() => (
              <div>
                <h1>Landing Page</h1>
              </div>
            )}
          </Route>
          <Route>
            {() => (
              <div>
                <h1>404 Page</h1>
              </div>
            )}
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
