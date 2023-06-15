import { Box, Button, Container, TextField, Typography, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
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
  user: UserProfile | null;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OnboardingPage: NextPage<Props> = ({ user }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    bio: user?.bio,
    twitter_username: user?.twitter_username,
    linkedin_url: user?.linkedin_url,
    github_username: user?.github_username,
    website: user?.website,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [openAlertError, setOpenAlertError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    const isFormFilled = Object.values(formData).some(value => !!value);
    setIsFormFilled(isFormFilled);
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
      setOpenAlertError(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlertError(false);
  };

  const isSubmitDisabled = !isFormFilled || isLoading;

  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      <Typography variant="h1" className="text-3xl">
        Complete your profile to connect with other members!
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
          placeholder='twitteruser'
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
          placeholder='githubuser'
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
      <Snackbar open={openAlertError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        An error occurred, please try again.
        </Alert>
      </Snackbar>
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
