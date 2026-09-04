"use cleint";

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import React from "react";
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";

export async function providers({ children }: { children: React.ReactNode }) {
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
