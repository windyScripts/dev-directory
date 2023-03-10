export function getDiscordOauthUrl() {
  const url = 'https://discord.com/oauth2/authorize';
  const params = new URLSearchParams();
  params.append('redirect_uri', process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI);
  params.append('response_type', 'code');
  params.append('scope', 'identify email guilds');
  params.append('client_id', process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);
  return `${url}?${params.toString()}`;
}
