import React, { Component } from "react";
import PropTypes from "prop-types";
import MonkeyIcon from "../img/apeFace.jpg";
import axios from "axios";
import { Link } from "react-router-dom";

// MUI Stuff
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({ ...theme.styles });

export class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      handle: "",
      loading: false,
      errors: {}
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle
    };
    axios
      .post("signup", newUserData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        this.props.history.push("/");
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { errors, loading } = this.state;
    const { classes } = this.props;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img
            width="80px"
            height="80px"
            src={MonkeyIcon}
            alt="Monkey Icon"
            className={classes.image}
          />
          <Typography variant="h2" className={classes.pageTitle}>
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              helperText={errors.email}
              error={errors.email ? true : false}
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
              autoComplete="off"
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              helperText={errors.password}
              error={errors.password ? true : false}
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="confirmPassword"
              helperText={errors.password}
              error={errors.password ? true : false}
              className={classes.textField}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="handle"
              name="handle"
              type="text"
              label="Handle"
              helperText={errors.handle}
              error={errors.handle ? true : false}
              className={classes.textField}
              value={this.state.handle}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              You already have an account? Login <Link to="/login">here</Link>.
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(signup);
