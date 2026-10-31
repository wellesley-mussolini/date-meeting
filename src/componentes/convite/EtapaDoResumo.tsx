import { ESTILO_DO_TITULO } from "./estilosDoConvite";
import type { ProgramaDoDate } from "./programasDoDate";
import { formatarDataEHorarioDoDate } from "./resumoDoDate";

type PropriedadesDoResumo = {
  data: string;
  horario: string;
  programasEscolhidos: ProgramaDoDate[];
};

export function EtapaDoResumo({ data, horario, programasEscolhidos }: PropriedadesDoResumo) {
  return (
    <>
      <h1 className={ESTILO_DO_TITULO}>TÔ CONTIGO GATINHA. 🖤</h1>
      <p className="mt-3 text-lg text-rose-500">Fica pronta que eu vou te buscar 🚗</p>
      <ul className="mt-6 flex flex-col gap-2 rounded-2xl bg-rose-50 px-5 py-4 text-left text-lg font-semibold text-rose-600">
        <li>📅 {formatarDataEHorarioDoDate(data, horario)}</li>
        {programasEscolhidos.map(({ nome, icone }) => (
          <li key={nome}>
            {icone} {nome}
          </li>
        ))}
      </ul>
    </>
  );
}
