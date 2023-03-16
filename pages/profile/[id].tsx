import GitHubIcon from '@mui/icons-material/GitHub';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Container, Box, ListItemIcon, ListItemButton, List, Typography } from '@mui/material';
import axios, { RawAxiosRequestConfig } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import absoluteUrl from 'next-absolute-url';
import React from 'react';

import { UserProfile } from 'server/types/User';

type Props = {
  user?: UserProfile;
  notFound?: boolean;
};

const ProfilePage: NextPage<Props> = ({ user }: Props) => {
  function possessiveForm(name: string): string {
    return name.endsWith('s') ? `${name}'` : `${name}'s`;
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, query }) => {
  const { origin } = absoluteUrl(req);

  try {
    const config: RawAxiosRequestConfig = req ? {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie,
      },
    } : {};

    const { data: user } = await axios.get<UserProfile>(`${origin}/api/users/${query.id}`, config);

    return { props: { user } };
  } catch (error) {
    return { notFound: true };
  }
};

export default ProfilePage;
