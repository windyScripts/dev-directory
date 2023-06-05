import { Button, Container, TextField } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useState } from 'react';

import { useAuthDispatch } from 'client/contexts/auth';
import { UserProfile } from 'server/types/User';

interface Props {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const UserForm:React.FC<Props> = ({ user, setUser }) => {
  const authDispatch = useAuthDispatch();

  const [userData, setUserData] = useState({
    bio: user.bio || '',
    twitter_username: user.twitter_username || '',
    linkedin_url: user.linkedin_url || '',
    github_username: user.github_username || '',
    website: user.website || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit:React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      const userId = user.id;

      const response = await axios.patch(`/api/users/${userId}`, userData);
      authDispatch({ type: 'SET_AUTHED_USER', user: { ...user, ...userData }});
      setUser({
        ...user,
        ...userData,
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFormVisible) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            id="outlined-multiline-static"
            label="Bio"
            name="bio"
            multiline
            rows={4}
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
        </Box>
      </form>
    </Container>
  );
};

export default UserForm;
