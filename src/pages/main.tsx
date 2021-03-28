import * as React from 'react';
import Mailbox from '../components/mailbox';

const MainPage: React.FC = () => (
  <div>
    <h1>Das Hauptfenster</h1>
    <Mailbox id="1" title="IT" descripton="Informatik Abteilung 1 asdfasdf asd fasdf asdf asdf" waitingDocs={12} lastAccess={new Date('03/25/2021')} />
  </div>
);
export default MainPage;
