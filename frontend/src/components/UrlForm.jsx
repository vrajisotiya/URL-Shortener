import React, { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api";
import { useSelector } from "react-redux";
import { QueryClient } from "@tanstack/react-query";
import { queryClient } from "../main";
import {
  Link,
  Copy,
  Check,
  Globe,
  Scissors,
  Calendar,
  MousePointer,
} from "lucide-react";

const UrlForm = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [customSlug, setCustomSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxClicks, setMaxClicks] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    try {
      const shortUrl = await createShortUrl(
        url,
        customSlug,
        expiresAt,
        maxClicks
      );
      setShortUrl(shortUrl);
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      const timeoutId = setTimeout(() => {
        setShortUrl("");
        setUrl("");
      }, 15000);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100 mt-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <Scissors className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          URL Shortener
        </h1>
        <p className="text-gray-600 mt-2">
          Transform long URLs into short, shareable links
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="url"
            className="flex items-center text-sm font-semibold text-gray-700"
          >
            <Globe className="w-4 h-4 mr-2 text-blue-500" />
            Enter your URL
          </label>
          <div className="relative">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
            <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        {isAuthenticated && (
          <>
            <div className="space-y-2">
              <label
                htmlFor="customSlug"
                className="flex items-center text-sm font-semibold text-gray-700"
              >
                <div className="w-4 h-4 mr-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">@</span>
                </div>
                Custom URL (optional)
              </label>
              <input
                type="text"
                id="customSlug"
                value={customSlug}
                onChange={(event) => setCustomSlug(event.target.value)}
                placeholder="my-custom-link"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="expiresAt"
                  className="flex items-center text-sm font-semibold text-gray-700"
                >
                  <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                  Expires At (optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="maxClicks"
                  className="flex items-center text-sm font-semibold text-gray-700"
                >
                  <MousePointer className="w-4 h-4 mr-2 text-green-500" />
                  Max Clicks (optional)
                </label>
                <input
                  type="number"
                  id="maxClicks"
                  value={maxClicks}
                  onChange={(e) => setMaxClicks(e.target.value)}
                  placeholder="100"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
          </>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <Scissors className="w-5 h-5" />
          <span>Shorten URL</span>
        </button>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {shortUrl && (
          <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-500 rounded-full mr-3">
                <Check className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Your shortened URL is ready!
              </h2>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={shortUrl}
                  className="w-full p-4 pr-12 border border-gray-300 rounded-xl bg-white font-mono text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm break-all"
                />
                <Link className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 flex-shrink-0" />
              </div>
              <button
                onClick={handleCopy}
                className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  copied
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>Link is ready to share!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlForm;
