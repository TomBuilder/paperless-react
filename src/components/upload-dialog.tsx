import * as React from 'react';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  makeStyles
} from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  Button,
  Dialog,
  Tooltip,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Close, PublishRounded } from '@material-ui/icons';
import axios from 'axios';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      width: 500
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginRight: theme.spacing(2)
  },
  inputRow: {
    display: 'flex'
  },
  selectRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  inputButton: {
    marginTop: theme.spacing(1)
  },
  input: {
    marginLeft: theme.spacing(1),
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220
  }
}));

type DocumentType = {
  id: string;
  name: string;
  targetPostboxes: string[];
};

type DocumentItem = {
  title: string;
  typeId: string;
  fileName: string;
  postboxId: string;
  state: number;
};

type PostboxItem = {
  id: string;
  name: string;
};

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const url = 'https://localhost:5001/';

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const UploadDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [filedata, setFiledata] = React.useState<FileList | null>(null);
  const [filename, setFilename] = React.useState('');
  const [doctypes, setDoctypes] = React.useState<DocumentType[]>([]);
  const [aktDoctype, setDoctype] = React.useState<DocumentType>({
    id: '',
    name: '',
    targetPostboxes: []
  });
  const [postboxes, setPostboxes] = React.useState<PostboxItem[]>([]);
  let aktPostbox: PostboxItem = { id: '', name: '' };

  const classes = useStyles();

  React.useEffect(() => {
    getAllDoctypes();
  }, [open]);

  const getAllDoctypes = async () => {
    if (doctypes.length < 1) {
      const responseTypes = await axios.get(`${url}documents/types`);
      setDoctypes(responseTypes.data);
      setDoctype(responseTypes.data[0]);
      const responseBoxes = await axios.get(`${url}postboxes`);
      setPostboxes(responseBoxes.data);
      aktPostbox = responseBoxes.data[0];
    }
  };

  const handleClickOpen = () => {
    setFilename('Dateiname');
    setFiledata(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = async () => {
    if (filedata) {
      let docItem: DocumentItem = {
        title: filename,
        fileName: filename,
        typeId: aktDoctype.id,
        postboxId: aktPostbox.id,
        state: 0
      };
      let createResponse = await axios.post(`${url}documents`, docItem);
      if (createResponse.status === 201) {
        let data = new FormData();
        data.append('file', filedata[0]);
        await axios.post(
          `${url}documents/${createResponse.data.id}/content`,
          data
        );
      }
    }
    handleClose();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.currentTarget?.files;
    setFiledata(file);
    if (file) {
      setFilename(file[0].name);
    }
  };

  const handleTypeChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (event?.target?.value) {
      const doctype = doctypes.find((d) => d.id === event.target.value);
      setDoctype(doctype ? doctype : { id: '', name: '', targetPostboxes: [] });
    }
  };

  const handleBoxChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (event?.target?.value) {
      const postbox = postboxes.find((p) => p.id === event.target.value);
      aktPostbox = postbox ? postbox : { id: '', name: '' };
    }
  };

  let visiblePostboxes: PostboxItem[] = [];
  const calculateVisiblePostboxes = () => {
    if (aktDoctype) {
      for (let boxid of aktDoctype.targetPostboxes) {
        const box = postboxes.find((p) => p.id === boxid);
        if (box) {
          visiblePostboxes.push(box);
        }
      }
      if (visiblePostboxes.length > 0) {
        aktPostbox = visiblePostboxes[0];
      }
    }
  };
  calculateVisiblePostboxes();

  return (
    <div>
      <Tooltip title="Dokument hochladen">
        <IconButton
          edge="start"
          className={classes.iconButton}
          color="inherit"
          aria-label="upload"
          onClick={handleClickOpen}
        >
          <PublishRounded />
        </IconButton>
      </Tooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Import-Dokument auswählen
        </DialogTitle>
        <DialogContent dividers>
          <Box className={classes.inputRow}>
            <div>
              <input
                style={{ display: 'none' }}
                id="upload-file"
                type="file"
                onChange={(event) => {
                  handleFiles(event);
                }}
              />
              <label htmlFor="upload-file">
                <Button
                  variant="outlined"
                  component="span"
                  className={classes.inputButton}
                >
                  Auswählen
                </Button>
              </label>
            </div>
            <TextField
              label={filename}
              variant="filled"
              className={classes.input}
            />
          </Box>
          <Box className={classes.selectRow}>
            <FormControl className={classes.formControl}>
              <InputLabel>Dokument-Typ</InputLabel>
              <Select
                labelId="select-doctype-label"
                id="select-doctype"
                value={aktDoctype.id}
                onChange={(event) => {
                  handleTypeChange(event);
                }}
              >
                {doctypes.map((docItem) => (
                  <MenuItem key={docItem.id} value={docItem.id}>
                    {docItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>Postfach</InputLabel>
              <Select
                labelId="select-mailbox-label"
                id="select-mailbox"
                value={aktPostbox.id}
                onChange={handleBoxChange}
              >
                {visiblePostboxes.map((postbox) => (
                  <MenuItem key={postbox.id} value={postbox.id}>
                    {postbox.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleUpload} color="primary">
            importieren
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadDialog;
