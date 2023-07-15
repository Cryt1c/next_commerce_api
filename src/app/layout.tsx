import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next.js + Drupal Commerce",
  description: "Learn how to decouple your webshop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-2 rounded`}
          href="/react-bootcamp"
        >
          React Bootcamp
        </a>
        <a
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 m-2 rounded`}
          href="/php-bootcamp"
        >
          PHP Bootcamp
        </a>
        <a
          className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2 rounded`}
          href="/cart"
        >
          Cart
        </a>
        <div className={`m-5`}>{children}</div>
      </body>
    </html>
  );
}
