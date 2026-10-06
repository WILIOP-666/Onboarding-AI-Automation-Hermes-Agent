export type LocationState = {
  country: string;
  state: string;
  city: string;
  options: string[];
};

export function changeCountry(
  current: LocationState,
  country: string,
): LocationState {
  // Seeded defect: dependent fields survive even when they belong to the old country.
  return { ...current, country };
}

export function changeState(
  current: LocationState,
  state: string,
): LocationState {
  // Seeded defect: the selected city may not exist in the new state.
  return { ...current, state };
}

export function applyOptions(
  current: LocationState,
  responseCountry: string,
  options: string[],
): LocationState {
  // Seeded defect: an older request can overwrite options for a newer country.
  return { ...current, country: responseCountry, options };
}
