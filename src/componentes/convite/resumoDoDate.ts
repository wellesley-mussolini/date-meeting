// Monta a data a partir do texto do campo (AAAA-MM-DD) sem passar por Date: com o fuso do Brasil,
// "2026-11-01" viraria 31/10.
export function formatarDataEHorarioDoDate(data: string, horario: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano} às ${horario}`;
}
