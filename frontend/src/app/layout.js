import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import { Providers } from "./Providers";

export const metadata = {
  title: "Task App",
  description: "Assignment By Myrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
