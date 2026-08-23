export const personas = [
  {
    slug: "adults",
    title: "Adults",
    description: "Textiles, guidance, and experiences for how you actually sleep.",
  },
  {
    slug: "babies",
    title: "Babies",
    description: "Gentle, safe sleep essentials for the newest members of the family.",
  },
  {
    slug: "children",
    title: "Children",
    description: "Comfortable, durable sleep products built for growing routines.",
  },
  {
    slug: "pets",
    title: "Pets",
    description: "Restful sleep essentials for the four-legged sleepers too.",
  },
] as const;

export type Persona = (typeof personas)[number]["slug"];

export function isPersona(value: string): value is Persona {
  return personas.some((persona) => persona.slug === value);
}

export function getPersona(slug: string) {
  return personas.find((persona) => persona.slug === slug);
}
