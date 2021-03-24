import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PublishIcon from '@material-ui/icons/PublishRounded';
import AccountIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';

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
              <PublishIcon />
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
              <SettingsIcon />
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
              <AccountIcon />
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
