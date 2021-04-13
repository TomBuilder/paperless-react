import * as React from 'react';
import axios from 'axios';
import { Snackbar, List, ListItem, ListItemText } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

type DocumentItem = {
  id: string,
  title: string,
  fileName: string,
  postboxId: string,
  state: number,
  typeId: string,
  lastUser: string,
  lastAccess: Date,
}

type TParams = { id: string, docidChanged: (docid: string, filename: string) => void };

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DocumentList = ({ id, docidChanged }: TParams) => {
  const [doclist, setDoclist] = React.useState<DocumentItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const getAllDocuments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}documents?searchstring=postboxid[eq]${id}`)
      setDoclist(response.data);
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
    getAllDocuments();
  }, []);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    docidChanged(doclist[index].id, doclist[index].fileName);
  };

  if (loaded) {
    return (
      <div>
        <List>{
          doclist.map((docItem: DocumentItem, index: number) =>
            <ListItem button key={docItem.id} selected={selectedIndex === index} onClick={(event) => handleListItemClick(event, index)}>
              <ListItemText primary={docItem.title} />
            </ListItem>
          )}
        </List>
      </div>
    )
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
}

export default DocumentList;
