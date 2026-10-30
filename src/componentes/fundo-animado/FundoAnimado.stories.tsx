import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FundoAnimado } from "./FundoAnimado";

// Cada história congela o fundo num instante do vídeo de referência para comparar quadro a quadro.
const meta = {
  title: "Fundo animado",
  component: FundoAnimado,
  args: { segundoInicial: 0, congelado: false },
} satisfies Meta<typeof FundoAnimado>;

export default meta;

type Historia = StoryObj<typeof meta>;

export const CicloCompleto: Historia = {};

export const CampoCongelado: Historia = { args: { segundoInicial: 2, congelado: true } };

export const TunelCongelado: Historia = { args: { segundoInicial: 13, congelado: true } };

export const EspiralCongelada: Historia = { args: { segundoInicial: 21, congelado: true } };
