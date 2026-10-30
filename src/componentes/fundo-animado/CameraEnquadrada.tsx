"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { calcularDistanciaDaCamera } from "./enquadramentoDaCamera";

export function CameraEnquadrada() {
  const camera = useThree((estadoDoCanvas) => estadoDoCanvas.camera);
  const larguraDaTela = useThree((estadoDoCanvas) => estadoDoCanvas.size.width);
  const alturaDaTela = useThree((estadoDoCanvas) => estadoDoCanvas.size.height);

  useLayoutEffect(() => {
    camera.position.set(0, 0, calcularDistanciaDaCamera(larguraDaTela / alturaDaTela));
    camera.lookAt(0, 0, 0);
  }, [camera, larguraDaTela, alturaDaTela]);

  return null;
}
