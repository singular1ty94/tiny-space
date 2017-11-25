export let RARITY = { COMMONE: 'COMMON', UNCOMMON: 'UNCOMMON', RARE: 'RARE', EXOTIC: 'EXOTIC' }
export let TYPE = { METAL: 'METAL' }

/* COMMON GOODS */
export let ALUMINUM = {
    name: 'Aluminum',
    description: 'A base metal used in the construction of new equipment in space!',
    resale: 10,
    rarity: RARITY.COMMON,
    type: TYPE.METAL,
    held: 0
}

export let TITANIUM = {
    name: 'Titanium',
    description: 'A strong metal used to build new space station parts!',
    resale: 40,
    rarity: RARITY.COMMON,
    type: TYPE.METAL,
    held: 0
}

export let SUPPLIES = {
    name: 'Supplies',
    description: 'Food and water in convenient packages for consumption in long-term space environments.',
    resale: 15,
    rarity: RARITY.COMMON,
    held: 0
}

export let FUEL = {
    name: 'Helium-3 Fuel',
    description: 'Space travel requires Helium-3 combustible fuel, and lots of it!',
    resale: 20,
    rarity: RARITY.COMMON,
    held: 0
}

/* UNCOMMON GOODS */
export let HYPER_TORPEDO = {
    name: 'Hyper Torpedo',
    description: 'One of the most common weapons fitted on low-orbit fighter craft.',
    resale: 100,
    rarity: RARITY.UNCOMMON,
    held: 0
}

export let CRYOPOD = {
    name: 'Cryopod',
    description: 'Used to store passengers safely during long times of space transport.',
    resale: 250,
    rarity: RARITY.UNCOMMON,
    held: 0
}

/* RARE GOODS */
export let SOLAR_ARRAY = {
    name: 'Solar Array',
    description: 'A massive solar array used to power an entire space station.',
    resale: 1500,
    rarity: RARITY.RARE,
    held: 0
}

/* EXOTIC */
export let KHERG_CARAPICE = {
    name: 'Kherg Carapice',
    description: 'An iridiscent carapice from an alien parasite, used to create Hyper-Fuel for galactic travel.',
    resale: 100000,
    rarity: RARITY.EXOTIC,
    held: 0
}

export let GALACTIC_GATEWAY = {
    name: '?',
    description: 'Some form of alien artifact that predates our Universe.',
    resale: 10000000,
    rarity: RARITY.EXOTIC,
    held: 0
}

export let resourceList = [
    ALUMINUM, TITANIUM, SUPPLIES, FUEL, HYPER_TORPEDO, CRYOPOD, SOLAR_ARRAY, KHERG_CARAPICE, GALACTIC_GATEWAY
]