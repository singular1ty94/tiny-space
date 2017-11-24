let SPACE_FARM = {
    name: 'Space Farm',
    cost: 250,
    benefit: 0.2,
    type: 'COMMODITY_GAIN',
    description: 'Grow fresh produce for sale on the galactic market and increase your commodities gained.',
    display: {
        url: 'dist/resources/station/space_farm.png',
        orbital: 150,
        image: null,
        direction: false,
        angle: 0,
        speed: 1.5
    }
}

let MEDIUM_SPACE_FARM = {
    name: 'Medium Space Farm',
    cost: 750,
    benefit: 0.4,
    type: 'COMMODITY_GAIN',
    description: 'Expand your agricultural yields with larger farms and gain more commodities.',
    display: {
        url: 'dist/resources/station/space_farm.png',
        orbital: 150,
        image: null,
        direction: false,
        angle: 0,
        speed: 1.5
    }
}

let SATELLITE_RELAY = {
    name: 'Satellite Relay',
    cost: 500,
    benefit: 0.2,
    type: 'DEFENSE_ACCURACY',
    description: 'Early-warning detection systems help you accurately defeat enemies.',
    display: {
        url: 'dist/resources/station/space_farm.png',
        orbital: 150,
        image: null,
        direction: false,
        angle: 0,
        speed: 1.5
    }
}

let LOW_RING_APARTMENTS = {
    name: 'Lower Ring Apartments',
    cost: 300,
    benefit: 0.5,
    type: 'CITIZEN_GAIN',
    description: 'More room to live means more citizens will emigrate to your habitat.',
    display: {
        url: 'dist/resources/station/space_farm.png',
        orbital: 150,
        image: null,
        direction: false,
        angle: 0,
        speed: 1.5
    }
}

export let addons = [
    SPACE_FARM,
    MEDIUM_SPACE_FARM,
    SATELLITE_RELAY,
    LOW_RING_APARTMENTS
]