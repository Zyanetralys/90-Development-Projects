import { useEffect, useState } from 'react';
import { useStore } from '../store/gameStore';
export const GameList = () => {
  const { games, q, loading, fetch, setQ } = useStore();
  const [page, setPage] = useState(0);
  useEffect(() => fetch(q, page), [q, page]);
  return (
    <div className="p-4 bg-[#0b0e14] min-h-screen text-[#c5c6c7] font-mono">
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar juego..." className="flex-1 bg-[#1a1d24] border border-[#333] p-2 text-white rounded"/>
      </div>
      {loading ? <p className="text-center">Sincronizando...</p> : (
        <ul className="space-y-2">
          {games.map(g => (
            <li key={g.igdbId} className="bg-[#111] p-3 rounded border border-[#222] flex justify-between">
              <span>{g.title}</span><span className="text-[#8892b0]">★{g.avgRating?.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center gap-4 mt-4">
        <button disabled={page===0} onClick={()=>setPage(p=>p-1)} className="px-3 bg-[#222] hover:bg-[#333]">◀</button>
        <button onClick={()=>setPage(p=>p+1)} className="px-3 bg-[#222] hover:bg-[#333]">▶</button>
      </div>
    </div>
  );
};
