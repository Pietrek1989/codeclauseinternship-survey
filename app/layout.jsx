import Navbar from "./components/Navbar";
import { AuthProvider, Providers } from "./components/Providers";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Survey app",
  description: "Create share and analyze your survey!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
