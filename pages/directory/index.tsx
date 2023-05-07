import { Box, Container, List, ListItem, Typography } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

import createAxiosInstance from 'client/lib/axios';
import { ClientUser } from 'shared/User';

const Directory: NextPage<{ users: ClientUser[]; error: string }> = props => {
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
            {users.map(user => (
              <ListItem key={user.id}>{user.discord_name}</ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
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
