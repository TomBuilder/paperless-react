import * as React from 'react';
import { Snackbar, Button, IconButton } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import axios from 'axios';
import Mailbox from '../components/mailbox';

enum PostboxType {
  General = 0,
  Input = 1,
  Personal = 2,
  Confidential = 3
}

type PostboxItem = {
  id: string,
  name: string,
  type: PostboxType,
  description: string,
  lastAccess: Date,
  lastUser: string,
  docCount: number
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MainPage: React.FC = () => {
  const [postboxes, setPostboxes] = React.useState<PostboxItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const url = 'https://localhost:5001/';

  const getAllPostboxes = async () => {
    try {
      const response = await axios.get(`${url}postboxes`)
      setPostboxes(response.data);
      setLoaded(true);
    } catch {
      setError(true);
    }
  }

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  React.useEffect(() => {
    getAllPostboxes();
    console.log('load');

  }, []);

  if (loaded) {
    return (
      <div>
        {
          postboxes.map((postBoxItem: PostboxItem) =>
            <Mailbox
              key={postBoxItem.id}
              id={postBoxItem.id}
              title={postBoxItem.name}
              descripton={postBoxItem.description}
              waitingDocs={postBoxItem.docCount}
              lastAccess={new Date(postBoxItem.lastAccess)} />)
        }
      </div>
    );
  } else {
    return (
      <div>
        <h1>Daten werden geladen...</h1>
        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            Fehler beim Laden der Daten!
        </Alert>
        </Snackbar>
      </div>
    )
  }
};
export default MainPage;
