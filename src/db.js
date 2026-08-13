import Dexie from 'dexie';

export const db = new Dexie('GradinaPWA');

db.version(4).stores({
  gardens: 'id, name',
  parcels: 'id, gardenId, name',
  plants: 'id, name, family',
  plantings: '++id, parcelId, year, plantId',
  settings: 'key'
});

export const defaultPlants = [
  { id: '1', name: 'Roșii', family: 'Solanaceae', spacing: '40-50 cm', sun: 'Soare plin', water: 'Moderat', companions: 'Busuioc, Morcovi, Ceapă, Pătrunjel', avoid: 'Cartofi, Fenicul' },
  { id: '2', name: 'Ardei', family: 'Solanaceae', spacing: '30-40 cm', sun: 'Soare plin', water: 'Moderat', companions: 'Busuioc, Ceapă, Spanac', avoid: 'Mazăre, Fasole' },
  { id: '3', name: 'Mazăre', family: 'Fabaceae', spacing: '5-10 cm', sun: 'Soare / Parțial', water: 'Moderat', companions: 'Morcovi, Castraveți, Porumb', avoid: 'Ceapă, Usturoi' },
  { id: '4', name: 'Morcovi', family: 'Apiaceae', spacing: '5 cm', sun: 'Soare plin', water: 'Moderat', companions: 'Mazăre, Praz, Ceapă, Roșii', avoid: 'Mărar, Păstârnac' },
  { id: '5', name: 'Ceapă', family: 'Amaryllidaceae', spacing: '10 cm', sun: 'Soare plin', water: 'Rar', companions: 'Morcovi, Roșii, Căpșuni', avoid: 'Mazăre, Fasole' },
  { id: '6', name: 'Busuioc', family: 'Lamiaceae', spacing: '20 cm', sun: 'Soare plin', water: 'Moderat', companions: 'Roșii, Ardei', avoid: 'Cimbru' },
  { id: '7', name: 'Castraveți', family: 'Cucurbitaceae', spacing: '30-40 cm', sun: 'Soare plin', water: 'Abundent', companions: 'Mazăre, Fasole, Floarea soarelui', avoid: 'Cartofi, Aromatice tari' },
  { id: '8', name: 'Usturoi', family: 'Amaryllidaceae', spacing: '10-15 cm', sun: 'Soare plin', water: 'Rar', companions: 'Roșii, Morcovi, Căpșuni', avoid: 'Mazăre, Fasole' },
];

db.on('populate', async () => {
  await db.plants.bulkAdd(defaultPlants);
});

export async function ensureDefaultPlants() {
  const count = await db.plants.count();
  if (count === 0) {
    await db.plants.bulkAdd(defaultPlants);
  }
}

export async function checkRotationRules(parcelId, plantId, year) {
  const previousPlanting = await db.plantings
    .where({ parcelId, year: year - 1 })
    .first();

  if (!previousPlanting) {
    return { status: 'info', message: 'Terenul a fost liber anul trecut.' };
  }

  const currentPlant = await db.plants.get(plantId);
  const previousPlant = await db.plants.get(previousPlanting.plantId);

  if (currentPlant && previousPlant && currentPlant.family === previousPlant.family) {
    return {
      status: 'warning',
      message: `⚠️ Atenție: Anul trecut ai avut ${previousPlant.name} (${previousPlant.family}). Nu se recomandă plante din aceeași familie consecutiv!`
    };
  }

  return {
    status: 'success',
    message: `✅ Rotație bună! Anul trecut ai avut ${previousPlant?.name}.`
  };
}