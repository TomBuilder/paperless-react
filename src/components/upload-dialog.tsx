import * as React from 'react'
import { createStyles, Theme, withStyles, WithStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton, Typography, Button, Dialog, Tooltip } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Close, PublishRounded } from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      width: 500,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginRight: theme.spacing(2),
  },
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
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const UploadDialog = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.currentTarget?.files;
    alert(file);
  }
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
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Import-Dokument auswählen
        </DialogTitle>
        <DialogContent dividers>
          <input
            style={{ display: 'none' }}
            id="upload-file"
            type="file"
            onChange={(event) => { handleFiles(event) }}
          />
          <label htmlFor="upload-file">
            <Button variant='outlined' component="span">
              Auswählen
            </Button>
            
          </label>
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