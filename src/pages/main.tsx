import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

type Props = RouteComponentProps;

const MainPage: React.FC<Props> = () => (
  <div>
    <h1>Das Hauptfenster</h1>
  </div>
);
export default withRouter(MainPage);
