import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FundoAnimado } from "../fundo-animado/FundoAnimado";
import { CardDoConvite } from "./CardDoConvite";

// O card aparece sobre o fundo animado congelado, como na home; clicar em NÃO mostra o Tem certeza?.
const configuracaoDasHistorias = {
  title: "Convite/Card do convite",
  component: CardDoConvite,
  decorators: [
    (Historia) => (
      <div className="flex min-h-dvh items-center justify-center px-4 py-10">
        <FundoAnimado segundoInicial={2} congelado />
        <Historia />
      </div>
    ),
  ],
} satisfies Meta<typeof CardDoConvite>;

export default configuracaoDasHistorias;

type Historia = StoryObj<typeof configuracaoDasHistorias>;

export const ConviteAberto: Historia = {};
