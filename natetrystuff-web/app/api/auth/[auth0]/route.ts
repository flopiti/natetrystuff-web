import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  async login(req:any, res:any) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          scope: 'openid profile email offline_access',  // Request refresh token
        
        },
        returnTo: '/api/auth/callback',
        

      });
    } catch (error:any) {
      res.status(error.status || 500).end(error.message);
    }
  }
});