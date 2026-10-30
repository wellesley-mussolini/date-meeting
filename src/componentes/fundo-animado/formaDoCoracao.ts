import { Shape, Vector2 } from "three";
import { gerarContornoDoCoracao } from "./contornoDoCoracao";

export function criarFormaDoCoracao(quantidadeDePontos: number, altura = 1): Shape {
  const verticesDoContorno = gerarContornoDoCoracao(quantidadeDePontos).map(
    ([x, y]) => new Vector2(x * altura, y * altura),
  );
  return new Shape(verticesDoContorno);
}
