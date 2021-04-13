import * as React from 'react';
import { Snackbar, Box } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import axios from 'axios';
import Mailbox from '../components/mailbox';
import { useDrop } from 'react-dnd'
import update from 'immutability-helper'
import { ItemTypes } from '../itemTypes'

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
  const [inbox, setInbox] = React.useState<PostboxItem>({
    id: '0', name: '?', description: 'nicht definiert',
    type: PostboxType.Input, docCount: 0, lastUser: '?', lastAccess: new Date()
  });
  const [personalBox, setPersonalBox] = React.useState<PostboxItem>({
    id: '1', name: '?', description: 'nicht definiert',
    type: PostboxType.Personal, docCount: 0, lastUser: '?', lastAccess: new Date()
  });
  const [confidentialBox, setConfidentialBox] = React.useState<PostboxItem>({
    id: '2', name: '?', description: 'nicht definiert',
    type: PostboxType.Confidential, docCount: 0, lastUser: '?', lastAccess: new Date()
  });
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  
  const getAllPostboxes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}postboxes`)
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

  const findBox = React.useCallback(
    (id: string) => {
      const box = postboxes.filter((c) => `${c.id}` === id)[0]
      return {
        box,
        index: postboxes.indexOf(box),
      }
    },
    [postboxes],
  )

  const moveBox = React.useCallback(
    (id: string, atIndex: number) => {
      const { box, index } = findBox(id)
      setPostboxes(
        update(postboxes, {
          $splice: [
            [index, 1],
            [atIndex, 0, box],
          ],
        }),
      )
    },
    [findBox, postboxes, setPostboxes],
  )

  const [, drop] = useDrop(() => ({ accept: ItemTypes.MAILBOX }))
  if (loaded) {
    return (
      <div>
        <Box display='flex'>
          <Box flexGrow='1'>
            <Mailbox
              id={inbox.id}
              title={inbox.name}
              description={inbox.description}
              waitingDocs={inbox.docCount}
              lastAccess={new Date(inbox.lastAccess)}
              findBox={findBox}
              moveBox={moveBox}
            />
          </Box>
          <Mailbox
            id={personalBox.id}
            title={personalBox.name}
            description={personalBox.description}
            waitingDocs={personalBox.docCount}
            lastAccess={new Date(personalBox.lastAccess)}
            findBox={findBox}
            moveBox={moveBox}
          />
          <Mailbox
            id={confidentialBox.id}
            title={confidentialBox.name}
            description={confidentialBox.description}
            waitingDocs={confidentialBox.docCount}
            lastAccess={new Date(confidentialBox.lastAccess)}
            findBox={findBox}
            moveBox={moveBox}
          />
        </Box>
        <div ref={drop}>
          <Box display="flex" flexWrap="wrap" >
            {
              postboxes.map((postBoxItem: PostboxItem) =>
                <Mailbox
                  key={postBoxItem.id}
                  id={postBoxItem.id}
                  title={postBoxItem.name}
                  description={postBoxItem.description}
                  waitingDocs={postBoxItem.docCount}
                  lastAccess={new Date(postBoxItem.lastAccess)}
                  moveBox={moveBox}
                  findBox={findBox} />)
            }
          </Box>
        </div>
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
