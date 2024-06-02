'use client';
import Image from "next/image";
import Hub from "./hub";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function Home() {
  return (
    <UserProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Hub />
      </main>
    </UserProvider>
  )}, { returnTo: '/' })
