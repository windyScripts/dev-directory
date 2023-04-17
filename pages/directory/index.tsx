import { Avatar, Box, Container, Grid, List, ListItem, Typography } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

import createAxiosInstance from 'client/lib/axios';

//TODO: Type users once sequelize-typescript is added
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Directory: NextPage<{ users: any[]; error: string }> = props => {
  const { users, error } = props;

  return (
    <Container maxWidth="lg" className="pt-4">
      <Box className="pt-4">
        <Typography variant="h2" className="text-2xl">
          Users:
        </Typography>
        <Box>
          {error && <Typography>{error}</Typography>}
          <List>
            {users.map(user => {
              return (
                <ListItem key={user.id}>
                  <ProfileCard user={user} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </Container>
  );
};

// this is a copy of UserObject in server\types\User.ts (temporary fix)
interface UserObj {
  id: number;
  discord_user_id: string;
  discord_name: string;
  bio: string;
  twitter_username: string;
  linkedin_url: string;
  github_username: string;
  website: string;
}

//TODO: fix types later
const ProfileCard: React.FC<{ user: UserObj }> = props => {
  const { user } = props;
  // grid inspired by https://mui.com/material-ui/react-grid/#complex-grid
  return (
    <Box
      sx={{
        backgroundColor: 'hsla(0, 0%, 85%, 1)',
        padding: '16px 25px',
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <Avatar sx={{ width: 67, height: 67 }}>{user.discord_name.slice(0, 1)}</Avatar>
        </Grid>
        <Grid item container xs sm direction="column">
          <Grid item xs>
            <Typography variant="subtitle1">{user.discord_name}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1">Somewhere</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="body1">{user.bio}</Typography>
    </Box>
  );
};

Directory.getInitialProps = async ({ req }) => {
  try {
    const axios = createAxiosInstance(req);
    const response = await axios.get('/api/users');
    const users = response.data.users;

    return { users, error: null };
  } catch (error) {
    return { users: [], error: error.message };
  }
};

export default Directory;
