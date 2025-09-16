"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Separator from "@/components/Separator";
import api from "@/service/api";
import { validPassword, validUsername, validVar } from "@/utils/functionsValid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LogoGoogle from "../../../../assets/icons/google-logo.png";
import LogoFacebook from "../../../../assets/icons/facebook-new.png";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  const handleRegister = async () => {
    const varError = validVar(username, password);
    const userError = validUsername(username);
    const passError = validPassword(password);

    if (varError) return setErro(varError);
    if (userError) return setErro(userError);
    if (passError) return setErro(passError);

    try {
      await api.post("/auth/register", {
        username,
        password,
      });
      setUsername("");
      setPassword("");
      router.push("/auth/login");
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErro(err.response.data.message);
      } else {
        setErro("Erro ao cadastrar usuário");
      }
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center bg-sky-950 p-4 relative">
      <section className="w-[600px] h-auto p-[10px] flex flex-col items-center justify-center bg-sky-800 rounded-[10px]">
        <header className="w-[550px] h-auto p-[14px] flex flex-col items-center justify-center gap-[8px] absolute top-40 bg-sky-600 rounded-[10px]">
          <h2 className="text-[20px] font-[900]">CADASTRE-SE</h2>
        </header>

        <div className="w-full h-auto p-[14px] mt-10 flex flex-col gap-[10px]">
          <Input
            label={"Username"}
            type={"text"}
            value={username}
            placeholder={"ex: jhon.alias"}
            onChange={(e) => {
              setUsername(e.target.value);
              if (erro) setErro("");
            }}
          />
          <Input
            label={"Password"}
            type={"password"}
            value={password}
            placeholder={"Sua senha"}
            onChange={(e) => {
              setPassword(e.target.value);
              if (erro) setErro("");
            }}
          />

          {erro && (
            <div className="w-full h-auto flex items-center justify-center">
              <p className="text-[14px] text-red-500 font-normal">{erro}</p>
            </div>
          )}

          <Button label={"Cadastrar"} onClick={handleRegister} />

          <div className="w-full h-[20px] pr-[14px] mt-[10px] flex items-center justify-center gap-[3px]">
            <span className="text-[14px] font-medium">Já tem uma conta?</span>
            <Link
              href={"/auth/login"}
              className="text-[14px] text-sky-200 font-bold underline cursor-pointer"
            >
              Entrar
            </Link>
          </div>

          <Separator label={"or"} />

          <div className="w-full h-auto pl-[14px] pr-[14px] flex flex-col items-center justify-center gap-[10px]">
            <Link
              href={""}
              className="w-full h-12 flex items-center justify-center gap-1 bg-white rounded-[8px]"
            >
              <Image
                src={LogoGoogle}
                alt="Logo Google"
                width={30}
                height={30}
              />
              <p className="text-sky-950 font-bold">Continuar com Google</p>
            </Link>
            <Link
              href={"/auth"}
              className="w-full h-12 flex items-center justify-center gap-1 bg-white rounded-[8px]"
            >
              <Image
                src={LogoFacebook}
                alt="Logo Facebook"
                width={30}
                height={30}
              />
              <p className="text-sky-950 font-bold">Continuar com Facebook</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
