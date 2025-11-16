// src/api/blogService.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface Blog {
  id?: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;  
  image: string;     
  readTime: number;
  link: string;     
}

export interface BlogResponse {
  blogs: Blog[];
}

export const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await axios.get<BlogResponse>(`${BASE_URL}/blogs-data/`);
  return res.data.blogs;
};

export const updateBlogsData = async (
  blogs: Blog[]
): Promise<{ message: string }> => {
  const payload = { blogs };
  const res = await axios.put(`${BASE_URL}/update-blogs-data/`, payload);
  return res.data;
};

export const deleteBlog = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/delete-blog-item/${id}/`);
  return res.data;
};
