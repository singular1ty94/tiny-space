import { getRandom } from './helpers'

const planetNameFront = [
    'Betelgeuse',
    'Saturn',
    'Polaris',
    'Maroon',
    'Dustiin',
    'Solarus',
    'Sycarus',
    'Lupin',
    'Neptuna',
    'Horizon',
    'Zygg',
    'Ares',
    'Mercina'
]

const planetNameBack = [
    'Five',
    'Major',
    'Minor',
    'Seven',
    'Nine',
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon'
]

export function planetsGenerator(numPlanets) {
    let defaultPlanets = [];
    for (var i=0; i < numPlanets; i++) {
        defaultPlanets.push({
            name: `${planetNameFront[getRandom(0, planetNameFront.length - 1)]} ${planetNameBack[getRandom(0, planetNameBack.length - 1)]}`,
            population: 50000 * getRandom(1, 20),
            threshold: (i * getRandom(3, 5)) * 1000 + (i * 200),
            imageUrl: `Planet${getRandom(1, 14)}.png`
        });
    }
    return defaultPlanets; 
}