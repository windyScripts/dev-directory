import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Cookies from 'universal-cookie';

import createAxiosInstance from 'client/lib/axios';
import { UserProfile } from 'server/types/User';
import { AUTH_COOKIE_NAME } from 'shared/constants';

interface FormData {
  bio: string;
  twitter_username: string;
  linkedin_url: string;
  github_username: string;
  website: string;
}

interface UseridData {
  user: UserProfile;
}

const OnboardingPage: NextPage<UseridData> = ({ user }: UseridData) => {
  const [formData, setFormData] = useState<FormData>({
    bio: '',
    twitter_username: '',
    linkedin_url: '',
    github_username: '',
    website: '',
  });

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.patch(`/api/users/${user.id}`, formData);

      if (response.status !== 200) {
        throw new Error('Failed to update user profile');
      }

      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      <Typography variant="h1" className="text-3xl">
        Onboarding
      </Typography>
      <Box className="flex items-center gap-4">
        <Link href="/" passHref>
          <Button variant="contained" color="secondary">
            Skip
          </Button>
        </Link>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          inputProps={{ maxLength: 1000 }}
          required
        />
        <TextField
          label="Twitter username"
          name="twitter_username"
          value={formData.twitter_username}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
          required
        />
        <TextField
          label="LinkedIn URL"
          name="linkedin_url"
          value={formData.linkedin_url}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
          required
        />
        <TextField
          label="GitHub username"
          name="github_username"
          value={formData.github_username}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
          required
        />
        <TextField
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
          required
        />

        <Box mt={4} textAlign="right">
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

OnboardingPage.getInitialProps = async ({ req }) => {
  try {
    const cookies = new Cookies(req?.headers.cookie);
    const token = cookies.get(AUTH_COOKIE_NAME);
    const payload = jwt.decode(token) as jwt.JwtPayload;
    const axiosInstance = createAxiosInstance(req);
    const userInfo = await axiosInstance.get('/api/users/' + payload.user_id);
    return { user: userInfo.data };
  } catch (error) {
    return { user: null };
  }
};

export default OnboardingPage;
