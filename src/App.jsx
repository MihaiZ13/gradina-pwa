import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, checkRotationRules, ensureDefaultPlants, exportDatabase, importDatabase } from './db';
import { Lock, Unlock, Plus, Trash2, MapPin, Check, Edit2, Save, Info, Sun, Droplets, Ruler, Users, ShieldAlert, X, Download, Upload, Map as MapIcon, List } from 'lucide-react';

// Controller pentru recalcularea dimensiunii hărții la schimbarea tab-ului
function MapResizeController({ activeTab }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map, activeTab]);
  return null;
}

// Helper pentru încadrarea automată a hărții și permiterea zoom-out-ului complet pe mobil
function FitMapToBounds({ bounds, activeTab }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !bounds) return;
    const timer = setTimeout(() => {
      map.fitBounds(bounds);
    }, 200);
    return () => clearTimeout(timer);
  }, [map, bounds, activeTab]);

  return null;
}

function GeomanControls({ isLocked, onPolygonCreated }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !map.pm) return;

    if (isLocked) {
      map.pm.addControls({
        position: 'topleft',
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawCircle: false,
        drawText: false,
        drawMarker: false,
        drawPolygon: true,
        editMode: true,
        dragMode: true,
        removalMode: true,
      });

      const handleCreate = (e) => {
        const layer = e.layer;
        const rawLatLngs = layer.getLatLngs();

        const latLngs = Array.isArray(rawLatLngs[0])
          ? rawLatLngs[0].map(pt => [pt.lat, pt.lng])
          : rawLatLngs.map(pt => [pt.lat, pt.lng]);

        onPolygonCreated(latLngs);
        map.removeLayer(layer);
      };

      map.on('pm:create', handleCreate);

      return () => {
        map.off('pm:create', handleCreate);
        if (map.pm) map.pm.removeControls();
      };
    } else {
      map.pm.removeControls();
    }
  }, [map, isLocked]);

  return null;
}

export default function App() {
  const [imageBounds, setImageBounds] = useState([[0, 0], [1000, 1000]]);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [rotationMsg, setRotationMsg] = useState(null);
  const [neighborWarning, setNeighborWarning] = useState(null);

  // Stare pentru navigare Mobil (Tab-uri)
  const [activeTab, setActiveTab] = useState('map'); // 'map' sau 'menu'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fileInputRef = useRef(null);

  // Stări pentru editare nume parcelă
  const [isEditingParcelName, setIsEditingParcelName] = useState(false);
  const [parcelNameInput, setParcelNameInput] = useState('');

  // Stări pentru adăugare grădină nouă
  const [isCreatingGarden, setIsCreatingGarden] = useState(false);
  const [newGardenName, setNewGardenName] = useState('Grădină');
  const [newGardenImage, setNewGardenImage] = useState(null);

  // Stări pentru adăugare plantă nouă în catalog
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '', family: 'Solanaceae', spacing: '30-40 cm', sun: 'Soare plin', water: 'Moderat', companions: '', avoid: ''
  });

  // Detectare re-dimensionare ecran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ne asigurăm că există plantele implicite
  useEffect(() => {
    ensureDefaultPlants();
  }, []);

  // Baza de date live
  const gardens = useLiveQuery(() => db.gardens.toArray()) || [];
  const activeGardenSetting = useLiveQuery(() => db.settings.get('activeGardenId'));
  const activeGardenId = activeGardenSetting?.value;

  const activeGarden = gardens.find(g => g.id === activeGardenId) || gardens[0];

  // Calculează aspect ratio-ul real al imaginii de fundal
  useEffect(() => {
    if (activeGarden?.bgImage) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalHeight / img.naturalWidth;
        setImageBounds([[0, 0], [1000, 1000 * ratio]]);
      };
      img.src = activeGarden.bgImage;
    } else {
      setImageBounds([[0, 0], [1000, 1000]]);
    }
  }, [activeGarden?.bgImage]);

  const parcels = useLiveQuery(
    () => activeGarden ? db.parcels.where({ gardenId: activeGarden.id }).toArray() : [],
    [activeGarden?.id]
  ) || [];

  const plants = useLiveQuery(async () => {
    const list = await db.plants.toArray();
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ro', { sensitivity: 'base' }));
  }) || [];

  const plantings = useLiveQuery(() => db.plantings.where({ year: selectedYear }).toArray()) || [];

  const currentPlantDetails = plants.find(p => p.id === selectedPlantId);

  const checkNeighborCompatibility = (currentParcel, newPlantData) => {
    if (!parcels || parcels.length <= 1 || !newPlantData) {
      setNeighborWarning(null);
      return;
    }

    const otherPlantings = plantings.filter(p => p.parcelId !== currentParcel.id);
    let conflicts = [];

    otherPlantings.forEach(op => {
      const pDetails = plants.find(pl => pl.id === op.plantId);
      const otherParcel = parcels.find(par => par.id === op.parcelId);
      if (pDetails && otherParcel) {
        const avoidList = (newPlantData.avoid || '').toLowerCase();
        const otherName = pDetails.name.toLowerCase();
        
        const peerAvoidList = (pDetails.avoid || '').toLowerCase();
        const currentName = newPlantData.name.toLowerCase();

        if ((avoidList && avoidList.includes(otherName)) || (peerAvoidList && peerAvoidList.includes(currentName))) {
          conflicts.push(`Atenție! ${newPlantData.name} nu este compatibilă cu ${pDetails.name} (aflată în ${otherParcel.name}).`);
        }
      }
    });

    if (conflicts.length > 0) {
      setNeighborWarning({ status: 'warning', message: conflicts.join(' ') });
    } else {
      setNeighborWarning({ status: 'success', message: 'Vecinii din grădină par compatibili!' });
    }
  };

  const handleSelectGarden = async (id) => {
    await db.settings.put({ key: 'activeGardenId', value: id });
    setSelectedParcel(null);
    setNeighborWarning(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setNewGardenImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewGarden = async (e) => {
    e.preventDefault();
    if (!newGardenName.trim() || !newGardenImage) {
      alert('Te rog introdu un nume și încarcă o imagine!');
      return;
    }

    const gardenId = Date.now();
    await db.gardens.add({
      id: gardenId,
      name: newGardenName.trim(),
      bgImage: newGardenImage
    });

    await handleSelectGarden(gardenId);
    setNewGardenName('Grădină');
    setNewGardenImage(null);
    setIsCreatingGarden(false);
  };

  const handleDeleteGarden = async (e, gardenId) => {
    e.stopPropagation();
    if (window.confirm('Sigur vrei să ștergi această grădină și toate parcelele ei?')) {
      await db.gardens.delete(gardenId);
      await db.parcels.where({ gardenId }).delete();
      if (activeGardenId === gardenId) {
        const remaining = gardens.filter(g => g.id !== gardenId);
        if (remaining.length > 0) {
          await handleSelectGarden(remaining[0].id);
        } else {
          await db.settings.delete('activeGardenId');
        }
      }
    }
  };

  const handlePolygonCreated = async (coordinates) => {
    if (!activeGarden) return;
    const name = `Parcela ${parcels.length + 1}`;
    await db.parcels.add({ id: Date.now(), gardenId: activeGarden.id, name, coordinates });
  };

  const handleSelectParcel = async (parcel) => {
    setSelectedParcel(parcel);
    setParcelNameInput(parcel.name);
    setIsEditingParcelName(false);

    const existing = plantings.find(p => p.parcelId === parcel.id);
    const plantId = existing ? existing.plantId : '';
    setSelectedPlantId(plantId);
    setRotationMsg(null);
    setNeighborWarning(null);

    if (plantId) {
      const res = await checkRotationRules(parcel.id, plantId, selectedYear);
      setRotationMsg(res);
      const selectedPlant = plants.find(p => p.id === plantId);
      if (selectedPlant) {
        checkNeighborCompatibility(parcel, selectedPlant);
      }
    }
  };

  const handleSaveParcelName = async () => {
    if (!selectedParcel || !parcelNameInput.trim()) return;
    await db.parcels.update(selectedParcel.id, { name: parcelNameInput.trim() });
    setSelectedParcel(prev => ({ ...prev, name: parcelNameInput.trim() }));
    setIsEditingParcelName(false);
  };

  const handleDeleteParcel = async (parcelId) => {
    if (window.confirm('Sigur vrei să ștergi această parcelă?')) {
      await db.parcels.delete(parcelId);
      await db.plantings.where({ parcelId }).delete();
      setSelectedParcel(null);
      setNeighborWarning(null);
    }
  };

  const handlePlantChange = async (e) => {
    const newPlantId = e.target.value;
    setSelectedPlantId(newPlantId);

    if (selectedParcel && newPlantId) {
      const existing = plantings.find(p => p.parcelId === selectedParcel.id);
      if (existing) {
        await db.plantings.update(existing.id, { plantId: newPlantId });
      } else {
        await db.plantings.add({ parcelId: selectedParcel.id, year: selectedYear, plantId: newPlantId });
      }

      const selectedPlant = plants.find(p => p.id === newPlantId);
      if (selectedPlant) {
        const plantName = selectedPlant.name;
        const escapedName = plantName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^${escapedName}\\s+(\\d+)$`, 'i');

        let maxNum = 0;
        parcels.forEach(p => {
          const match = p.name.match(regex);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        });

        const newParcelName = `${plantName} ${maxNum + 1}`;

        await db.parcels.update(selectedParcel.id, { name: newParcelName });
        setSelectedParcel(prev => ({ ...prev, name: newParcelName }));
        setParcelNameInput(newParcelName);

        const res = await checkRotationRules(selectedParcel.id, newPlantId, selectedYear);
        setRotationMsg(res);

        checkNeighborCompatibility(selectedParcel, selectedPlant);
      }
    } else {
      setNeighborWarning(null);
    }
  };

  const handleSaveCustomPlant = async (e) => {
    e.preventDefault();
    if (!newPlant.name.trim()) return;

    const plantId = String(Date.now());
    await db.plants.add({
      id: plantId,
      name: newPlant.name.trim(),
      family: newPlant.family,
      spacing: newPlant.spacing || 'Nespecificat',
      sun: newPlant.sun || 'Soare plin',
      water: newPlant.water || 'Moderat',
      companions: newPlant.companions || 'Fără date',
      avoid: newPlant.avoid || 'Fără date'
    });

    if (selectedParcel) {
      setSelectedPlantId(plantId);
      await db.plantings.add({ parcelId: selectedParcel.id, year: selectedYear, plantId });

      const createdPlant = { id: plantId, ...newPlant };
      const newParcelName = `${newPlant.name.trim()} 1`;
      await db.parcels.update(selectedParcel.id, { name: newParcelName });
      setSelectedParcel(prev => ({ ...prev, name: newParcelName }));
      setParcelNameInput(newParcelName);

      checkNeighborCompatibility(selectedParcel, createdPlant);
    }

    setNewPlant({ name: '', family: 'Solanaceae', spacing: '30-40 cm', sun: 'Soare plin', water: 'Moderat', companions: '', avoid: '' });
    setShowAddPlantModal(false);
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (window.confirm('Atenție! Importul va înlocui datele existente cu cele din fișierul de backup. Continui?')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const res = await importDatabase(event.target.result);
        alert(res.message);
        if (res.success) {
          window.location.reload();
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', padding: isMobile ? '6px' : '12px', gap: isMobile ? '6px' : '12px', backgroundColor: '#f8fafc', boxSizing: 'border-box', overflow: 'hidden' }}>
      
      {/* 1. BARA DE SUS (HEADER RESPONSIV) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: isMobile ? '8px 10px' : '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', zIndex: 10 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px' }}>🌱</span>
          <h2 style={{ margin: 0, fontSize: isMobile ? '15px' : '18px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? '130px' : 'none' }}>
            {activeGarden ? activeGarden.name : 'Grădină'}
          </h2>
        </div>

        {activeGarden && (
          <button 
            onClick={() => setIsLocked(!isLocked)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: isLocked ? '#22c55e' : '#f59e0b', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
          >
            {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
            <span>{isLocked ? (isMobile ? 'Desen' : 'Harta Blocată (Desen)') : (isMobile ? 'Muta' : 'Deblocată (Muta Harta)')}</span>
          </button>
        )}

        {/* Zona Dreapta: Backup + Sezon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          
          <button
            onClick={exportDatabase}
            title="Descarcă Backup JSON"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <Download size={14} /> {!isMobile && 'Export'}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Încarcă fișier Backup JSON"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            <Upload size={14} /> {!isMobile && 'Import'}
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileImport} 
            accept=".json" 
            style={{ display: 'none' }} 
          />

          <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1', margin: '0 2px' }} />

          {/* Selector Sezon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
            {!isMobile && <strong>Sezon:</strong>}
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ padding: '4px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '12px' }}>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
            </select>
          </div>

        </div>
      </div>

      {/* 2. ZONA PRINCIPALE (CONTAINER FLEX) */}
      <div style={{ display: 'flex', flex: 1, gap: '12px', overflow: 'hidden', position: 'relative' }}>
        
        {/* HARTA CONTAINER */}
        <div style={{ 
          flex: 1, 
          position: 'relative', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: isMobile && activeTab !== 'map' ? 'none' : 'block',
          height: '100%'
        }}>
          {activeGarden ? (
            <MapContainer 
              crs={L.CRS.Simple} 
              bounds={imageBounds} 
              maxBounds={imageBounds}
              maxBoundsViscosity={0.5}
              minZoom={-5}
              maxZoom={5}
              zoomSnap={0.25}
              style={{ height: '100%', width: '100%' }}
            >
              <MapResizeController activeTab={activeTab} />
              <FitMapToBounds bounds={imageBounds} activeTab={activeTab} />
              
              <ImageOverlay url={activeGarden.bgImage} bounds={imageBounds} />
              
              <GeomanControls isLocked={isLocked} onPolygonCreated={handlePolygonCreated} />

              {parcels.map((parcel) => {
                const currentPlanting = plantings.find(p => p.parcelId === parcel.id);
                const plant = plants.find(p => p.id === currentPlanting?.plantId);
                const isSelected = selectedParcel?.id === parcel.id;

                return (
                  <Polygon
                    key={parcel.id}
                    positions={parcel.coordinates}
                    pathOptions={{
                      color: isSelected ? '#2563eb' : '#16a34a',
                      fillColor: plant ? '#86efac' : '#cbd5e1',
                      fillOpacity: 0.6,
                      weight: isSelected ? 3 : 2
                    }}
                    eventHandlers={{
                      click: () => handleSelectParcel(parcel)
                    }}
                  />
                );
              })}
            </MapContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748b', gap: '12px', padding: '20px', textAlign: 'center' }}>
              <MapPin size={48} />
              <p style={{ fontSize: '16px', margin: 0 }}>Nu ai selectat nicio grădină.</p>
              <p style={{ fontSize: '14px', margin: 0 }}>Comută pe tab-ul "Meniu & Parcele" de jos pentru a adăuga o grădină nouă!</p>
            </div>
          )}
        </div>

        {/* MENIU CONTAINER */}
        <div style={{ 
          width: isMobile ? '100%' : '340px', 
          backgroundColor: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          display: isMobile && activeTab !== 'menu' ? 'none' : 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          overflowY: 'auto',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          
          {/* Header Meniu Grădini */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Grădinile Mele</h3>
            <button 
              onClick={() => setIsCreatingGarden(!isCreatingGarden)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#3b82f6', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
            >
              <Plus size={16} />
              <span>Adaugă</span>
            </button>
          </div>

          {/* Formular Adăugare Grădină Nouă */}
          {(isCreatingGarden || gardens.length === 0) && (
            <form onSubmit={handleSaveNewGarden} style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '14px' }}>Creează Grădină Nouă</h4>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>Nume Grădină:</label>
                <input 
                  type="text" 
                  value={newGardenName}
                  onChange={(e) => setNewGardenName(e.target.value)}
                  placeholder="ex: Grădină" 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold' }}>Schiță / Cadastru (Imagine):</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{ width: '100%', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Salvează Grădina
                </button>
                {gardens.length > 0 && (
                  <button type="button" onClick={() => setIsCreatingGarden(false)} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                    Renunță
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Lista de Grădini Salvate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {gardens.map((g) => {
              const isActive = activeGarden?.id === g.id;
              return (
                <div 
                  key={g.id}
                  onClick={() => handleSelectGarden(g.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '10px 12px', 
                    borderRadius: '8px', 
                    border: '2px solid', 
                    borderColor: isActive ? '#3b82f6' : '#e2e8f0', 
                    backgroundColor: isActive ? '#eff6ff' : 'white', 
                    cursor: 'pointer' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isActive && <Check size={18} color="#3b82f6" />}
                    <strong style={{ fontSize: '14px', color: isActive ? '#1e40af' : '#334155' }}>{g.name}</strong>
                  </div>

                  <button 
                    onClick={(e) => handleDeleteGarden(e, g.id)}
                    title="Șterge Grădina"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Lista de Parcele */}
          {activeGarden && parcels.length > 0 && (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b' }}>PARCELE ÎN {activeGarden.name.toUpperCase()}:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parcels.map((p) => {
                  const isSelected = selectedParcel?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectParcel(p)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: isSelected ? '#2563eb' : '#cbd5e1',
                        backgroundColor: isSelected ? '#2563eb' : '#f8fafc',
                        color: isSelected ? 'white' : '#334155',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detalii Parcelă Selectată */}
          {selectedParcel && (
            <div style={{ borderTop: '2px dashed #3b82f6', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isEditingParcelName ? (
                  <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                    <input 
                      type="text" 
                      value={parcelNameInput} 
                      onChange={(e) => setParcelNameInput(e.target.value)}
                      style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    <button onClick={handleSaveParcelName} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 style={{ margin: 0, color: '#166534', fontSize: '16px' }}>{selectedParcel.name}</h4>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => setIsEditingParcelName(true)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '4px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteParcel(selectedParcel.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Selectare Plantă + Buton Adăugare Plantă Nouă */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>
                    Ce ai plantat în {selectedYear}?
                  </label>
                  <button 
                    onClick={() => setShowAddPlantModal(true)}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                  >
                    + Plantă Nouă
                  </button>
                </div>

                <select 
                  value={selectedPlantId} 
                  onChange={handlePlantChange} 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
                >
                  <option value="">-- Alege Planta --</option>
                  {plants.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.family})</option>
                  ))}
                </select>
              </div>

              {/* Mesaj Rotație Culturi */}
              {rotationMsg && (
                <div style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: rotationMsg.status === 'warning' ? '#fef3c7' : rotationMsg.status === 'success' ? '#dcfce7' : '#ffffff',
                  color: rotationMsg.status === 'warning' ? '#92400e' : rotationMsg.status === 'success' ? '#166534' : '#334155',
                  border: '1px solid',
                  borderColor: rotationMsg.status === 'warning' ? '#f59e0b' : rotationMsg.status === 'success' ? '#22c55e' : '#cbd5e1'
                }}>
                  {rotationMsg.message}
                </div>
              )}

              {/* Mesaj Vecini Buni / Răi (Companion Planting) */}
              {neighborWarning && (
                <div style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: neighborWarning.status === 'warning' ? '#fee2e2' : '#f0fdf4',
                  color: neighborWarning.status === 'warning' ? '#991b1b' : '#166534',
                  border: '1px solid',
                  borderColor: neighborWarning.status === 'warning' ? '#ef4444' : '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {neighborWarning.status === 'warning' ? <ShieldAlert size={16} /> : <Check size={16} />}
                  <span>{neighborWarning.message}</span>
                </div>
              )}

              {/* FIȘĂ TEHNICĂ PLANTĂ */}
              {currentPlantDetails && (
                <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '10px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: '#15803d', borderBottom: '1px solid #f0fdf4', paddingBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Info size={14} /> Fișă Tehnică: {currentPlantDetails.name}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Ruler size={13} color="#0284c7" />
                      <span><strong>Dist:</strong> {currentPlantDetails.spacing || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sun size={13} color="#eab308" />
                      <span>{currentPlantDetails.sun || 'Soare plin'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', gridColumn: 'span 2' }}>
                      <Droplets size={13} color="#3b82f6" />
                      <span><strong>Udare:</strong> {currentPlantDetails.water || 'Moderat'}</span>
                    </div>
                  </div>

                  {currentPlantDetails.companions && (
                    <div style={{ color: '#166534', backgroundColor: '#f0fdf4', padding: '6px', borderRadius: '4px' }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> Vecini buni:</strong>
                      <span>{currentPlantDetails.companions}</span>
                    </div>
                  )}

                  {currentPlantDetails.avoid && (
                    <div style={{ color: '#991b1b', backgroundColor: '#fef2f2', padding: '6px', borderRadius: '4px' }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldAlert size={12} /> De evitat lângă:</strong>
                      <span>{currentPlantDetails.avoid}</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* 3. BARA DE TABS PENTRU MOBIL (Apare doar pe ecrane mici) */}
      {isMobile && (
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderTop: '1px solid #e2e8f0',
          padding: '6px',
          gap: '8px',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          borderRadius: '8px 8px 0 0',
          zIndex: 1000
        }}>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'map' ? '#22c55e' : '#f1f5f9',
              color: activeTab === 'map' ? 'white' : '#64748b',
              fontWeight: 'bold',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <MapIcon size={18} />
            <span>Hartă</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'menu' ? '#22c55e' : '#f1f5f9',
              color: activeTab === 'menu' ? 'white' : '#64748b',
              fontWeight: 'bold',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <List size={18} />
            <span>Meniu & Parcele</span>
          </button>
        </div>
      )}

      {/* MODAL ADAUGARE PLANTA NOUA IN CATALOG */}
      {showAddPlantModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '12px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Adaugă Plantă Nouă</h3>
              <button onClick={() => setShowAddPlantModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveCustomPlant} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Nume Plantă:</label>
                <input 
                  type="text" 
                  required 
                  placeholder="ex: Busuioc, Castraveți..." 
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Familie Botanică:</label>
                <select 
                  value={newPlant.family}
                  onChange={(e) => setNewPlant({ ...newPlant, family: e.target.value })}
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Solanaceae">Solanaceae (Roșii, Ardei, Vinete)</option>
                  <option value="Fabaceae">Fabaceae (Mazăre, Fasole)</option>
                  <option value="Apiaceae">Apiaceae (Morcov, Pătrunjel)</option>
                  <option value="Amaryllidaceae">Amaryllidaceae (Ceapă, Usturoi)</option>
                  <option value="Cucurbitaceae">Cucurbitaceae (Castraveți, Dovlecei)</option>
                  <option value="Brassicaceae">Brassicaceae (Varză, Broccoli, Ridichi)</option>
                  <option value="Lamiaceae">Lamiaceae (Busuioc, Cimbru, Mentă)</option>
                  <option value="Altele">Altele</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Distanță:</label>
                  <input 
                    type="text" 
                    placeholder="ex: 30 cm" 
                    value={newPlant.spacing}
                    onChange={(e) => setNewPlant({ ...newPlant, spacing: e.target.value })}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Udare:</label>
                  <input 
                    type="text" 
                    placeholder="ex: Moderat" 
                    value={newPlant.water}
                    onChange={(e) => setNewPlant({ ...newPlant, water: e.target.value })}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Vecini buni (Plante companion):</label>
                <input 
                  type="text" 
                  placeholder="ex: Morcov, Ceapă" 
                  value={newPlant.companions}
                  onChange={(e) => setNewPlant({ ...newPlant, companions: e.target.value })}
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>De evitat lângă:</label>
                <input 
                  type="text" 
                  placeholder="ex: Cartofi, Fenicul" 
                  value={newPlant.avoid}
                  onChange={(e) => setNewPlant({ ...newPlant, avoid: e.target.value })}
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Salvează Planta
                </button>
                <button type="button" onClick={() => setShowAddPlantModal(false)} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                  Renunță
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}