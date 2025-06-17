import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAllUrls } from "../api/user.api.js";
import { deleteUrl, toggleActiveUrl } from "../api/shortUrl.api.js";
import {
  Copy,
  Check,
  ExternalLink,
  Link,
  Trash2,
  Power,
  PowerOff,
  Calendar,
  MousePointer,
} from "lucide-react";

const UserUrl = () => {
  const queryClient = useQueryClient();
  const {
    data: urls,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userUrls"],
    queryFn: userAllUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const [copiedId, setCopiedId] = useState(null);

  const deleteUrlMutation = useMutation({
    mutationFn: deleteUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleActiveUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userUrls"] });
    },
  });

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (urlId) => {
    if (window.confirm("Are you sure you want to delete this URL?")) {
      deleteUrlMutation.mutate(urlId);
    }
  };

  const handleToggleActive = async (urlId) => {
    toggleActiveMutation.mutate(urlId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-600">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading URLs
          </h3>
          <p className="text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!urls || urls.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No URLs Yet
          </h3>
          <p className="text-gray-500">
            Create your first shortened URL to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your URLs</h1>
        <p className="text-gray-600">{urls.length} shortened URLs</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Original URL
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Short URL
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Clicks
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Limits
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...urls].reverse().map((url) => (
                <tr
                  key={url._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Link className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-medium text-gray-900 truncate max-w-xs"
                          title={url.fullUrl}
                        >
                          {url.fullUrl}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <a
                      href={`http://localhost:3000/api/v1/redirect/${url.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      <span className="text-sm">
                        localhost:3000/{url.shortUrl}
                      </span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {url.clicks}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="space-y-1">
                      {url.expiresAt && (
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(url.expiresAt)}</span>
                        </div>
                      )}
                      {url.maxClicks && (
                        <div className="text-xs text-gray-600">
                          Max: {url.maxClicks}
                        </div>
                      )}
                      {!url.expiresAt && !url.maxClicks && (
                        <span className="text-xs text-gray-400">No limits</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        url.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {url.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() =>
                          handleCopy(
                            `http://localhost:3000/api/v1/redirect/${url.shortUrl}`,
                            url._id
                          )
                        }
                        className={`p-2 rounded-lg border transition-all ${
                          copiedId === url._id
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                        title="Copy URL"
                      >
                        {copiedId === url._id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleActive(url.shortUrl)}
                        disabled={toggleActiveMutation.isLoading}
                        className={`p-2 rounded-lg border transition-all ${
                          url.isActive
                            ? "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                            : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        }`}
                        title={url.isActive ? "Deactivate" : "Activate"}
                      >
                        {url.isActive ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(url.shortUrl)}
                        disabled={deleteUrlMutation.isLoading}
                        className="p-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                        title="Delete URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserUrl;
