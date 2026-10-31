import { describe, expect, it } from "vitest";
import { formatarDataEHorarioDoDate } from "./resumoDoDate";

describe("formatarDataEHorarioDoDate", () => {
  it("escreve a data do campo de data no jeito brasileiro, com o horário", () => {
    expect(formatarDataEHorarioDoDate("2026-11-14", "19:30")).toBe("14/11/2026 às 19:30");
  });

  // Converter para Date usaria o fuso: "2026-11-01" vira 31/10 no Brasil. O texto do campo é a data certa.
  it("mantém o dia escolhido sem passar pelo fuso horário", () => {
    expect(formatarDataEHorarioDoDate("2026-11-01", "08:05")).toBe("01/11/2026 às 08:05");
  });
});
