import * as React from 'react';
import { Paper, Box, Typography, Chip, Tooltip } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(24),
      height: theme.spacing(17),
      overflow: 'hidden'
    },
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `3px solid`,
    borderColor: theme.palette.primary.light,
  },
  stack: {
    height: theme.spacing(15)
  },
  header: {
    display: 'flex',
    height: theme.spacing(4)
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  description: {
    height: theme.spacing(6),
  },
  multiLineEllipsis: {
    overflow: 'hidden',
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical"
  },
  lastAccess: {
    height: theme.spacing(3),
    paddingTop: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    borderTop: '2px solid',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center'
  },
})
);

interface Props {
  id: string;
  title: string;
  descripton: string;
  waitingDocs: number;
  lastAccess: Date;
}

const Mailbox: React.FC<Props> = (props) => {
  const classes = useStyles();

  let footertext = 'heute';
  let borderColor = useTheme().palette.primary.light;
  const diffDays = Math.round(Math.abs(Date.now() - props.lastAccess.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) {
    footertext = 'gestern';
  } else if (diffDays > 1) {
    footertext = `Vor ${diffDays} Tagen`;
  }
  if (diffDays > 2) {
    borderColor = useTheme().palette.warning.light;
  } else if (diffDays > 5) {
    borderColor = useTheme().palette.error.light;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={5}>
        <Box p={1} className={classes.stack}>
          <div className={classes.header}>
            <Tooltip title="Name des Postfachs" placement="bottom">
              <Typography variant="h5" className={classes.title}>{props.title}</Typography>
            </Tooltip>
            <Tooltip title="Anzahl Dokumente" placement="bottom">
              <Chip label={props.waitingDocs} />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Beschreibung" placement="bottom">
              <Typography variant="body1" className={`${classes.multiLineEllipsis} ${classes.description}`}>{props.descripton}</Typography>
            </ Tooltip>
          </div>
          <div >
            <Tooltip title="Letzter Zugriff" placement="bottom">
              <Typography style={{ borderColor }} variant="body1" className={classes.lastAccess}>{footertext}</Typography>
            </Tooltip>
          </div>
        </Box>
      </Paper>
    </div>
  );
};

export default Mailbox;
