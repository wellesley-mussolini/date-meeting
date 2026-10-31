import { ESTILO_DO_BOTAO_PRINCIPAL, ESTILO_DO_TITULO } from "./estilosDoConvite";

const ESTILO_DO_ROTULO = "flex flex-col gap-1 font-semibold text-rose-600";
const ESTILO_DO_CAMPO =
  "rounded-xl border-2 border-rose-200 bg-white px-4 py-3 text-rose-700 focus:border-rose-400 focus:outline-none";

type PropriedadesDaEscolhaDaData = {
  data: string;
  horario: string;
  aoMudarData: (data: string) => void;
  aoMudarHorario: (horario: string) => void;
  aoConfirmarData: () => void;
};

export function EtapaDaEscolhaDaData({
  data,
  horario,
  aoMudarData,
  aoMudarHorario,
  aoConfirmarData,
}: PropriedadesDaEscolhaDaData) {
  // O resumo do final precisa da data e do horário: sem os dois não dá para seguir.
  const faltaDataOuHorario = !data || !horario;

  return (
    <>
      <h1 className={ESTILO_DO_TITULO}>📅 Quando você tá livre?</h1>
      <div className="mt-6 flex flex-col gap-4 text-left">
        <label className={ESTILO_DO_ROTULO}>
          Escolha a data
          <input
            type="date"
            value={data}
            onChange={(evento) => aoMudarData(evento.target.value)}
            className={ESTILO_DO_CAMPO}
          />
        </label>
        <label className={ESTILO_DO_ROTULO}>
          Escolha o horário
          <input
            type="time"
            value={horario}
            onChange={(evento) => aoMudarHorario(evento.target.value)}
            className={ESTILO_DO_CAMPO}
          />
        </label>
      </div>
      <button
        type="button"
        disabled={faltaDataOuHorario}
        onClick={aoConfirmarData}
        className={`mt-8 w-full ${ESTILO_DO_BOTAO_PRINCIPAL}`}
      >
        SELECIONAR A DATA 🖤
      </button>
    </>
  );
}
