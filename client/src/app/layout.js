import { Inter } from "next/font/google";
import "./globals.css";
import InitPage from "./init-page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Streamix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <InitPage />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
