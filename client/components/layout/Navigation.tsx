import React from 'react';
import { Box, Button } from '@mui/material';
import createAxiosInstance from 'client/lib/axios';
import { getDiscordOauthUrl } from 'client/lib/oauth';
import Link from 'next/link';

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

const DIRECTORY_LINK: NavLink = {
  label: 'Discover',
  href: '/directory',
}

const PROFILE_LINK: NavLink = {
  label: 'Profile',
  href: '/profile',
}

const LOGIN_LINK: NavLink = {
  label: 'Login',
  href: getDiscordOauthUrl(),
}

const LOGOUT_LINK: NavLink = {
  label: 'Logout',
  onClick: async () => {
    const axios = createAxiosInstance();
    await axios.post('/api/auth/logout');
  }
}

const authedNav = [
  DIRECTORY_LINK,
  PROFILE_LINK,
  LOGOUT_LINK,
]

const anonNav = [
  DIRECTORY_LINK,
  LOGIN_LINK,
]

const Navigation: React.FC = () => {
  const isAuthed = true;
  const links = isAuthed ? authedNav : anonNav;

  return (
    <Box component="nav">
      {links.map(link => (
        link.href ? (
          <Link href={link.href} key={link.href}>
            <Button onClick={link.onClick}>
              {link.label}
            </Button>
          </Link>
        ) : (
          <Button onClick={link.onClick} key={link.label}>
            {link.label}
          </Button>
        )
      ))}
    </Box>
  );
};

export default Navigation;
