import PersonIcon from '@mui/icons-material/Person';
import { Box, Container, CircularProgress, List, ListItem, Typography, Card, Avatar, Link } from '@mui/material';
import axios from 'axios';
import { NextPage } from 'next';
import * as React from 'react';

import ErrorToast from 'client/components/ErrorToast';
import createAxiosInstance from 'client/lib/axios';
import { ClientUser } from 'shared/User';

import Githubicon from '../../public/GithubIcon';
import LinkedinIcon from '../../public/LinkedinIcon';
import Twittericon from '../../public/TwitterIcon';
import Websiteicon from '../../public/WebsiteIcon';

const Directory: NextPage<{ users: ClientUser[]; totalPages: number; error: string }> = props => {
  const { users, totalPages, error } = props;
  const lastCardRef = React.useRef(null);
  const [userData, setUserData] = React.useState(users);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPageNum, setTotalPageNum] = React.useState(totalPages);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  async function fetchUsers(page: number) {
    try {
      const response = await axios.get(`/api/users?page=${page}`);
      return {
        page: response.data.page,
        total: response.data.totalPages,
        users: response.data.users,
      };
    } catch (err) {
      if (err.code === 'ERR_BAD_REQUEST') {
        throw new Error('Page out of range', { cause: err.message });
      } else {
        throw err;
      }
    }
  }

  React.useEffect(() => {
    if (!document.querySelector('#last-card')) return;

    const height = getElementHeight(document.querySelector('#last-card'));

    function getElementHeight(el: HTMLElement) {
      const rect = el.getBoundingClientRect();
      const { marginTop, marginBottom } = getComputedStyle(el);
      return rect.height + parseFloat(marginTop) + parseFloat(marginBottom);
    }

    const intersectionOptions = {
      // root default = document's viewport
      rootMargin: `${height}px`,
      threshold: 0,
    };

    const lastCardObserver = new IntersectionObserver(async ([lastCard]) => {
      // guard clause, On mount intersection triggers w/ false, should intersect only once
      if (!lastCard.isIntersecting) return;

      lastCardObserver.disconnect();
      // stop loading users when at max pages before fetching next page
      if (currentPage + 1 > totalPageNum) {
        return;
      }
      setIsLoading(true);
      try {
        const { page, total, users } = await fetchUsers(currentPage + 1);
        setCurrentPage(page);
        setTotalPageNum(total);
        setUserData([...userData, ...users]);
      } catch (err) {
        setErrorMessage(err.message);
        setShowError(true);
      }
      setIsLoading(false);
    }, intersectionOptions);

    lastCardObserver.observe(lastCardRef.current);
  }, [userData]);

  const getShortenedBio = (bio:string, maxLength = 30) => {
    if (bio.length < maxLength) return bio;
    let i = maxLength;
    while (bio[i] !== ' ' && i > 0) i--;
    // if the first word is longer than the permissible length, what should be done?
    if (i === 0) return bio.slice(0, maxLength) + '...';
    else return bio.slice(0, i) + '...';
  };

  const getUserSocials = (user:ClientUser) => {
    const socials =  [user.website, user.linkedin_url, user.github_username, user.twitter_username];
    const socialsIcons = [<Websiteicon />, <LinkedinIcon />, <Githubicon />, <Twittericon />];
    const twoRelevantSocials = [];
    for (let i = 0; i < socials.length; i++) {
      if (socials[i] && twoRelevantSocials.length < 2) {
        twoRelevantSocials.push({ url: socials[i], icon: socialsIcons[i] });
      }
    }
    return twoRelevantSocials;
  };
  return (
    <Container maxWidth="lg" className="pt-4">
      <ErrorToast open={showError} setOpen={setShowError} message={errorMessage} />
      <Box className="pt-4">
        <Typography variant="h2" className="text-2xl">
          Users:
        </Typography>
        <Box>
          {error && <Typography>{error}</Typography>}
          <List data-cy="user-container">
            {userData.map((user, i) => {
              return (
                <ListItem
                  key={user.id}
                  sx={{ height: '100px' }}
                  ref={i === userData.length - 1 ? lastCardRef : null}
                  id={i === userData.length - 1 ? 'last-card' : null}
                >
                  <Card>
                    <Box maxWidth="lg">
                      <Box>
                        {user.discord_avatar ?
                          <Avatar alt={user.discord_name} src={user.discord_avatar} />
                          : <PersonIcon />}
                        <Box>
                          {getUserSocials(user).map(social => <Link href={social.url} target='_blank'>
                            {social.icon}
                          </Link>)}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body1">{user.discord_name}</Typography>
                        <Typography variant="body1">{getShortenedBio(user.bio) }</Typography>
                      </Box>
                    </Box>
                  </Card>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
      {isLoading ? <CircularProgress data-cy="loading" /> : null}
    </Container>
  );
};

Directory.getInitialProps = async ({ req }) => {
  try {
    const axios = createAxiosInstance(req);
    const response = await axios.get('/api/users');
    const { users, totalPages } = response.data;

    return { users, totalPages, error: null };
  } catch (error) {
    return { users: [], totalPages: 1, error: error.message };
  }
};

export default Directory;
