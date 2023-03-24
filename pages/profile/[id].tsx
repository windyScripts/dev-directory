import GitHubIcon from '@mui/icons-material/GitHub';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Container, Box, ListItemIcon, ListItemButton, List, Typography } from '@mui/material';
import { NextPage, NextPageContext } from 'next';
import ErrorPage from 'next/error';
import React from 'react';

import createAxiosInstance from 'client/lib/axios';
import { UserProfile } from 'server/types/User';

interface Props {
  user: UserProfile;
  statusCode: number;
}

const ProfilePage: NextPage<Props> = ({ user, statusCode }: Props) => {
  function possessiveForm(name: string): string {
    return name.endsWith('s') ? `${name}'` : `${name}'s`;
  }

  const isErrorCode = statusCode < 200 || statusCode >= 300;
  if (isErrorCode || !user) {
    return <ErrorPage statusCode={isErrorCode ? statusCode : 404}/>;
  }

  return (
    <>
      <Container className="flex flex-col gap-4 pt-20 items-center">
        <Box component="header">
          <Typography variant="h1" className="text-5xl font-700 text-center">
            {possessiveForm(user.discord_name)} Profile
          </Typography>
        </Box>

        {user.bio && <Typography variant="body1" component="p">{user.bio}</Typography>}

        <List className="flex gap-2">
          {user.twitter_username && (
            <ListItemButton
              component="a"
              href={`https://twitter.com/${user.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <TwitterIcon className="text-gray-800"/>
              </ListItemIcon>
            </ListItemButton>
          )}

          {user.linkedin_url && (
            <ListItemButton
              component="a"
              href={user.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <LinkedInIcon className="text-gray-800"/>
              </ListItemIcon>
            </ListItemButton>
          )}

          {user.github_username && (
            <ListItemButton
              component="a"
              href={`https://github.com/${user.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <GitHubIcon className="text-gray-800"/>
              </ListItemIcon>
            </ListItemButton>
          )}

          {user.website && (
            <ListItemButton
              component="a"
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <ListItemIcon sx={{ minWidth: 'auto' }}>
                <HomeRoundedIcon className="text-gray-800"/>
              </ListItemIcon>
            </ListItemButton>
          )}
        </List>
      </Container>
    </>
  );
};

ProfilePage.getInitialProps = async ({ req, res, query }: NextPageContext) => {
  const props: Props = {
    user: null,
    statusCode: 200,
  };

  try {
    const axios = createAxiosInstance(req);
    const { data: user } = await axios.get<UserProfile>(`/api/users/${query.id}`);
    props.user = user;
  } catch (error) {
    res.statusCode = props.statusCode = error.response.status;
  }

  return props;
};

export default ProfilePage;
