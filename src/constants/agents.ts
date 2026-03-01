// AI agent configurations for the COUNCIL demo
export interface AgentConfig {
  id: string;
  name: string;
  role: "villager" | "werewolf" | "seer" | "doctor";
  color: string;
  seatIndex: number;
  initial: string;
  personality: string;
}

export const AGENTS: AgentConfig[] = [
  {
    id: "marcus",
    name: "Marcus",
    role: "villager",
    color: "#4ECDC4",
    seatIndex: 0,
    initial: "M",
    personality: "Analytical strategist, always looking for logical inconsistencies",
  },
  {
    id: "lyra",
    name: "Lyra",
    role: "werewolf",
    color: "#FF6B6B",
    seatIndex: 1,
    initial: "L",
    personality: "Charismatic deflector, masters the art of misdirection",
  },
  {
    id: "orion",
    name: "Orion",
    role: "seer",
    color: "#45B7D1",
    seatIndex: 2,
    initial: "O",
    personality: "Cautious observer, reveals truth at the right moment",
  },
  {
    id: "zara",
    name: "Zara",
    role: "villager",
    color: "#FFD93D",
    seatIndex: 3,
    initial: "Z",
    personality: "Passionate accuser, leads with emotion and gut feeling",
  },
  {
    id: "viktor",
    name: "Viktor",
    role: "werewolf",
    color: "#C39BD3",
    seatIndex: 4,
    initial: "V",
    personality: "Quiet manipulator, builds trust before betrayal",
  },
  {
    id: "nina",
    name: "Nina",
    role: "doctor",
    color: "#F1948A",
    seatIndex: 5,
    initial: "N",
    personality: "Empathetic protector, reads emotions to find allies",
  },
  {
    id: "kai",
    name: "Kai",
    role: "villager",
    color: "#76D7C4",
    seatIndex: 6,
    initial: "K",
    personality: "Wild card, shifts alliances to survive",
  },
];

export const TABLE_RADIUS = 1.8;
export const SEAT_RADIUS = 2.8;
export const TABLE_HEIGHT = 0.8;

export function getSeatPosition(
  index: number,
  totalSeats: number = 7
): [number, number, number] {
  const angle = (index / totalSeats) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(angle) * SEAT_RADIUS, 0, Math.sin(angle) * SEAT_RADIUS];
}
