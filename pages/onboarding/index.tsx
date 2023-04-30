import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
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

interface Props {
  user: UserProfile;
}

const OnboardingPage: NextPage<Props> = ({ user }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    bio: user?.bio,
    twitter_username: user?.twitter_username,
    linkedin_url: user?.linkedin_url,
    github_username: user?.github_username,
    website: user?.website,
  });
  const [originalFormData, setOriginalFormData] = useState<FormData>({
    bio: user?.bio,
    twitter_username: user?.twitter_username,
    linkedin_url: user?.linkedin_url,
    github_username: user?.github_username,
    website: user?.website,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    console.log(formData);
    console.log(originalFormData);
    
    if( user !== formData && originalFormData !== formData){
      setIsFormFilled(true);
    }
    else if (originalFormData === formData){setIsFormFilled(false)}
    
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      await axios.patch(`/api/users/${user?.id}`, formData);
      setIsLoading(false);
      router.push('/directory');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const isSubmitDisabled = !isFormFilled && !isLoading;

  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      <Typography variant="h1" className="text-3xl">
        Onboarding
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Bio"
          name="bio"
          placeholder='Describe yourself!'
          value={formData.bio}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          inputProps={{ maxLength: 1000 }}
        />
        <TextField
          label="Twitter Username"
          placeholder='JonDoe24'
          name="twitter_username"
          value={formData.twitter_username}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
        />
        <TextField
          label="LinkedIn URL"
          name="linkedin_url"
          placeholder='https://www.linkedin.com/in/your-profile'
          value={formData.linkedin_url}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
        />
        <TextField
          label="GitHub Username"
          name="github_username"
          placeholder='Jon Doe'
          value={formData.github_username}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
        />
        <TextField
          label="Website"
          name="website"
          placeholder='https://www.your-website.com'
          value={formData.website}
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 200 }}
        />
        <Box mt={4} textAlign="right">
          <Button variant="contained" color="primary" type="submit" disabled={isSubmitDisabled}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
      </form>
      <Box className="flex items-center gap-4">
        <Link href="/directory" passHref>
          <Button variant="contained" color="secondary">
            Skip
          </Button>
        </Link>
      </Box>
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
    return { user:   {bio: "Lorem ipsum dolor sit amet",
    discord_name: "johndoe#1111",
    discord_user_id: "390925812364345344",
    github_username: "johndoe",
    id: 201,
    linkedin_url: "https://www.johndoe.com",
    twitter_username: "johndoe24",
    website: "https://www.johndoe.com"} };
  }
};

export default OnboardingPage;
