export type RegionNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  hub?: boolean;
};

// Coordenadas en un lienzo abstracto (viewBox 0 0 1000 560), no un mapa
// geográfico real. Laboratorio Central actúa como nodo de coordinación;
// las demás regiones son "estaciones" que reportan hacia él — refleja
// la vigilancia centralizada descrita en la portada.
export const REGION_NODES: RegionNode[] = [
  { id: "Laboratorio Central", label: "LABORATORIO CENTRAL", x: 500, y: 300, hub: true },
  { id: "Región Andina", label: "REGIÓN ANDINA", x: 580, y: 175 },
  { id: "Región Pacífico", label: "REGIÓN PACÍFICO", x: 350, y: 230 },
  { id: "Nacional", label: "RED NACIONAL", x: 660, y: 400 },
  { id: "Región Caribe", label: "REGIÓN CARIBE", x: 420, y: 110 },
];

export function findRegionNode(region: string): RegionNode {
  return (
    REGION_NODES.find((r) => r.id === region) ?? {
      id: region,
      label: region.toUpperCase(),
      x: 500 + (region.length % 5) * 20,
      y: 320 + (region.length % 3) * 15,
    }
  );
}
