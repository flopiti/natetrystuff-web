import Image from "next/image";
import Hub from "./components/hub";
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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Hub />
      </main>
    </UserProvider>
  )}, { returnTo: '/' })
