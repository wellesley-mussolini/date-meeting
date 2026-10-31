import { ESTILO_DO_BOTAO_PRINCIPAL, ESTILO_DO_TITULO } from "./estilosDoConvite";
import { PROGRAMAS_DO_DATE } from "./programasDoDate";

type PropriedadesDaEscolhaDoPrograma = {
  nomesDosProgramasEscolhidos: string[];
  aoAlternarPrograma: (nomeDoPrograma: string) => void;
  aoConfirmarProgramas: () => void;
};

export function EtapaDaEscolhaDoPrograma({
  nomesDosProgramasEscolhidos,
  aoAlternarPrograma,
  aoConfirmarProgramas,
}: PropriedadesDaEscolhaDoPrograma) {
  return (
    <>
      <h1 className={ESTILO_DO_TITULO}>O que você tá afim?</h1>
      {/* Duas colunas no celular e quatro no monitor: as oito opções cabem na tela sem rolar demais. */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3">
        {PROGRAMAS_DO_DATE.map(({ nome, icone }) => {
          const programaFoiEscolhido = nomesDosProgramasEscolhidos.includes(nome);
          return (
            <button
              key={nome}
              type="button"
              aria-pressed={programaFoiEscolhido}
              onClick={() => aoAlternarPrograma(nome)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 text-sm font-bold transition active:scale-95 sm:py-4 sm:text-base ${
                programaFoiEscolhido
                  ? "border-rose-500 bg-rose-50 text-rose-600 shadow-md"
                  : "border-rose-100 bg-white text-rose-400 hover:border-rose-300"
              }`}
            >
              <span aria-hidden className="text-3xl sm:text-4xl">
                {icone}
              </span>
              {nome}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={nomesDosProgramasEscolhidos.length === 0}
        onClick={aoConfirmarProgramas}
        className={`mt-8 w-full ${ESTILO_DO_BOTAO_PRINCIPAL}`}
      >
        ISSO PARECE LEGAL! 😎
      </button>
    </>
  );
}
