"use client";

import React from "react";

interface Video {
  _id: string;
  title: string;
  discription: string;
  videos: string;
  thumnail: string;
  constrol?: boolean;
  transformations?: {
    height?: number;
    width?: number;
    quantity?: number;
  };
  createdAt?: string;
}

function Page() {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");

  const [search, setSearch] = React.useState("");
  const [selectedVideo, setSelectedVideo] =
    React.useState<Video | null>(null);

  // =========================
  // FETCH VIDEOS
  // =========================
  const fetchVideos = async () => {
    try {
      setError("");

      if (videos.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await fetch("/api/videos", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      console.log("VIDEOS API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to fetch videos"
        );
      }

      setVideos(
        Array.isArray(data.allvideos)
          ? data.allvideos
          : []
      );
    } catch (error) {
      console.error("FETCH VIDEOS ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // INITIAL FETCH
  // =========================
  React.useEffect(() => {
    fetchVideos();
  }, []);

  // =========================
  // ESC CLOSE MODAL
  // =========================
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedVideo(null);
      }
    };

    if (selectedVideo) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
      document.body.style.overflow = "";
    };
  }, [selectedVideo]);

  // =========================
  // SEARCH
  // =========================
  const filteredVideos = videos.filter((video) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      video.title
        ?.toLowerCase()
        .includes(searchText) ||
      video.discription
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-9 w-52 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200" />
          </div>

          {/* Search Skeleton */}
          <div className="mb-8 h-12 w-full animate-pulse rounded-xl bg-slate-200" />

          {/* Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-video animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR UI
  // =========================
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">

          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 9v3m0 4h.01M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3.1l-8-14a2 2 0 00-3.4 0z"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Failed to load videos
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={fetchVideos}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ====================================== */}
        <div className="mb-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    All Videos
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Watch and explore all uploaded videos
                  </p>
                </div>
              </div>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchVideos}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h5M20 20v-5h-5M5.5 9A7 7 0 0118 6.5L20 9M18.5 15A7 7 0 016 17.5L4 15"
                />
              </svg>

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-3">

            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <span className="font-semibold text-slate-900">
                {videos.length}
              </span>{" "}
              {videos.length === 1
                ? "Video"
                : "Videos"}
            </div>

            {search && (
              <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-600">
                {filteredVideos.length} results
              </div>
            )}
          </div>
        </div>

        {/* =====================================
            SEARCH BAR
        ====================================== */}
        <div className="mb-8">

          <div className="relative">

            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search videos by title or description..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* =====================================
            EMPTY STATE
        ====================================== */}
        {videos.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
              <svg
                className="h-10 w-10 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M15 10l4.55-2.275A1 1 0 0121 8.618v6.764a1 1 0 01-1.45.894L15 14M5 19h8a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No videos yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't uploaded any videos yet.
              Create your first video and it will
              appear here.
            </p>
          </div>
        ) : filteredVideos.length === 0 ? (

          /* Search Empty */
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-8 w-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No results found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No videos match "{search}".
            </p>

            <button
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Clear Search
            </button>
          </div>

        ) : (

          /* =====================================
              VIDEO GRID
          ====================================== */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredVideos.map((video) => (

              <article
                key={video._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Thumbnail */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedVideo(video)
                  }
                  className="relative block aspect-video w-full overflow-hidden bg-slate-200 text-left"
                >

                  <img
                    src={video.thumnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-80" />

                  {/* Play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl transition duration-300 group-hover:scale-110">
                      <svg
                        className="ml-1 h-6 w-6 text-slate-900"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Quality */}
                  <div className="absolute right-3 top-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {video.transformations?.quantity ??
                      100}
                    %
                  </div>

                  {/* Bottom label */}
                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    Watch now
                  </div>
                </button>

                {/* Content */}
                <div className="p-5">

                  {/* Title */}
                  <h2
                    title={video.title}
                    className="line-clamp-1 text-lg font-bold text-slate-900"
                  >
                    {video.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-2 min-h-[40px] line-clamp-2 text-sm leading-5 text-slate-500">
                    {video.discription}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center justify-between gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        video.constrol
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {video.constrol
                        ? "Controls On"
                        : "Controls Off"}
                    </span>

                    {video.createdAt && (
                      <span className="text-xs text-slate-400">
                        {formatDate(
                          video.createdAt
                        )}
                      </span>
                    )}
                  </div>

                  {/* Watch Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVideo(video)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>

                    Watch Video
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* =====================================
          VIDEO MODAL
      ====================================== */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedVideo(null);
            }
          }}
        >

          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">

            {/* Close */}
            <button
              type="button"
              onClick={() =>
                setSelectedVideo(null)
              }
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-2xl text-white backdrop-blur transition hover:bg-white hover:text-black"
              aria-label="Close video"
            >
              ×
            </button>

            {/* Video */}
            <div className="aspect-video w-full bg-black">

              <video
                key={selectedVideo._id}
                src={selectedVideo.videos}
                poster={selectedVideo.thumnail}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-contain"
              />
            </div>

            {/* Video Info */}
            <div className="bg-white p-5 sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedVideo.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {selectedVideo.discription}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">

                  <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                    Quality{" "}
                    {selectedVideo.transformations
                      ?.quantity ?? 100}
                    %
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      selectedVideo.constrol
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selectedVideo.constrol
                      ? "Controls On"
                      : "Controls Off"}
                  </span>
                </div>
              </div>

              {selectedVideo.createdAt && (
                <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
                  Uploaded{" "}
                  {formatDate(
                    selectedVideo.createdAt
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Page;