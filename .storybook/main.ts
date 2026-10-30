import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  // O Next aplica o Tailwind pelo loader do Turbopack; o Storybook roda em Vite e precisa do plugin próprio.
  viteFinal: (configuracaoVite) => ({
    ...configuracaoVite,
    plugins: [...(configuracaoVite.plugins ?? []), tailwindcss()],
  }),
};

export default config;
