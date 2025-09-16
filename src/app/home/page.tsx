"use client";
import Button from "@/components/Button";
import Separator from "@/components/Separator";
import api from "@/service/api";
import { UrlType } from "@/types/UrlTypr";
import { Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [slugUrl, setSlugUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [listUrl, setListUrl] = useState<UrlType[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  const fetchAllUrl = useCallback(async () => {
    try {
      setLoading(true);
      const [listRes, userRes] = await Promise.all([
        api.get("/url/shorten"),
        api.get("/user"),
      ]);
      setListUrl(listRes.data);
      setUsername(userRes.data.username);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/auth/login");
      }
      setError("Falha ao carregar URLs. Tente recarregar a página.");
      console.error("Falha ao buscar URLs: ", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAllUrl();
  }, [fetchAllUrl]);

  const handleShortenerUrl = async () => {
    if (!url || url.trim() === "") {
      setError("Por favor, insira uma URL válida.");
      return;
    }

    if (slugUrl && !/^[\w-]+$/.test(slugUrl)) {
      setError("Slug inválido. Use apenas letras, números, '-' ou '_'.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/url/shorten", {
        originalUrl: url,
        customSlug: slugUrl || null,
      });

      await fetchAllUrl();

      setUrl("");
      setSlugUrl("");
      setError("");
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/auth/login");
      }
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao encurtar URL.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage("URL copiada para a área de transferência!");
        setTimeout(() => setCopyMessage(""), 3000);
      })
      .catch(() => setError("Falha ao copiar URL."));
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-sky-950">
      {username && <Header username={username} />}

      <div className="flex-1 flex flex-col justify-center p-4">
        <section className="w-full max-w-4xl h-auto p-6 flex flex-col items-center justify-center border-2 border-sky-200 rounded-lg shadow-xl bg-sky-800">
          <div className="w-full flex flex-col items-start justify-start mb-4">
            <label className="text-lg font-bold text-white mb-2">
              Cole a URL a ser encurtada:
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="ex: https://google.com"
              className="w-full h-12 p-3 pl-4 border-2 border-sky-700 rounded-lg outline-none bg-sky-900 text-white placeholder-sky-400 focus:border-sky-500 transition-colors duration-200"
            />

            <label className="text-lg font-bold text-white mt-4 mb-2">
              Slug personalizado (opcional):
            </label>
            <input
              type="text"
              value={slugUrl}
              onChange={(e) => {
                setSlugUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="ex: meu-link"
              className="w-full h-12 p-3 pl-4 border-2 border-sky-700 rounded-lg outline-none bg-sky-900 text-white placeholder-sky-400 focus:border-sky-500 transition-colors duration-200"
            />

            {error && (
              <div className="w-full h-auto flex items-center justify-center mt-[20px]">
                <p className="text-[14px] text-red-500 font-normal">{error}</p>
              </div>
            )}

            {copyMessage && (
              <div className="w-full h-auto flex items-center justify-center mt-[20px]">
                <p className="text-[14px] text-green-500 font-normal">
                  {copyMessage}
                </p>
              </div>
            )}

            <Button
              label={loading ? "Carregando..." : "Encurtar URL"}
              onClick={handleShortenerUrl}
            />
          </div>

          <Separator label="" />

          <div className="w-full flex flex-col items-start justify-start">
            {loading ? (
              <div className="w-full flex justify-center items-center h-auto">
                <p className="text-sm font-semibold text-white">
                  Carregando...
                </p>
              </div>
            ) : (
              <section className="w-full h-auto flex flex-col items-center justify-center p-2">
                {listUrl && listUrl.length > 0 ? (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 table-auto">
                      <thead className="text-xs text-sky-200 uppercase bg-sky-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 rounded-tl-lg">
                            URL Encurtada
                          </th>
                          <th scope="col" className="px-6 py-3 rounded-tr-lg">
                            URL Original
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listUrl.map((item) => (
                          <tr
                            key={item.id}
                            className="bg-sky-800 border-b border-sky-700 hover:bg-sky-700"
                          >
                            <td className="px-6 py-4 font-medium text-sky-200 whitespace-nowrap flex items-center gap-2">
                              <a
                                href={`http://localhost:8080/url/${item.shortUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline cursor-pointer"
                                title="Seguir para URL"
                              >
                                {item.fullShortUrl || item.shortUrl}
                              </a>
                              <span title="Copiar">
                                <Copy
                                  size={16}
                                  className="cursor-pointer text-sky-400 hover:text-sky-200"
                                  onClick={() =>
                                    copyToClipboard(
                                      `http://localhost:8080/url/${item.shortUrl}`
                                    )
                                  }
                                />
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sky-300 break-all">
                              {item.originalUrl}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-white font-medium">
                    Nenhuma URL encontrada.
                  </p>
                )}
              </section>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
