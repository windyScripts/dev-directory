import { Box, Container, List, ListItem, Typography } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

import createAxiosInstance from 'client/lib/axios';

//TODO: Type users once sequelize-typescript is added
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Directory: NextPage<{ users: any[] }> = props => {
  const { users } = props;

  return (
    <Container maxWidth="lg" className="pt-4">
      <Box className="pt-4">
        <Typography variant="h2" className="text-2xl">
          Users:
        </Typography>
        <Box>
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
  const axios = createAxiosInstance(req);
  const response = await axios.get('/api/users');
  const users = response.data.users;

  try {
    return { users };
  } catch (error) {
    return { users };
  }
};

export default Directory;
