import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, checkRotationRules } from './db';
import { Lock, Unlock, Upload } from 'lucide-react';

// Componentă pentru activarea modulului de desenare Geoman pe hartă
function GeomanControls({ isLocked, onPolygonCreated }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (isLocked) {
      // Când harta de bază e blocată, activăm uneltele de desenat parcele
      map.pm.addControls({
        position: 'topleft',
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawCircle: false,
        drawText: false,
        drawMarker: false,
        drawPolygon: true, // Doar desenare poligoane neregulate
        editMode: true,
        dragMode: true,
        removalMode: true,
      });

      map.on('pm:create', (e) => {
        const layer = e.layer;
        const rawLatLngs = layer.getLatLngs();

        // Extragere coordonate sigură
        const latLngs = Array.isArray(rawLatLngs[0])
          ? rawLatLngs[0].map(pt => [pt.lat, pt.lng])
          : rawLatLngs.map(pt => [pt.lat, pt.lng]);

        onPolygonCreated(latLngs);
        map.removeLayer(layer); // Ștergem forma temporară de desen
      });
    } else {
      // Dacă harta nu e blocată, dezactivăm uneltele
      map.pm.removeControls();
    }

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
    };
  }, [map, isLocked]);

  return null;
}

export default function App() {
  const [bgImage, setBgImage] = useState(null);
  const [imageBounds, setImageBounds] = useState([[0, 0], [1000, 1000]]);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [rotationMsg, setRotationMsg] = useState(null);

  // Citim datele din IndexedDB în timp real
  const parcels = useLiveQuery(() => db.parcels.toArray()) || [];
  const plants = useLiveQuery(() => db.plants.toArray()) || [];
  const plantings = useLiveQuery(() => db.plantings.where({ year: selectedYear }).toArray()) || [];

  // Încărcare schiță / cadastru
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvare parcelă nouă cu ID unic generat automat (Date.now())
  const handlePolygonCreated = async (coordinates) => {
    const name = `Parcela ${parcels.length + 1}`;
    await db.parcels.add({ id: Date.now(), name, coordinates });
  };

  // Când selectezi o parcelă, verificăm ce plantă are și regulile de rotație
  const handleSelectParcel = async (parcel) => {
    setSelectedParcel(parcel);
    const existing = plantings.find(p => p.parcelId === parcel.id);
    const plantId = existing ? existing.plantId : '';
    setSelectedPlantId(plantId);
    setRotationMsg(null);

    if (plantId) {
      const res = await checkRotationRules(parcel.id, plantId, selectedYear);
      setRotationMsg(res);
    }
  };

  // Când schimbi planta din dropdown
  const handlePlantChange = async (e) => {
    const newPlantId = e.target.value;
    setSelectedPlantId(newPlantId);

    if (selectedParcel && newPlantId) {
      // Salvăm sau actualizăm plantarea pentru anul selectat
      const existing = plantings.find(p => p.parcelId === selectedParcel.id);
      if (existing) {
        await db.plantings.update(existing.id, { plantId: newPlantId });
      } else {
        await db.plantings.add({ parcelId: selectedParcel.id, year: selectedYear, plantId: newPlantId });
      }

      // Verificăm rotația cu noua plantă
      const res = await checkRotationRules(selectedParcel.id, newPlantId, selectedYear);
      setRotationMsg(res);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '12px', gap: '12px' }}>
      
      {/* Meniu Sus / Control */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexWrap: 'wrap' }}>
        
        {/* Incarcare Cadastru */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: '#e2e8f0', padding: '6px 12px', borderRadius: '6px' }}>
          <Upload size={18} />
          <span>Incarca Cadastru/Schiță</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </label>

        {/* Blocheaza / Deblocheaza Harta */}
        {bgImage && (
          <button 
            onClick={() => setIsLocked(!isLocked)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isLocked ? '#22c55e' : '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
          >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            <span>{isLocked ? 'Harta de bază Blocată' : 'Blochează Harta Base'}</span>
          </button>
        )}

        {/* Selector An */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <strong>Sezon:</strong>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ padding: '6px', borderRadius: '6px' }}>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
            <option value={2028}>2028</option>
          </select>
        </div>
      </div>

      {/* Zona Principală: Harta + Panou Detalii */}
      <div style={{ display: 'flex', flex: 1, gap: '12px', overflow: 'hidden' }}>
        
        {/* Harta Leaflet */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer 
            crs={L.CRS.Simple} 
            bounds={imageBounds} 
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          >
            {bgImage && <ImageOverlay url={bgImage} bounds={imageBounds} />}
            
            <GeomanControls isLocked={isLocked} onPolygonCreated={handlePolygonCreated} />

            {/* Afișare Parcele Desenate */}
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
        </div>

        {/* Panou Detalii Parcela Selectată */}
        {selectedParcel && (
          <div style={{ width: '300px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0 }}>{selectedParcel.name}</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                Ce ai plantat în {selectedYear}?
              </label>
              <select 
                value={selectedPlantId} 
                onChange={handlePlantChange} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="">-- Alege Planta --</option>
                {plants.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.family})</option>
                ))}
              </select>
            </div>

            {/* Mesaj Engine Rotație Culturi */}
            {rotationMsg && (
              <div style={{
                padding: '10px',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: rotationMsg.status === 'warning' ? '#fef3c7' : rotationMsg.status === 'success' ? '#dcfce7' : '#f1f5f9',
                color: rotationMsg.status === 'warning' ? '#92400e' : rotationMsg.status === 'success' ? '#166534' : '#334155',
                border: '1px solid',
                borderColor: rotationMsg.status === 'warning' ? '#f59e0b' : rotationMsg.status === 'success' ? '#22c55e' : '#cbd5e1'
              }}>
                {rotationMsg.message}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}