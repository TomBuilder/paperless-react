import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Button, IconButton, Typography, Tooltip,
} from '@material-ui/core';
import { PublishRounded, AccountCircle, Settings } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  iconButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const NavigationBar: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" className={classes.title} onClick={() => { history.push('/'); }}>
            Paperless
          </Typography>
          <Tooltip title="Dokument hochladen">
            <IconButton edge="start" className={classes.iconButton} color="inherit" aria-label="upload">
              <PublishRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Einstellungen">
            <IconButton
              edge="start"
              className={classes.iconButton}
              color="inherit"
              aria-label="settings"
              onClick={() => { history.push('settings'); }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip title="Benutzerkonto">
            <IconButton
              edge="start"
              className={classes.iconButton}
              color="inherit"
              aria-label="account"
              onClick={() => { history.push('account'); }}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Tooltip title="Anmeldung">
            <Button color="inherit">Login</Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationBar;
