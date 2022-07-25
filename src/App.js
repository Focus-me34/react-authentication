import { Switch, Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';

import AuthContext from './contexts/auth-ctx';
import Layout from './components/Layout/Layout';
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>

        {!isLoggedIn && <Route path='/auth'>
          <AuthPage />
        </Route>}

        <Route path='/profile'>
          {isLoggedIn && <ProfilePage />}
          {!isLoggedIn && <Redirect to="/auth"/>}
        </Route>

        <Route path="*">
          <Redirect to="/"></Redirect>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
