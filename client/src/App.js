import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <header>
        <h1>Header Placeholder</h1>
        <nav>
          <ul>
            <li>
              <Link to="/search">search</Link>
            </li>
            <li>
              <Link to="/list">list</Link>
            </li>
            <li>
              <Link to="/finished">finished</Link>
            </li>
          </ul>
        </nav>
      </header>
      <Switch>
        <Route path="/search">
          {() => (
            <div>
              <h1>Search Page</h1>
            </div>
          )}
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
    </Router>
  );
}

export default App;
