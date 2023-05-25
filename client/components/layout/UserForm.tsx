import { Button, Container, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

import { useAuthState, useAuthDispatch } from 'client/contexts/auth';

const UserForm = () => {
  const { authedUser } = useAuthState();
  const authDispatch = useAuthDispatch();

  const [userData, setUserData] = useState({
    bio: authedUser.bio || '',
    twitter_username: authedUser.twitter_username || '',
    linkedin_url: authedUser.linkedin_url || '',
    github_username: authedUser.github_username || '',
    website: authedUser.website || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const userId = authedUser.id;

      const response = await axios.patch(`/api/users/${userId}`, userData);
      authDispatch({ type: 'SET_AUTHED_USER', user: userData });
      console.log(response.status);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          name="bio"
          label="Bio"
          value={userData.bio}
          onChange={handleChange}
        />
        <TextField
          name="twitter_username"
          label="Twitter Username"
          value={userData.twitter_username}
          onChange={handleChange}
        />
        <TextField
          name="linkedin_url"
          label="LinkedIn URL"
          value={userData.linkedin_url}
          onChange={handleChange}
        />
        <TextField
          name="github_username"
          label="GitHub Username"
          value={userData.github_username}
          onChange={handleChange}
        />
        <TextField
          name="website"
          label="Website"
          value={userData.website}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </Container>
  );
};

export default UserForm;
