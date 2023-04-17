import { Box, Container, CircularProgress, List, ListItem, Typography } from '@mui/material';
import axios from 'axios';
import { NextPage } from 'next';
import React from 'react';

import createAxiosInstance from 'client/lib/axios';

//TODO: Type users once sequelize-typescript is added
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Directory: NextPage<{ users: any[]; error: string }> = props => {
  const { users, error } = props;
  const lastCardRef = React.useRef(null);
  const [userData, setUserData] = React.useState(users);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(999);
  const [isLoading, setIsLoading] = React.useState(false);

  async function fetchUsers(page: number) {
    try {
      const response = await axios.get(`/api/users?page=${page}`);
      return {
        page: response.data.page,
        total: response.data.totalPages,
        users: response.data.users,
      };
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    const intersectionOptions = {
      // root default = document's viewport
      // in the future offset should be tied to the card height of the last row
      rootMargin: '0px',
      threshold: 0,
    };

    const lastCardObserver = new IntersectionObserver(async ([lastCard]) => {
      // guard clause, should intersect only once
      if (!lastCard.isIntersecting) return;
      lastCardObserver.disconnect();
      setIsLoading(true);
      try {
        // stop loading users when at max pages
        if (currentPage + 1 > totalPages) {
          setIsLoading(false);
          return;
        }
        const { page, total, users } = await fetchUsers(currentPage + 1);
        setCurrentPage(page);
        setTotalPages(total);
        setUserData([...userData, ...users]);
      } catch (err) {
        console.error(err);
      }
    }, intersectionOptions);

    setIsLoading(false);
    lastCardObserver.observe(lastCardRef.current);
  }, [userData]);

  return (
    <Container maxWidth="lg" className="pt-4">
      <Box className="pt-4">
        <Typography variant="h2" className="text-2xl">
          Users:
        </Typography>
        <Box>
          {error && <Typography>{error}</Typography>}
          <List>
            {userData.map((user, i) => {
              return (
                <ListItem
                  key={user.id}
                  sx={{ height: '100px' }}
                  ref={i === userData.length - 1 ? lastCardRef : null}
                >
                  {user.discord_name}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
      {isLoading ? <CircularProgress /> : null}
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
