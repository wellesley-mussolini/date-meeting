import type { NextConfig } from "next";

// O GitHub Pages serve o site estático no subcaminho do repositório (/date-meeting). Só o build do
// deploy define essa variável; o next dev e o build normal continuam na raiz e com servidor.
const caminhoNoGithubPages = process.env.CAMINHO_NO_GITHUB_PAGES;

const configuracaoComum: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Cache Components e Partial Prefetching usam o Partial Prerendering, que precisa de servidor:
// o build estático do Pages os deixa desligados (o app não usa cache nem busca de dados).
const nextConfig: NextConfig = caminhoNoGithubPages
  ? { ...configuracaoComum, output: "export", basePath: caminhoNoGithubPages }
  : { ...configuracaoComum, cacheComponents: true, partialPrefetching: true };

export default nextConfig;
