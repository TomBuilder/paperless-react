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
    minWidth: 220,
  }
}));

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

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
  const [doctype, setDoctype] = React.useState<unknown>('Typ 1');
  const [mailbox, setMailbox] = React.useState<unknown>('Fach 1');

  const classes = useStyles();

  const handleClickOpen = () => {
    setFilename('Dateiname');
    setFiledata(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
    if(event?.target?.value) {
    setDoctype(event.target.value);
    }
  };

  const handleBoxChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if(event?.target?.value) {
    setMailbox(event.target.value);
    }
  };

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
              <InputLabel id="demo-simple-select-helper-label">
                Dokument-Typ
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={doctype}
                onChange={(event) => {
                  handleTypeChange(event);
                }}
              >
                <MenuItem value={'Typ 1'}>Typ 1</MenuItem>
                <MenuItem value={'Typ 2'}>Typ 2</MenuItem>
                <MenuItem value={'Typ 2'}>Typ 3</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-helper-label">
                Dokument-Typ
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={mailbox}
                onChange={handleBoxChange}
              >
                <MenuItem value={'Fach 1'}>Fach 1</MenuItem>
                <MenuItem value={'Fach 2'}>Fach 2</MenuItem>
                <MenuItem value={'Fach 2'}>Fach 3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            importieren
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadDialog;
