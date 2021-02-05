import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Cloud from '@material-ui/icons/Cloud';
import Avatar from '@material-ui/core/Avatar';

import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import SvgIcon from '@material-ui/core/SvgIcon';

import { useHistory, useLocation } from 'react-router-dom';

import { colors } from 'styles';

import Loader from 'components/loader';

import { weatherService } from 'services';
import Connector from 'utils/Connector';
import { Popup } from 'utils/SnackbarUtil';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: 10
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
		fontSize: 14
	},
	media: {
		height: 140,
		paddingTop: '56.25%' // 16:9
	},
	pos: {
		marginBottom: 12
	}
}));

const styles = (theme) => ({
	root: {
		margin: 0,
		minWidth: 100,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
		width: 400
	}
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1)
	}
}))(MuiDialogActions);

export default function Countries() {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();

	const { countriesData } = location.state || {};

	if (!countriesData) history.push('/');

	const [ isLoading, setIsLoading ] = React.useState(false);
	const [ capital, setCapital ] = React.useState('');
	const [ weatherData, setWeatherData ] = React.useState({});
	const [ open, setOpen ] = React.useState(false);

	const Transition = React.forwardRef(function Transition(props, ref) {
		return <Slide direction="up" ref={ref} {...props} />;
	});

	function handleOpen(capital) {
		setCapital(capital);
		setOpen(true);
	}
	function handleClose() {
		setOpen(false);
	}

	function handler(capital) {
		handleOpen(capital);
		setIsLoading(true);
		weatherService.getWeather(capital).then(setWeatherData).catch(Popup.error).finally(() => setIsLoading(false));
	}

	return (
		<div>
			<Grid container component="main" className={classes.root}>
				{countriesData &&
					countriesData.map((country, index) => {
						return (
							<Grid item xs={3} sm={3}>
								<Card style={{ margin: 20 }} className={classes.root}>
									<CardHeader title={country.name} />
									<CardMedia className={classes.media} image={country.flag} title={country.name} />
									<CardContent>
										<Typography variant="body2" color="textSecondary" component="p">
											Population - {country.population}
										</Typography>
										<Typography variant="body2" color="textSecondary" component="p">
											Latitude & Longitude - {country.latlng}
										</Typography>
									</CardContent>
									<CardActions>
										<IconButton onClick={() => handler(country.capital)} aria-label="weather">
											<Cloud />
										</IconButton>
									</CardActions>
								</Card>
							</Grid>
						);
					})}
			</Grid>
			{open && (
				<Dialog
					open={open}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleClose}
					aria-labelledby="alert-dialog-slide-title"
					aria-describedby="alert-dialog-slide-description"
				>
					{isLoading ? (
						<Loader size={20} color="black" />
					) : (
						<div>
							<DialogTitle id="alert-dialog-slide-title">{capital}</DialogTitle>
							<DialogContent>
								<Avatar alt={weatherData.capital} src={weatherData.weather_icons} />
								<DialogContentText id="alert-dialog-slide-description">
									<p>Temperature - {weatherData.temperature}</p>
									<p>Wind Speed - {weatherData.wind_speed}</p>
									<p>Precip - {weatherData.precip}</p>
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} color="primary">
									Close
								</Button>
							</DialogActions>
						</div>
					)}
				</Dialog>
			)}
		</div>
	);
}
