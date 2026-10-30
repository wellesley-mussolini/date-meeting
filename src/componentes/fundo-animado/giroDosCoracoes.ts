// Uma onda atravessa a cena e cada coração dá meia-volta no próprio eixo enquanto ela passa. Meia-volta
// basta porque o coração é simétrico: termina igual ao começo e só fica de lado uma vez, como no vídeo.
// Com a duração do giro igual ao intervalo entre vizinhos, um termina quando o próximo começa (dominó).
export function calcularGiroNaPassagemDaOnda(
  segundos: number,
  atrasoDoCoracao: number,
  periodoDaOnda: number,
  duracaoDoGiro: number,
): number {
  const segundosDesdeAChegadaDaOnda = (((segundos - atrasoDoCoracao) % periodoDaOnda) + periodoDaOnda) % periodoDaOnda;
  if (segundosDesdeAChegadaDaOnda >= duracaoDoGiro) return 0;
  const avancoDoGiro = segundosDesdeAChegadaDaOnda / duracaoDoGiro;
  const avancoSuavizado = (1 - Math.cos(Math.PI * avancoDoGiro)) / 2;
  return avancoSuavizado * Math.PI;
}
