import * as React from 'react';
import axios from 'axios';
import { Snackbar } from '@material-ui/core';
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

type TParams = { id: string };

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DocumentList = ({ id }: TParams) => {
  const [doclist, setDoclist] = React.useState<DocumentItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const url = 'https://localhost:5001/';

  const getAllDocuments = async () => {
    try {
      const response = await axios.get(`${url}documents?searchstring=postboxid[eq]${id}`)
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

  if (loaded) {
    return (
      <div> {
        doclist.map((docItem: DocumentItem) =>
          <div>Detail-Ansicht {docItem.title}</div>
        )}
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
