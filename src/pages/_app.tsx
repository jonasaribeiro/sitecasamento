import type { AppProps } from "next/app";
import "../styles/global.css"; // importa o global.css aqui

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
