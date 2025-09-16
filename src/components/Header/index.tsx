import Cookies from "js-cookie";
import { ArrowRightToLine, Link } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/auth/login");
  };

  return (
    <header className="w-[80%] flex justify-between items-center mt-6 py-4 px-8 bg-sky-900 shadow-md rounded-[8px]">
      <a href="/home" className="flex items-center justify-center gap-1">
        <Link color="#fff" size={20} />
        <h1 className="text-xl font-bold text-white">URL Shortener</h1>
      </a>

      <div className="flex items-center gap-4">
        <p className="text-white text-md font-semibold">{username}</p>
        <button
          title="Sair"
          onClick={handleLogout}
          className="flex items-center justify-center gap-[3px] px-4 py-2 text-sm font-semibold text-white bg-sky-950 rounded-lg hover:bg-sky-950/80 transition-colors duration-200 cursor-pointer"
        >
          Sair
          <ArrowRightToLine color="#fff" size={20} />  
        </button>
      </div>
    </header>
  );
}
