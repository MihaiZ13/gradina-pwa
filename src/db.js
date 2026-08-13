import Dexie from 'dexie';

export const db = new Dexie('GradinaMeaDB');

// Definim structura bazei de date
db.version(1).stores({
  parcels: 'id, name, coordinates', // Bucățile de teren/poligoanele
  plantings: '++id, parcelId, year, plantId', // Istoricul pe ani
  plants: 'id, name, family, description' // Lista de plante
});

// Adăugăm un catalog inițial de plante cu familiile lor botanice
db.on('populate', async () => {
  await db.plants.bulkAdd([
    { id: 'rosii', name: 'Roșii', family: 'Solanaceae', description: 'Consumator mare de nutrienți. Evită după cartofi/ardei.' },
    { id: 'ardei', name: 'Ardei', family: 'Solanaceae', description: 'Familia Solanaceae. Necesită soare și sol bogat.' },
    { id: 'cartofi', name: 'Cartofi', family: 'Solanaceae', description: 'Epuizează solul de potasiu.' },
    { id: 'mazare', name: 'Mazăre', family: 'Fabaceae', description: 'Fixează azotul în sol. Excelent premergător!' },
    { id: 'fasole', name: 'Fasole', family: 'Fabaceae', description: 'Fixează azotul în sol.' },
    { id: 'varza', name: 'Varză', family: 'Brassicaceae', description: 'Iubește solul bogat în azot (după fasole/mazăre).' },
    { id: 'morcov', name: 'Morcov', family: 'Umbelliferae', description: 'Rădăcinoase. Preferă sol lejer.' },
    { id: 'ceapa', name: 'Ceapă', family: 'Alliaceae', description: 'Protejează împotriva unor dăunători.' },
    { id: 'usturoi', name: 'Usturoi', family: 'Alliaceae', description: 'Bun dezinfectant pentru sol.' }
  ]);
});

// Funcție ajutătoare pentru VERIFICAREA ROTAȚIEI
export async function checkRotationRules(parcelId, newPlantId, targetYear) {
  const newPlant = await db.plants.get(newPlantId);
  if (!newPlant) return null;

  // Căutăm ce s-a plantat anul trecut pe această parcelă
  const lastYearPlanting = await db.plantings
    .where({ parcelId: parcelId, year: targetYear - 1 })
    .first();

  if (!lastYearPlanting) return { status: 'ok', message: 'Terenul a fost liber anul trecut.' };

  const lastPlant = await db.plants.get(lastYearPlanting.plantId);

  // Regula 1: Avertisment de aceeași familie
  if (lastPlant.family === newPlant.family) {
    return {
      status: 'warning',
      message: `⚠️ Atenție: Anul trecut ai avut tot o plantă din familia ${lastPlant.family} (${lastPlant.name}). Rotația recomandă schimbarea familiei pentru a evita dăunătorii!`
    };
  }

  // Regula 2: Recomandare benefică (după Leguminoase / Fabaceae)
  if (lastPlant.family === 'Fabaceae') {
    return {
      status: 'success',
      message: `✅ Excelent! Anul trecut ai avut ${lastPlant.name} care a îmbogățit solul cu azot. ${newPlant.name} va crește foarte bine aici!`
    };
  }

  return { status: 'ok', message: `Urmare bună după ${lastPlant.name}.` };
}