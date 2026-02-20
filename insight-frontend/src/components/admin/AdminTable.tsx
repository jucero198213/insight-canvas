import { useState } from 'react';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
}

// Icons
const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

function DropdownItem({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', cursor: 'pointer', borderRadius: 6, fontSize: 14,
        color: danger ? '#ef4444' : 'inherit',
        background: hovered ? (danger ? 'rgba(239,68,68,0.1)' : 'hsla(210,40%,98%,0.06)') : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      {icon}
      {label}
    </div>
  );
}

export function AdminTable({ columns, data, onEdit, onDelete, onView }: AdminTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const hasActions = onEdit || onDelete || onView;

  // Close menu on outside click
  const handleWindowClick = () => setMenuOpen(null);
  useState(() => {
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  });

  if (data.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'hsla(210,40%,98%,0.4)' }}>
        Nenhum registro encontrado
      </div>
    );
  }

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === id ? null : id);
  };

  return (
    <div style={{ borderRadius: 12, border: '1px solid hsla(210,40%,98%,0.08)', overflow: 'visible' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'hsla(210,40%,98%,0.04)' }}>
            {columns.map(col => (
              <th key={col.key} style={thStyle}>{col.header}</th>
            ))}
            {hasActions && <th style={thStyle}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: '1px solid hsla(210,40%,98%,0.05)' }}>
              {columns.map(col => (
                <td key={col.key} style={cellStyle}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                </td>
              ))}
              {hasActions && (
                <td style={{ ...cellStyle, position: 'relative', overflow: 'visible' }}>
                  <button onClick={(e) => toggleMenu(row.id, e)} style={ghostBtn}>
                    <MoreIcon />
                  </button>
                  {menuOpen === row.id && (
                    <div style={dropdownStyle}>
                      {onView && <DropdownItem icon={<EyeIcon />} label="Visualizar" onClick={() => { onView(row); setMenuOpen(null); }} />}
                      {onEdit && <DropdownItem icon={<PencilIcon />} label="Editar" onClick={() => { onEdit(row); setMenuOpen(null); }} />}
                      {onDelete && <DropdownItem icon={<TrashIcon />} label="Excluir" danger onClick={() => { onDelete(row); setMenuOpen(null); }} />}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600,
  color: 'hsla(210,40%,98%,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em',
  borderBottom: '1px solid hsla(210,40%,98%,0.08)',
};

const cellStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 14, color: 'hsla(210,40%,98%,0.8)' };

const ghostBtn: React.CSSProperties = {
  border: '1px solid hsla(210,40%,98%,0.12)', borderRadius: 8,
  padding: '6px 10px', background: 'transparent', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', color: 'inherit',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute', right: 0, top: 38, background: '#1e293b',
  borderRadius: 10, padding: 4, minWidth: 170, zIndex: 30,
  boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid hsla(210,40%,98%,0.1)',
};
