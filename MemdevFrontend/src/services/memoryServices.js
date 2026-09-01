import api from "./api";

export const getMemories = async () => {
  return await api("/memories", {
    method: "GET",
  });
};

export const getMemory = async (id) => {
  return await api(`/memories/${id}`, {
    method: "GET",
  });
};

export const createMemory = async (memoryData) => {
  return await api("/memories", {
    method: "POST",
    body: JSON.stringify(memoryData),
  });
};

export const updateMemory = async (id, memoryData) => {
  return await api(`/memories/${id}`, {
    method: "PUT",
    body: JSON.stringify(memoryData),
  });
};

export const deleteMemory = async (id) => {
  return await api(`/memories/${id}`, {
    method: "DELETE",
  });
};