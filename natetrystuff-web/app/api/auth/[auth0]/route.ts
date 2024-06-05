import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const  GET = handleAuth({
    login: handleLogin({
      returnTo: "/",
    }),
    signup: handleLogin({
      authorizationParams: {
        scope: 'openid profile email offline_access',  // Request refresh token
    },
      returnTo: "/",
    }),
  });