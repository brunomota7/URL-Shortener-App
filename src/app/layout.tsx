import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../styles/globals.css";

const poppins = Poppins({
   weight: ["300", "400", "500", "600", "700", "800", "900"],
   subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Encurtador de URL",
  description: "Pior encurtador de URL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={poppins.className}
      >
        {children}
      </body>
    </html>
  );
}
