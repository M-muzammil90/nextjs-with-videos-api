"use client";

import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const [videoUrl, setVideoUrl] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [discription, setDescription] = React.useState("");

  const [controls, setControls] = React.useState(true);
  const [quality, setQuality] = React.useState(100);
  const router = useRouter()
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setProgress(20);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          discription,
          videos: videoUrl,
          thumnail: thumbnailUrl,

          // Backend ke field names
          constrol: controls,
          quantity: quality,
        }),
      });

      setProgress(70);

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Video upload failed"
        );
      }

      setProgress(100);

      alert("Video created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
      setControls(true);
      setQuality(100);
      router.push("/show")
    } catch (error) {
      console.error("VIDEO CREATE ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Video
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Add your video details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>

              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={discription}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Video URL */}
            <div>
              <label
                htmlFor="videoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Video URL
              </label>

              <input
                type="url"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://..."
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label
                htmlFor="thumbnailUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Thumbnail URL
              </label>

              <input
                type="url"
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="controls"
                className="text-sm font-medium text-gray-700"
              >
                Video Controls
              </label>

              <input
                type="checkbox"
                id="controls"
                checked={controls}
                onChange={(e) => setControls(e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            {/* Quality */}
            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="quality"
                  className="text-sm font-medium text-gray-700"
                >
                  Quality
                </label>

                <span className="text-sm text-gray-500">
                  {quality}%
                </span>
              </div>

              <input
                type="range"
                id="quality"
                min="0"
                max="100"
                value={quality}
                onChange={(e) =>
                  setQuality(Number(e.target.value))
                }
                className="w-full mt-2"
              />
            </div>

            {/* Progress */}
            {loading && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;