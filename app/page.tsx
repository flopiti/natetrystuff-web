//DESC: This file sets up authentication and renders the main Hub component for the homepage.
import Hub from "../components/Hub";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'NateTryStuff',
  icons:{
    icon: '/memeals.png',
  }
}
export default withPageAuthRequired(async function Home() {
  return (
    <UserProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 font-AlphaLyrae ">
        <Hub />
      </main>
    </UserProvider>
  )}, { returnTo: '/' })