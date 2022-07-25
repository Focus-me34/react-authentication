import { Fragment } from 'react';

import MainNavigation from './MainNavigation';

const Layout = (props) => {
  return (
    <Fragment>
      <MainNavigation logoutUser={props.logoutUser}/>
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
