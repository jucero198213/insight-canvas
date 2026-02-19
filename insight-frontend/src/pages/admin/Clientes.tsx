import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface Cliente {
  id: string;
  nome: string;
  cor_primaria: string | null;
  status: string;
  created_at: string;
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [saving, setSaving] = useState(false);

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    nome: '',
    cor_primaria: '#0ea5e9',
    status: 'ativo'
  });

  // ================= TOAST =================
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ================= FETCH =================
  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('clientes')
      .select('id, nome, cor_primaria, status, created_at')
      .order('created_at', { ascending: false });

    setClientes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  // ESC fecha modal
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenModal(false);
        setDeleteId(null);
        setMenuOpen(null);
      }
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const filtered = clientes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  // ================= CRUD =================
  const resetForm = () => {
    setForm({ nome: '', cor_primaria: '#0ea5e9', status: 'ativo' });
    setEditing(null);
    setOpenModal(false);
  };

  const createCliente = async () => {
    if (!form.nome.trim()) return showToast('Informe o nome');

    setSaving(true);
    await supabase.from('clientes').insert(form);
    setSaving(false);

    resetForm();
    fetch();
    showToast('Cliente criado');
  };

  const updateCliente = async () => {
    if (!editing) return;

    setSaving(true);
    await supabase.from('clientes').update(form).eq('id', editing.id);
    setSaving(false);

    resetForm();
    fetch();
    showToast('Cliente atualizado');
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setMenuOpen(null);
  };

  const deleteCliente = async () => {
    if (!deleteId) return;
    await supabase.from('clientes').delete().eq('id', deleteId);
    setDeleteId(null);
    fetch();
    showToast('Cliente excluído');
  };

  const openEdit = (c: Cliente) => {
    setEditing(c);
    setForm({
      nome: c.nome,
      cor_primaria: c.cor_primaria || '#0ea5e9',
      status: c.status
    });
    setOpenModal(true);
  };

  const toggleMenu = (id: string, e: any) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === id ? null : id);
  };

  // fecha dropdown ao clicar fora
  useEffect(() => {
    const close = () => setMenuOpen(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  // ================= TABELA =================
  const columns = [
    { key: 'nome', header: 'Nome do Cliente' },

    {
      key: 'cor_primaria',
      header: 'Cor',
      render: (v: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: v || '#666'
          }} />
          <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>
            {v}
          </span>
        </div>
      )
    },

    {
      key: 'status',
      header: 'Status',
      render: (v: any) => (
        <span style={{
          background: '#dcfce7',
          color: '#16a34a',
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600
        }}>
          {v === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      )
    },

    {
      key: 'created_at',
      header: 'Criado em',
      render: (v: any) =>
        new Date(v).toLocaleDateString('pt-BR')
    },

    {
      key: 'acoes',
      header: 'Ações',
      render: (_: any, row: Cliente) => (
        <div style={{ position: 'relative' }}>
          <button style={btnGhost} onClick={(e) => toggleMenu(row.id, e)}>
            ⋯
          </button>

          {menuOpen === row.id && (
            <div style={dropdown}>
              <MenuItem label="👁 Visualizar" onClick={() => showToast(row.nome)} />
              <MenuItem label="✏️ Editar" onClick={() => openEdit(row)} />
              <MenuItem
                label="🗑 Excluir"
                danger
                onClick={() => confirmDelete(row.id)}
              />
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={title}>Clientes</h1>
          <p style={subtitle}>Gerencie os tenants da plataforma</p>
        </div>

        <button style={heroButton} onClick={() => setOpenModal(true)}>
          ＋ Novo Cliente
        </button>
      </div>

      {/* BUSCA */}
      <div style={{ position: 'relative', maxWidth: 420 }}>
        <span style={searchIcon}>🔍</span>
        <input
          placeholder="Buscar clientes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={searchInput}
        />
      </div>

      {/* TABELA */}
      {loading ? (
        <div style={spinnerWrap}><div style={spinner} /></div>
      ) : (
        <AdminTable columns={columns} data={filtered} />
      )}

      {/* MODAL CREATE/EDIT */}
      {openModal && (
        <div style={overlay} onClick={() => setOpenModal(false)}>
          <div
            ref={modalRef}
            style={modal}
            onClick={e => e.stopPropagation()}
          >
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 700 }}>
                  {editing ? 'Editar Cliente' : 'Novo Cliente'}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Cadastre um novo cliente (tenant) na plataforma.
                </p>
              </div>

              <button onClick={resetForm} style={closeX}>✕</button>
            </div>

            <label>Nome do Cliente *</label>
            <input
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              style={inputStyle}
            />

            <label>Cor Principal</label>
            <input
              type="color"
              value={form.cor_primaria}
              onChange={e => setForm({ ...form, cor_primaria: e.target.value })}
            />

            <label>Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              style={inputStyle}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button style={btnCancel} onClick={resetForm}>Cancelar</button>
              <button
                style={btnPrimary}
                disabled={saving}
                onClick={editing ? updateCliente : createCliente}
              >
                {saving ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div style={overlay} onClick={() => setDeleteId(null)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h3>Excluir cliente?</h3>
            <p style={{ color: '#64748b' }}>
              Essa ação não pode ser desfeita.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button style={btnCancel} onClick={() => setDeleteId(null)}>Cancelar</button>
              <button style={btnDanger} onClick={deleteCliente}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}

// ================= COMPONENTES =================
const MenuItem = ({ label, onClick, danger }: any) => (
  <div
    onClick={onClick}
    style={{
      padding: '8px 12px',
      cursor: 'pointer',
      borderRadius: 8,
      fontSize: 14,
      color: danger ? '#ef4444' : '#111'
    }}
    onMouseEnter={e =>
      (e.currentTarget.style.background = danger ? '#fef2f2' : '#f1f5f9')
    }
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
  >
    {label}
  </div>
);

// ================= STYLES =================
const header = { display: 'flex', justifyContent: 'space-between' };
const title = { fontSize: 32, fontWeight: 800 };
const subtitle = { opacity: 0.6 };

const heroButton = {
  background: 'rgba(56,189,248,0.15)',
  color: '#38bdf8',
  border: '1px solid rgba(56,189,248,0.35)',
  padding: '9px 16px',
  borderRadius: 10,
  fontWeight: 500,
  cursor: 'pointer',
  backdropFilter: 'blur(6px)',
  transition: 'all 0.15s ease'
};

const searchInput = {
  width: '100%',
  padding: '12px 16px 12px 38px',
  borderRadius: 10,
  border: '1px solid #e2e8f0'
};
const searchIcon = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' };

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.55)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50
};

const modal = {
  background: '#fff',
  padding: 28,
  borderRadius: 16,
  width: 520,
  boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
  animation: 'fadeIn 0.2s ease'
};

const closeX = { border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' };

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  marginBottom: 16
};

const btnCancel = {
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  padding: '10px 16px',
  borderRadius: 10,
  cursor: 'pointer'
};

const btnPrimary = {
  background: 'linear-gradient(90deg,#06b6d4,#67e8f9)',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 10,
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
};

const btnDanger = {
  background: '#ef4444',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 10,
  color: '#fff',
  cursor: 'pointer'
};

const btnGhost = { border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 10px', background: '#fff' };

const dropdown = {
  position: 'absolute',
  right: 0,
  top: 36,
  background: '#fff',
  borderRadius: 12,
  padding: 6,
  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
  border: '1px solid #e5e7eb',
  minWidth: 160,
  zIndex: 20
};

const spinnerWrap = { display: 'flex', justifyContent: 'center', padding: 60 };
const spinner = {
  width: 28,
  height: 28,
  border: '3px solid #e2e8f0',
  borderTop: '3px solid #06b6d4',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const toastStyle = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  background: '#111',
  color: '#fff',
  padding: '12px 16px',
  borderRadius: 8
};
