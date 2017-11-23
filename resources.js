export const RARITY = { COMMON, UNCOMMON, RARE, EXOTIC }

/* COMMON GOODS */
export const ALUMINUM = {
    name: 'Aluminum',
    description: 'A base metal used in the construction of new equipment in space!',
    resale: 10,
    rarity: RARITY.COMMON
}

export const TITANIUM = {
    name: 'Titanium',
    description: 'A strong metal used to build new space station parts!',
    resale: 40,
    rarity: RARITY.COMMON
}

export const SUPPLIES = {
    name: 'Supplies',
    description: 'Food and water in convenient packages for consumption in long-term space environments.',
    resale: 15,
    rarity: RARITY.COMMON
}

export const FUEL = {
    name: 'Helium-3 Fuel',
    description: 'Space travel requires Helium-3 combustible fuel, and lots of it!',
    resale: 20,
    rarity: RARITY.COMMON
}

/* UNCOMMON GOODS */
export const HYPER_TORPEDO = {
    name: 'Hyper Torpedo',
    description: 'One of the most common weapons fitted on low-orbit fighter craft.',
    resale: 100,
    rarity: RARITY.UNCOMMON
}

export const CRYOPOD = {
    name: 'Cryopod',
    description: 'Used to store passengers safely during long times of space transport.',
    resale: 250,
    rarity: RARITY.UNCOMMON
}

/* RARE GOODS */
export const SOLAR_ARRAY = {
    name: 'Solar Array',
    description: 'A massive solar array used to power an entire space station.',
    resale: 1500,
    rarity: RARITY.RARE
}

/* EXOTIC */
export const KHERG_CARAPICE = {
    name: 'Kherg Carapice',
    description: 'An iridiscent carapice from an alien parasite, used to create Hyper-Fuel for galactic travel.',
    resale: 100000,
    rarity: RARITY.EXOTIC
}

export const GALACTIC_GATEWAY = {
    name: '?',
    description: 'Some form of alien artifact that predates our Universe.',
    resale: 10000000,
    rarity: RARITY.EXOTIC
}