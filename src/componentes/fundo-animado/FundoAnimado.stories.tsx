import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FundoAnimado } from "./FundoAnimado";

// Cada história congela o fundo num instante do vídeo de referência para comparar quadro a quadro.
const configuracaoDasHistorias = {
  title: "Fundo animado",
  component: FundoAnimado,
  args: { segundoInicial: 0, congelado: false },
} satisfies Meta<typeof FundoAnimado>;

export default configuracaoDasHistorias;

type Historia = StoryObj<typeof configuracaoDasHistorias>;

export const CicloCompleto: Historia = {};

export const CampoCongelado: Historia = { args: { segundoInicial: 2, congelado: true } };

export const TunelCongelado: Historia = { args: { segundoInicial: 13, congelado: true } };

export const EspiralCongelada: Historia = { args: { segundoInicial: 21, congelado: true } };
