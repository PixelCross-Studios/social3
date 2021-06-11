import React from 'react';

import {
  Grid, Typography, TextField, IconButton, Container
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

export default function Navigation() {
  return (
    <Container style={{ padding: 0 }}>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        style={{
          backgroundColor: 'navy', height: 80, padding: 10, margin: 0
        }}
      >
        <Typography variant="h3" style={{ color: 'white' }}>Logo</Typography>
        <Grid item>
          <Grid container direction="row" alignItems="center">
            <TextField style={{ color: 'white' }} />
            <IconButton aria-label="search">
              <SearchIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ height: 40 }} justify="center" alignItems="baseline">
        <Typography variant="subtitle2">Important information</Typography>
      </Grid>
    </Container>
  );
}
