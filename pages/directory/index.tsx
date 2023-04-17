import {
  Avatar,
  Box,
  Container,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { NextPage } from 'next';
import React from 'react';

import createAxiosInstance from 'client/lib/axios';

//TODO: Type users once sequelize-typescript is added
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Directory: NextPage<{ users: any[]; error: string }> = props => {
  const { users, error } = props;
  const lastCardRef = React.useRef(null);
  const [data, setData] = React.useState(users);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(999);
  const [isLoading, setIsLoading] = React.useState(false);

  async function fetchUsers(page) {
    // const axios = createAxiosInstance(req);
    try {
      const response = await axios.get(`/api/users?page=${page}`);
      console.log(response);
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
    setIsLoading(true); // needs tied to the observer

    //  without options the observer uses the document's viewport as the root, with no margin, and a 0% threshold
    const intersectionOptions = {
      // root default = document's viewport
      // in the future should be tied to the card height of the last row
      rootMargin: '300px',
      threshold: 0,
    };

    const lastCardObserver = new IntersectionObserver(async ([lastCard]) => {
      // guard clause, should intersect only once
      if (!lastCard.isIntersecting) return;

      console.log('triggered');
      try {
        // stop loading users when at max pages
        if (currentPage + 1 > totalPages) return;
        const { page, total, users } = await fetchUsers(currentPage + 1);
        setCurrentPage(page);
        setTotalPages(total);
        setData([...data, ...users]);
      } catch (err) {
        console.error(err);
      }
      lastCardObserver.unobserve(lastCard.target);
    }, intersectionOptions);

    lastCardObserver.observe(lastCardRef.current);
  }, [data]);

  const generateUserCards = users => {
    const totalCards = users.length;
    return (
      <List>
        {users.map((user, i) => {
          return (
            <ListItem key={user.id} ref={i === totalCards - 1 ? lastCardRef : null}>
              <ProfileCard user={user} />
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" className="pt-4">
      <Box className="pt-4">
        <Typography variant="h2" className="text-2xl">
          Users:
        </Typography>
        <Box>
          {error && <Typography>{error}</Typography>}
          {generateUserCards(data)}
          {/* <List>
            {users.map(user => {
              return (
                <ListItem key={user.id}>
                  <ProfileCard user={user} />
                </ListItem>
              );
            })}
          </List> */}
        </Box>
      </Box>
      {isLoading ? <CircularProgress /> : null}
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
