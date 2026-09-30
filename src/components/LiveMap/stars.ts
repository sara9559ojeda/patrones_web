// PRNG determinista (mismo resultado en servidor y cliente) para evitar
// errores de hidratación: nada de Math.random() en el render.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export type Star = { x: string; y: string; size: string; delay: string };

// Valores fijados a pocos decimales: evita que la representación en texto
// del número difiera entre el render del servidor y el del cliente.
function round(n: number, decimals: number) {
  return n.toFixed(decimals);
}

export function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    x: round(seeded(i, 1) * 100, 3),
    y: round(seeded(i, 2) * 100, 3),
    size: round(1 + seeded(i, 3) * 1.6, 2),
    delay: round(seeded(i, 4) * 4, 2),
  }));
}
