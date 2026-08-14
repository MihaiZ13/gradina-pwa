import Dexie from 'dexie';

export const db = new Dexie('GradinaPWA');

db.version(5).stores({
  gardens: 'id, name',
  parcels: 'id, gardenId, name, row, col',
  plants: 'id, name, family',
  plantings: '++id, parcelId, year, plantId, [parcelId+year]',
  settings: 'key'
});

export const defaultPlants = [
  {
    id: '1',
    name: 'Roșii',
    family: 'Solanaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Busuioc, Morcov, Ceapă, Pătrunjel, Craițe, Gălbenele',
    avoid: 'Nuc, Cartof, Fenicul, Varză'
  },
  {
    id: '2',
    name: 'Ardei (Gras/Kapia/Iute)',
    family: 'Solanaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Busuioc, Ceapă, Spanac, Morcov, Oregano',
    avoid: 'Fasole urcătoare, Fenicul, Varză'
  },
  {
    id: '3',
    name: 'Vinete',
    family: 'Solanaceae',
    spacing: '45-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Fasole, Busuioc, Spanac, Mazăre, Cimbru',
    avoid: 'Cartof, Roșii'
  },
  {
    id: '4',
    name: 'Cartof',
    family: 'Solanaceae',
    spacing: '30-35 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Fasole, Varză, Porumb, Craițe, Hrean',
    avoid: 'Roșii, Castravete, Dovlecel, Floarea-soarelui'
  },
  {
    id: '5',
    name: 'Castravete',
    family: 'Cucurbitaceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Mazăre, Fasole, Ridichi, Porumb, Mărar, Floarea-soarelui',
    avoid: 'Cartof, Plante aromatice lemnoase'
  },
  {
    id: '6',
    name: 'Dovlecel',
    family: 'Cucurbitaceae',
    spacing: '60-80 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Porumb, Fasole, Mentă, Craițe, Ridichi',
    avoid: 'Cartof'
  },
  {
    id: '7',
    name: 'Dovleac',
    family: 'Cucurbitaceae',
    spacing: '100-150 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Porumb, Fasole, Floarea-soarelui, Craițe',
    avoid: 'Cartof'
  },
  {
    id: '8',
    name: 'Pepene roșu',
    family: 'Cucurbitaceae',
    spacing: '80-100 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Ridichi, Oregano, Craițe',
    avoid: 'Cartof, Dovlecel'
  },
  {
    id: '9',
    name: 'Pepene galben',
    family: 'Cucurbitaceae',
    spacing: '80-100 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Ridichi, Craițe, Busuioc',
    avoid: 'Cartof, Castraveți'
  },
  {
    id: '10',
    name: 'Morcov',
    family: 'Apiaceae',
    spacing: '5-10 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Praz, Ceapă, Roșii, Salată, Mazăre, Rozmarin',
    avoid: 'Mărar, Păstârnac, Fenicul'
  },
  {
    id: '11',
    name: 'Pătrunjel',
    family: 'Apiaceae',
    spacing: '10-15 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Roșii, Ceapă, Gălbenele, Sparanghel',
    avoid: 'Mărar, Țelină'
  },
  {
    id: '12',
    name: 'Păstârnac',
    family: 'Apiaceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Ceapă, Usturoi, Salată, Ridichi',
    avoid: 'Morcov, Mărar, Țelină'
  },
  {
    id: '13',
    name: 'Țelină',
    family: 'Apiaceae',
    spacing: '25-30 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Abundent',
    companions: 'Roșii, Varză, Praz, Fasole, Spanac',
    avoid: 'Morcov, Păstârnac'
  },
  {
    id: '14',
    name: 'Mărar',
    family: 'Apiaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Varză, Castraveți, Ceapă, Salată',
    avoid: 'Morcov, Roșii, Fenicul'
  },
  {
    id: '15',
    name: 'Leuștean',
    family: 'Apiaceae',
    spacing: '50-60 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Salată, Fasole, Varză',
    avoid: 'Nu are antagoniști direcți (plantează separat din cauza dimensiunii)'
  },
  {
    id: '16',
    name: 'Ceapă',
    family: 'Amaryllidaceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Sfeclă, Roșii, Salată, Căpșuni',
    avoid: 'Mazăre, Fasole, Sparanghel'
  },
  {
    id: '17',
    name: 'Usturoi',
    family: 'Amaryllidaceae',
    spacing: '10-12 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Roșii, Vinete, Morcov, Sfeclă, Căpșuni, Trandafiri',
    avoid: 'Mazăre, Fasole, Sparanghel'
  },
  {
    id: '18',
    name: 'Praz',
    family: 'Amaryllidaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Sfeclă, Țelină, Salată, Căpșuni',
    avoid: 'Mazăre, Fasole'
  },
  {
    id: '19',
    name: 'Mazăre',
    family: 'Fabaceae',
    spacing: '5-8 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Ridichi, Castraveți, Porumb, Varză',
    avoid: 'Ceapă, Usturoi, Praz'
  },
  {
    id: '20',
    name: 'Fasole',
    family: 'Fabaceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Castraveți, Cartof, Morcov, Sfeclă, Cimbru',
    avoid: 'Ceapă, Usturoi, Praz, Fenicul'
  },
  {
    id: '21',
    name: 'Bob',
    family: 'Fabaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Cartof, Varză, Porumb, Morcov',
    avoid: 'Ceapă, Usturoi'
  },
  {
    id: '22',
    name: 'Varză',
    family: 'Brassicaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Țelină, Mărar, Cimbru, Mentă, Salată, Cartof',
    avoid: 'Roșii, Ardei, Căpșuni, Fasole urcătoare'
  },
  {
    id: '23',
    name: 'Conopidă',
    family: 'Brassicaceae',
    spacing: '45-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Țelină, Oregano, Cimbru, Spanac',
    avoid: 'Roșii, Căpșuni, Mazăre'
  },
  {
    id: '24',
    name: 'Broccoli',
    family: 'Brassicaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Țelină, Mărar, Rozmarin, Mentă, Salată',
    avoid: 'Roșii, Căpșuni, Oregano'
  },
  {
    id: '25',
    name: 'Ridichi',
    family: 'Brassicaceae',
    spacing: '5-7 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Morcov, Castraveți, Salată, Spanac, Mazăre',
    avoid: 'Hrean, Varză'
  },
  {
    id: '26',
    name: 'Gulie',
    family: 'Brassicaceae',
    spacing: '20-25 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Sfeclă, Castraveți, Salată, Cimbru, Mărar',
    avoid: 'Roșii, Ardei, Căpșuni'
  },
  {
    id: '27',
    name: 'Rucola',
    family: 'Brassicaceae',
    spacing: '10-15 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Morcov, Salată, Sfeclă, Mărar',
    avoid: 'Busuioc'
  },
  {
    id: '28',
    name: 'Hrean',
    family: 'Brassicaceae',
    spacing: '40-50 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Cartof, Varză, Pom fructifer',
    avoid: 'Ridichi'
  },
  {
    id: '29',
    name: 'Salată verde',
    family: 'Asteraceae',
    spacing: '20-25 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Morcov, Ridichi, Căpșuni, Ceapă, Castraveți',
    avoid: 'Țelină, Păstârnac'
  },
  {
    id: '30',
    name: 'Floarea-soarelui',
    family: 'Asteraceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Castraveți',
    avoid: 'Cartof, Roșii'
  },
  {
    id: '31',
    name: 'Spanac',
    family: 'Amaranthaceae',
    spacing: '10-15 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Căpșuni, Vinete, Fasole, Mazăre, Varză',
    avoid: 'Nu are necompatibilități majore'
  },
  {
    id: '32',
    name: 'Sfeclă roșie',
    family: 'Amaranthaceae',
    spacing: '10-15 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Ceapă, Usturoi, Salată, Varză, Praz',
    avoid: 'Fasole urcătoare, Mustar'
  },
  {
    id: '33',
    name: 'Lobodă',
    family: 'Amaranthaceae',
    spacing: '20-25 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Salată, Ridichi, Varză',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '34',
    name: 'Căpșuni',
    family: 'Rosaceae',
    spacing: '25-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Usturoi, Ceapă, Spanac, Salată, Cimbru',
    avoid: 'Varză, Conopidă, Broccoli, Cartof'
  },
  {
    id: '35',
    name: 'Busuioc',
    family: 'Lamiaceae',
    spacing: '20-25 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Roșii, Ardei, Vinete, Oregano',
    avoid: 'Rucola, Mărar'
  },
  {
    id: '36',
    name: 'Cimbru',
    family: 'Lamiaceae',
    spacing: '20-25 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Varză, Vinete, Roșii, Fasole, Căpșuni',
    avoid: 'Mărar'
  },
  {
    id: '37',
    name: 'Oregano (Șovârv)',
    family: 'Lamiaceae',
    spacing: '25-30 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Ardei, Vinete, Roșii, Dovlecel',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '38',
    name: 'Mentă',
    family: 'Lamiaceae',
    spacing: '30-40 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Varză, Roșii',
    avoid: 'Pătrunjel'
  },
  {
    id: '39',
    name: 'Rozmarin',
    family: 'Lamiaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Morcov, Varză, Fasole, Salvie',
    avoid: 'Castraveți, Cartof'
  },
  {
    id: '40',
    name: 'Salvie',
    family: 'Lamiaceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Varză, Morcov, Rozmarin',
    avoid: 'Castraveți, Ceapă'
  },
  {
    id: '41',
    name: 'Porumb dulce',
    family: 'Poaceae',
    spacing: '25-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Fasole, Dovleac, Dovlecel, Mazăre, Castraveți, Floarea-soarelui',
    avoid: 'Roșii'
  },
  {
    id: '42',
    name: 'Ștevie',
    family: 'Polygonaceae',
    spacing: '30-40 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Praz, Ceapă',
    avoid: 'Mazăre'
  },
  {
    id: '43',
    name: 'Batat (Cartof dulce)',
    family: 'Convolvulaceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Cimbru, Mărar, Varză',
    avoid: 'Dovlecel'
  },
  {
    id: '44',
    name: 'Sparanghel',
    family: 'Asparagaceae',
    spacing: '45-50 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Roșii, Pătrunjel, Busuioc, Salată',
    avoid: 'Ceapă, Usturoi, Praz'
  },
  {
    id: '45',
    name: 'Mangold (Sfeclă de frunze)',
    family: 'Amaranthaceae',
    spacing: '20-30 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Ceapă, Fasole, Ridichi, Morcov',
    avoid: 'Spanac'
  },
  {
    id: '46',
    name: 'Topinambur',
    family: 'Asteraceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Floarea-soarelui',
    avoid: 'Cartof'
  },
  {
    id: '47',
    name: 'Fenicul',
    family: 'Apiaceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Salată, Mentă',
    avoid: 'Roșii, Morcov, Fasole, Ardei, Coriandru'
  },
  {
    id: '48',
    name: 'Coriandru',
    family: 'Apiaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Spanac, Chimen, Praz, Anason',
    avoid: 'Fenicul'
  },
  {
    id: '49',
    name: 'Chimen',
    family: 'Apiaceae',
    spacing: '20-25 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Mazăre, Praz, Varză',
    avoid: 'Fenicul'
  },
  {
    id: '50',
    name: 'Anason',
    family: 'Apiaceae',
    spacing: '20-25 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Coriandru, Varză',
    avoid: 'Morcov'
  },
  {
    id: '51',
    name: 'Tarhon',
    family: 'Asteraceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Vinete, Roșii, Salată',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '52',
    name: 'Măghiran',
    family: 'Lamiaceae',
    spacing: '20-25 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Ceapă, Varză, Morcov',
    avoid: 'Fenicul'
  },
  {
    id: '53',
    name: 'Isop',
    family: 'Lamiaceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Varză, Viță de vie',
    avoid: 'Ridichi'
  },
  {
    id: '54',
    name: 'Lavandă',
    family: 'Lamiaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Cimbru, Oregano, Rozmarin, Trandafiri',
    avoid: 'Plante iubitoare de umiditate excesivă'
  },
  {
    id: '55',
    name: 'Roiniță (Melisă)',
    family: 'Lamiaceae',
    spacing: '30-40 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Roșii, Varză',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '56',
    name: 'Limba mielului (Borago)',
    family: 'Boraginaceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Roșii, Dovlecel, Căpșuni',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '57',
    name: 'Schinduf',
    family: 'Fabaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Castraveți',
    avoid: 'Ceapă, Usturoi'
  },
  {
    id: '58',
    name: 'Năut',
    family: 'Fabaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Porumb, Cartof, Morcov',
    avoid: 'Ceapă, Usturoi'
  },
  {
    id: '59',
    name: 'Linte',
    family: 'Fabaceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Castraveți',
    avoid: 'Ceapă, Usturoi'
  },
  {
    id: '60',
    name: 'Soia',
    family: 'Fabaceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Dovleac',
    avoid: 'Ceapă'
  },
  {
    id: '61',
    name: 'Bamă (Bami)',
    family: 'Malvaceae',
    spacing: '30-40 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Ardei, Vinete, Porumb',
    avoid: 'Cartof'
  },
  {
    id: '62',
    name: 'Physalis (Tomatillo)',
    family: 'Solanaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Busuioc, Praz, Morcov',
    avoid: 'Cartof, Fenicul'
  },
  {
    id: '63',
    name: 'Varză de Bruxelles',
    family: 'Brassicaceae',
    spacing: '50-60 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Țelină, Mărar, Salată',
    avoid: 'Roșii, Căpșuni'
  },
  {
    id: '64',
    name: 'Varză Kale',
    family: 'Brassicaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Sfeclă, Cimbru, Mărar',
    avoid: 'Roșii, Fasole urcătoare'
  },
  {
    id: '65',
    name: 'Varză Chinezească (Bok Choy)',
    family: 'Brassicaceae',
    spacing: '25-30 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Mentă, Ridichi, Salată',
    avoid: 'Roșii'
  },
  {
    id: '66',
    name: 'Nap (Sfeclă albă)',
    family: 'Brassicaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Mazăre, Mentă',
    avoid: 'Muștar'
  },
  {
    id: '67',
    name: 'Ridiche neagră (de iarnă)',
    family: 'Brassicaceae',
    spacing: '10-15 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Morcov, Spanac, Salată',
    avoid: 'Hrean'
  },
  {
    id: '68',
    name: 'Creson de grădină',
    family: 'Brassicaceae',
    spacing: '5-10 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Salată, Morcov',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '69',
    name: 'Fetică (Salată de câmp)',
    family: 'Caprifoliaceae',
    spacing: '10-15 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Ridichi, Ceapă, Căpșuni',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '70',
    name: 'Măcriș',
    family: 'Polygonaceae',
    spacing: '20-25 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Ceapă, Căpșuni, Praz',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '71',
    name: 'Anghinare',
    family: 'Asteraceae',
    spacing: '80-100 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Floarea-soarelui, Salată',
    avoid: 'Fenicul'
  },
  {
    id: '72',
    name: 'Endivie (Cicoare de salată)',
    family: 'Asteraceae',
    spacing: '25-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Ridichi',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '73',
    name: 'Untișor',
    family: 'Ranunculaceae',
    spacing: '10-15 cm',
    sun: 'Umbră / Umbră parțială',
    water: 'Moderat',
    companions: 'Pom fructifer, Salată',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '74',
    name: 'Negrilică (Chimen negru)',
    family: 'Ranunculaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Praz, Morcov',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '75',
    name: 'Fragă',
    family: 'Rosaceae',
    spacing: '20-25 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Usturoi, Ceapă, Cimbru',
    avoid: 'Varză'
  },
  {
    id: '76',
    name: 'Gălbenele',
    family: 'Asteraceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Roșii, Castraveți, Morcov, Fasole',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '77',
    name: 'Craițe (Tagetes)',
    family: 'Asteraceae',
    spacing: '20-25 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Roșii, Vinete, Cartof, Pepene',
    avoid: 'Fasole'
  },
  {
    id: '78',
    name: 'Arpagic verde (Chives)',
    family: 'Amaryllidaceae',
    spacing: '15-20 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Morcov, Roșii, Trandafiri',
    avoid: 'Mazăre, Fasole'
  },
  {
    id: '79',
    name: 'Eșalotă',
    family: 'Amaryllidaceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Sfeclă, Morcov, Salată',
    avoid: 'Mazăre, Fasole'
  },
  {
    id: '80',
    name: 'Stevia dulce (Stevia rebaudiana)',
    family: 'Asteraceae',
    spacing: '25-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Busuioc, Cimbru',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '81',
    name: 'Păpădie de grădină',
    family: 'Asteraceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Salată, Pomi fructiferi',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '82',
    name: 'Mac de grădină',
    family: 'Papaveraceae',
    spacing: '20-25 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Salată, Morcov',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '83',
    name: 'Varză roșie',
    family: 'Brassicaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Țelină, Mărar, Ceapă, Sfeclă, Spanac, Mușețel',
    avoid: 'Roșii, Căpșuni, Fasole urcătoare'
  },
  {
    id: '84',
    name: 'Varză creață (Savoy)',
    family: 'Brassicaceae',
    spacing: '40-50 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Țelină, Ceapă, Mărar, Spanac, Cimbru',
    avoid: 'Roșii, Căpșuni, Fasole urcătoare'
  },
  {
    id: '85',
    name: 'Muștar de frunze',
    family: 'Brassicaceae',
    spacing: '20-30 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Mărar, Ceapă, Salată, Sfeclă, Spanac',
    avoid: 'Căpșuni, Roșii'
  },
  {
    id: '86',
    name: 'Nap suedez (Rutabaga)',
    family: 'Brassicaceae',
    spacing: '25-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Mazăre, Ceapă, Salată, Mărar',
    avoid: 'Muștar'
  },
  {
    id: '87',
    name: 'Țelină de rădăcină',
    family: 'Apiaceae',
    spacing: '25-30 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Abundent',
    companions: 'Varză, Ceapă, Praz, Fasole, Roșii, Salată',
    avoid: 'Morcov, Păstârnac'
  },
  {
    id: '88',
    name: 'Asmățui',
    family: 'Apiaceae',
    spacing: '15-20 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Ridichi, Salată, Morcov',
    avoid: 'Fenicul'
  },
  {
    id: '89',
    name: 'Pătrunjel de rădăcină',
    family: 'Apiaceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Roșii, Ceapă, Praz, Sparanghel, Salată',
    avoid: 'Mărar, Fenicul, Țelină'
  },
  {
    id: '90',
    name: 'Cicoare',
    family: 'Asteraceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Ridichi, Salată, Ceapă',
    avoid: 'Fenicul'
  },
  {
    id: '91',
    name: 'Radicchio',
    family: 'Asteraceae',
    spacing: '25-30 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Morcov, Ceapă, Ridichi, Praz',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '92',
    name: 'Escarolă',
    family: 'Asteraceae',
    spacing: '25-30 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Morcov, Ridichi, Ceapă',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '93',
    name: 'Mușețel',
    family: 'Asteraceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Varză, Ceapă, Salată, Castraveți',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '94',
    name: 'Salsifi',
    family: 'Asteraceae',
    spacing: '10-15 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Morcov, Ceapă, Salată',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '95',
    name: 'Condurași (Năsturel indian)',
    family: 'Tropaeolaceae',
    spacing: '30-40 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Dovleac, Dovlecel, Castravete, Roșii, Ridichi',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '96',
    name: 'Năsturel de apă',
    family: 'Brassicaceae',
    spacing: '15-20 cm',
    sun: 'Umbră / Umbră parțială',
    water: 'Abundent',
    companions: 'Salată, Ridichi, Spanac',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '97',
    name: 'Rubarbă',
    family: 'Polygonaceae',
    spacing: '90-120 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Abundent',
    companions: 'Căpșuni, Usturoi, Ceapă, Cimbru',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '98',
    name: 'Patison',
    family: 'Cucurbitaceae',
    spacing: '80-100 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Porumb, Fasole, Condurași, Mărar, Ridichi',
    avoid: 'Cartof'
  },
  {
    id: '99',
    name: 'Dovleac Butternut',
    family: 'Cucurbitaceae',
    spacing: '100-150 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Porumb, Fasole, Condurași, Gălbenele',
    avoid: 'Cartof'
  },
  {
    id: '100',
    name: 'Cimbrișor de grădină',
    family: 'Lamiaceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Varză, Vinete, Roșii, Fasole, Căpșuni',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '101',
    name: 'Zmeur',
    family: 'Rosaceae',
    spacing: '60-100 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Usturoi, Ceapă, Cimbru, Gălbenele',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '102',
    name: 'Mur',
    family: 'Rosaceae',
    spacing: '100-150 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Usturoi, Ceapă, Cimbru, Gălbenele',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '103',
    name: 'Coacăz roșu',
    family: 'Grossulariaceae',
    spacing: '90-120 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Căpșuni, Cimbru, Gălbenele',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '104',
    name: 'Coacăz negru',
    family: 'Grossulariaceae',
    spacing: '120-150 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Căpșuni, Cimbru, Gălbenele',
    avoid: 'Pin cu cinci ace în zone cu risc de rugina coacăzului'
  },
  {
    id: '105',
    name: 'Agriș',
    family: 'Grossulariaceae',
    spacing: '90-120 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Căpșuni, Cimbru, Gălbenele',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '106',
    name: 'Afin',
    family: 'Ericaceae',
    spacing: '100-150 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Căpșuni, Cimbru, Gălbenele',
    avoid: 'Soluri calcaroase, plante care preferă sol alcalin'
  },
  {
    id: '107',
    name: 'Aronia',
    family: 'Rosaceae',
    spacing: '150-200 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Căpșuni, Cimbru, Gălbenele',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '108',
    name: 'Cătină',
    family: 'Elaeagnaceae',
    spacing: '150-250 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Cimbru, Gălbenele, Mușețel',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '109',
    name: 'Viță de vie',
    family: 'Vitaceae',
    spacing: '100-150 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Cimbru, Isop, Lavandă, Gălbenele, Usturoi',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '110',
    name: 'Soc',
    family: 'Adoxaceae',
    spacing: '250-400 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Căpșuni, Coacăz, Zmeur',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '111',
    name: 'Goji',
    family: 'Solanaceae',
    spacing: '100-150 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Usturoi, Ceapă, Gălbenele, Cimbru',
    avoid: 'Cartof, Roșii, Ardei, Vinete'
  },
  {
    id: '112',
    name: 'Corn',
    family: 'Cornaceae',
    spacing: '300-500 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Căpșuni, Cimbru, Gălbenele',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '113',
    name: 'Kiwi rezistent',
    family: 'Actinidiaceae',
    spacing: '200-400 cm',
    sun: 'Soare plin',
    water: 'Abundent',
    companions: 'Cimbru, Gălbenele, Trifoi',
    avoid: 'Nu sunt documentați antagoniști direcți'
  },
  {
    id: '114',
    name: 'Știr',
    family: 'Amaranthaceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Fasole, Dovleac, Sfeclă',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '115',
    name: 'Creson de apă',
    family: 'Brassicaceae',
    spacing: '15-20 cm',
    sun: 'Umbră / Umbră parțială',
    water: 'Abundent',
    companions: 'Salată, Ridichi, Spanac',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '116',
    name: 'Mușețel roman',
    family: 'Asteraceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Varză, Ceapă, Salată, Castraveți',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '117',
    name: 'Cimbrișor',
    family: 'Lamiaceae',
    spacing: '20-30 cm',
    sun: 'Soare plin',
    water: 'Rar',
    companions: 'Varză, Roșii, Vinete, Fasole, Căpșuni',
    avoid: 'Nu are incompatibilități majore'
  },
  {
    id: '118',
    name: 'Trifoi alb',
    family: 'Fabaceae',
    spacing: '10-20 cm',
    sun: 'Soare / Umbră parțială',
    water: 'Moderat',
    companions: 'Porumb, Dovleac, Pom fructifer, Căpșuni',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '119',
    name: 'Trifoi roșu',
    family: 'Fabaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Porumb, Dovleac, Pom fructifer, Căpșuni',
    avoid: 'Nu are antagoniști direcți'
  },
  {
    id: '120',
    name: 'Hrișcă',
    family: 'Polygonaceae',
    spacing: '15-20 cm',
    sun: 'Soare plin',
    water: 'Moderat',
    companions: 'Pom fructifer, Dovleac, Porumb, Fasole',
    avoid: 'Nu are antagoniști direcți'
  }
];

db.on('populate', async () => {
  await db.plants.bulkAdd(defaultPlants);
});

// Adaugă plantele implicite doar dacă baza de date e goală
export async function ensureDefaultPlants() {
  const count = await db.plants.count();
  if (count === 0) {
    await db.plants.bulkAdd(defaultPlants);
  }
}

export async function checkRotationRules(parcelId, plantId, year) {
  const previousPlanting = await db.plantings
    .where('[parcelId+year]')
    .equals([parcelId, year - 1])
    .first();

  if (!previousPlanting) {
    return { status: 'info', message: 'Terenul a fost liber anul trecut.' };
  }

  const currentPlant = await db.plants.get(plantId);
  const previousPlant = await db.plants.get(previousPlanting.plantId);

  if (currentPlant && previousPlant && currentPlant.family === previousPlant.family) {
    return {
      status: 'warning',
      message: `⚠️ Rotație slabă: Anul trecut ai avut ${previousPlant.name} (${previousPlant.family}). Schimbă familia de plante!`
    };
  }

  return {
    status: 'success',
    message: `✅ Rotație optimă! Anul trecut ai avut ${previousPlant?.name}.`
  };
}

export async function checkNeighborConflicts(targetParcelId, plantId, year, neighborParcelIds = []) {
  if (!neighborParcelIds || neighborParcelIds.length === 0) return [];

  const candidatePlant = await db.plants.get(plantId);
  if (!candidatePlant) return [];

  const activeNeighborPlantings = await db.plantings
    .where('year')
    .equals(year)
    .filter(p => neighborParcelIds.includes(p.parcelId))
    .toArray();

  const warnings = [];

  for (const planting of activeNeighborPlantings) {
    const neighborPlant = await db.plants.get(planting.plantId);
    if (!neighborPlant) continue;

    const neighborParcel = await db.parcels.get(planting.parcelId);
    const parcelName = neighborParcel ? neighborParcel.name : 'o parcelă vecină';

    const candidateAvoids = (candidatePlant.avoid || '').toLowerCase();
    const neighborAvoids = (neighborPlant.avoid || '').toLowerCase();
    
    const candidateName = candidatePlant.name.toLowerCase();
    const neighborName = neighborPlant.name.toLowerCase();

    const candidateBase = candidateName.split(' ')[0];
    const neighborBase = neighborName.split(' ')[0];

    const directConflict = candidateAvoids.includes(neighborName) || 
                           (neighborBase.length > 3 && candidateAvoids.includes(neighborBase));
                           
    const reverseConflict = neighborAvoids.includes(candidateName) || 
                            (candidateBase.length > 3 && neighborAvoids.includes(candidateBase));

    if (directConflict || reverseConflict) {
      warnings.push({
        status: 'danger',
        neighborParcelName: parcelName,
        neighborPlantName: neighborPlant.name,
        message: `Bă, nu e în regulă! Pe ${parcelName} ai ${neighborPlant.name}. ${candidatePlant.name} și ${neighborPlant.name} nu se înțeleg bine alături!`
      });
    }
  }

  return warnings;
}

// EXPORT DATE (Backup JSON)
export async function exportDatabase() {
  const gardens = await db.gardens.toArray();
  const parcels = await db.parcels.toArray();
  const plants = await db.plants.toArray();
  const plantings = await db.plantings.toArray();
  const settings = await db.settings.toArray();

  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    gardens,
    parcels,
    plants,
    plantings,
    settings
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gradina_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// IMPORT DATE (Restore JSON)
export async function importDatabase(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data.gardens || !data.parcels) {
      throw new Error('Fișier JSON invalid!');
    }

    await db.transaction('rw', [db.gardens, db.parcels, db.plants, db.plantings, db.settings], async () => {
      await db.gardens.clear();
      await db.parcels.clear();
      await db.plants.clear();
      await db.plantings.clear();
      await db.settings.clear();

      if (data.gardens?.length) await db.gardens.bulkAdd(data.gardens);
      if (data.parcels?.length) await db.parcels.bulkAdd(data.parcels);
      if (data.plants?.length) await db.plants.bulkAdd(data.plants);
      if (data.plantings?.length) await db.plantings.bulkAdd(data.plantings);
      if (data.settings?.length) await db.settings.bulkAdd(data.settings);
    });

    return { success: true, message: 'Datele au fost restaurate cu succes!' };
  } catch (err) {
    return { success: false, message: 'Eroare la import: ' + err.message };
  }
}