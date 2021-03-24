import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavigationBar from './components/navigation-bar';
import MainPage from './pages/main';
import BasketDetailPage from './pages/basket-detail';
import SettingPage from './pages/settings';
import AccountPage from './pages/account';

const App: React.FC = () => (
  <div className="App">
    <BrowserRouter>
      <NavigationBar />
      <Switch>
        <Route path="/details/:id">
          <BasketDetailPage />
        </Route>
        <Route path="/settings">
          <SettingPage />
        </Route>
        <Route path="/account">
          <AccountPage />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </BrowserRouter>
  </div>
);
export default App;
