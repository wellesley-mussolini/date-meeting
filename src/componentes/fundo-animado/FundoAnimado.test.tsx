import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FundoAnimado } from "./FundoAnimado";

// O jsdom não mede elementos nem tem ResizeObserver; sem isso o Canvas nunca tenta criar o WebGL
// e o teste não reproduziria o navegador real.
class ObservadorDeTamanhoDoNavegador {
  constructor(private readonly avisarMudancaDeTamanho: ResizeObserverCallback) {}
  observe() {
    this.avisarMudancaDeTamanho([], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
}

describe("FundoAnimado sem WebGL", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ObservadorDeTamanhoDoNavegador);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 960, 720));
    // Navegador com aceleração de hardware desligada ou GPU bloqueada: nenhum contexto WebGL é criado.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("mostra o fundo estático em vez de derrubar o layout", () => {
    const { container } = render(<FundoAnimado />);

    expect(container.querySelector("canvas")).toBeNull();
    expect(container.firstElementChild).not.toBeNull();
  });
});
