"use client";
import Header from "@/components/Header";
import api from "@/service/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [urls, setUrls] = useState([]);
  const [admin, setAdmin] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, urlsRes, userRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/urls"),
        api.get("/user"),
      ]);
      setUsers(usersRes.data);
      setUrls(urlsRes.data);
      setAdmin(userRes.data.username);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push("/auth/login");
      }
      setError("Failed to load data. Please try again.");
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully!");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      toast.error("Failed to delete user.");
      console.error("Failed to delete user:", err);
    }
  };

  const handleDeleteUrl = async (urlId) => {
    try {
      await api.delete(`/admin/urls/${urlId}`);
      toast.success("URL deleted successfully!");
      setUrls(urls.filter((url) => url.id !== urlId));
    } catch (err) {
      toast.error("Failed to delete URL.");
      console.error("Failed to delete URL:", err);
    }
  };

  const renderUsersTable = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl mt-8">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Gerenciamento de usuários
      </h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-700 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 truncate max-w-xs">
                {user.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUrlsTable = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl mt-8">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Gerenciamento de URL
      </h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Original URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Short URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {urls.map((url) => (
            <tr
              key={url.id}
              className="hover:bg-gray-700 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {url.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 truncate max-w-xs">
                {url.originalUrl}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                <a
                  href={url.fullShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  {url.shortUrl}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {url.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDeleteUrl(url.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-sky-950 text-white p-4">
      {admin && <Header username={admin} />}
      <div className="mt-8 text-center">
        <h1 className="text-3xl font-bold text-white">Painel do Administrador</h1>
        <p className="text-gray-400 mt-2">Gerenciar usuários e URLs.</p>
      </div>
      {loading && <p className="mt-8 text-lg">Loading...</p>}
      {error && <p className="mt-8 text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          {renderUsersTable()}
          {renderUrlsTable()}
        </>
      )}
    </div>
  );
}
