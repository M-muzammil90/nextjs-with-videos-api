"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { Span } from "next/dist/trace";
import { ChangeEvent, useRef, useState } from "react";
interface FileUploadpropes {
  Onsuccess: (req: any) => void;
  onProgress: (progress: number) => void;
  filetype?: "image" | "videos";
}

const UploadFile = ({ Onsuccess, onProgress, filetype }: FileUploadpropes) => {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const Validation = async (file: File) => {
    if (filetype === "videos" && file.type.startsWith("videos/")) {
      setError("please valid file upload it");
      return false;
    }
    if (filetype === "image" && file.type.startsWith("image/")) {
      setError("please valid file upload it");
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("miximum less then 100mb file upload it");
    }
    return true;
  };

  const Handlerfilechange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !Validation(file)) return;
    setloading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/imagekit-auth");
      const auth = await authRes.json();
      const uploadResponse = await upload({
        file,
        fileName: file.name,
        expire: auth.expire,
        token: auth.token,
        signature: auth.signature,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;

            onProgress(Math.round(percent));
          }
        },
      });
      Onsuccess(uploadResponse);
    } catch (error) {
      console.error("server error in imagekit-auth file ", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <input type="file" accept={filetype === "videos"?"videos/*":"image/*"}
      onChange={Handlerfilechange} />
      {loading && <span>Loading......</span>}
    </>
  );
};

export default UploadFile;
