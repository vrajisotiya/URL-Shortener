import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async (url, slug, expiresAt, maxClicks) => {
  const { data } = await axiosInstance.post("/create", {
    url,
    slug,
    expiresAt,
    maxClicks,
  });
  return data.data;
};

export const deleteUrl = async (shorturl) => {
  const { data } = await axiosInstance.delete(`/create/${shorturl}`);
  return data.data;
};

export const toggleActiveUrl = async (shorturl) => {
  const { data } = await axiosInstance.patch(
    `/create/toggle/active/${shorturl}`
  );
  return data.data;
};
