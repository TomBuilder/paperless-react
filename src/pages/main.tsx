import * as React from 'react';
import { Snackbar, Box, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import axios from 'axios';
import Mailbox from '../components/mailbox';
import { useDrop } from 'react-dnd'
import update from 'immutability-helper'

const useStyles = makeStyles((theme) => ({
  mailboxes: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap'
  }
})
);

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
  const classes = useStyles();

  const [postboxes, setPostboxes] = React.useState<PostboxItem[]>([]);
  const [inbox, setInbox] = React.useState<PostboxItem>({
    id:'0', name:'?', description:'nicht definiert',
    type:PostboxType.Input, docCount:0, lastUser:'?', lastAccess:new Date()
  });
  const [personalBox, setPersonalBox] = React.useState<PostboxItem>({
    id:'1', name:'?', description:'nicht definiert',
    type:PostboxType.Personal, docCount:0, lastUser:'?', lastAccess:new Date()
  });
  const [confidentialBox, setConfidentialBox] = React.useState<PostboxItem>({
    id:'2', name:'?', description:'nicht definiert',
    type:PostboxType.Confidential, docCount:0, lastUser:'?', lastAccess:new Date()
  });
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const url = 'https://localhost:5001/';

  const getAllPostboxes = async () => {
    try {
      const response = await axios.get(`${url}postboxes`)
      const boxes: PostboxItem[] = response.data;
      setPostboxes(boxes.filter(pb => pb.type === PostboxType.General));
      setInbox(boxes[boxes.findIndex(pb => pb.type === PostboxType.Input)])
      setPersonalBox(boxes[boxes.findIndex(pb => pb.type === PostboxType.Personal)])
      setConfidentialBox(boxes[boxes.findIndex(pb => pb.type === PostboxType.Confidential)])
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

  const findCard = React.useCallback(
    (id: string) => {
      const card = postboxes.filter((c) => `${c.id}` === id)[0]
      return {
        card,
        index: postboxes.indexOf(card),
      }
    },
    [postboxes],
  )

  if (loaded) {
    return (
      <div>
        <Box display='flex'>
          <Box flexGrow='1'>
            <Mailbox
              key={inbox.id}
              id={inbox.id}
              title={inbox.name}
              description={inbox.description}
              waitingDocs={inbox.docCount}
              lastAccess={new Date(inbox.lastAccess)}
            />
          </Box>
          <Mailbox
            key={personalBox.id}
            id={personalBox.id}
            title={personalBox.name}
            description={personalBox.description}
            waitingDocs={personalBox.docCount}
            lastAccess={new Date(personalBox.lastAccess)}
          />
          <Mailbox
            key={confidentialBox.id}
            id={confidentialBox.id}
            title={confidentialBox.name}
            description={confidentialBox.description}
            waitingDocs={confidentialBox.docCount}
            lastAccess={new Date(confidentialBox.lastAccess)}
          />
        </Box>
        <Box display="flex" flexWrap="wrap">
          {
            postboxes.map((postBoxItem: PostboxItem) =>
              <Mailbox
                key={postBoxItem.id}
                id={postBoxItem.id}
                title={postBoxItem.name}
                description={postBoxItem.description}
                waitingDocs={postBoxItem.docCount}
                lastAccess={new Date(postBoxItem.lastAccess)} />)
          }
        </Box>
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
