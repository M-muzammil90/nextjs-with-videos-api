"use client"

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import React from "react";
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";

  function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SessionProvider refetchInterval={5 * 60}>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
          {children}
        </ImageKitProvider>
      </SessionProvider>
    </div>
  );
}
export default Providers