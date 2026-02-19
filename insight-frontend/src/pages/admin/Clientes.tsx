import { useEffect, useState } from 'react';
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

  const [form, setForm] = useState({
    nome: '',
    cor_primaria: '#0ea5e9',
    status: 'ativo'
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

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

  // ================= TABELA =================

  const columns = [
    { key: 'nome', header: 'Nome do Cliente' },

    {
      key: 'cor_primaria',
      header: 'Cor',
      render: (v: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: v || '#666',
            border: '1px solid rgba(255,255,255,0.1)'
          }} />
          <span style={{ fontSize: 12, fontFamily: 'monospace', opacity: 0.8 }}>
            {v || '-'}
          </span>
        </div>
      )
    },

    {
      key: 'status',
      header: 'Status',
      render: (v: any) => (
        <span style={{
          padding: '6px 12px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          background: v === 'ativo'
            ? 'rgba(34,197,94,0.12)'
            : 'rgba(255,255,255,0.05)',
          color: v === 'ativo'
            ? '#22c55e'
            : 'rgba(255,255,255,0.5)'
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
      header: '',
      render: (_: any, row: Cliente) => (
        <div style={{ position: 'relative' }}>
          <button style={btnGhost} onClick={(e) => toggleMenu(row.id, e)}>
            ⋯
          </button>

          {menuOpen === row.id && (
            <div style={dropdown}>
              <div style={dropItem} onClick={() => showToast(row.nome)}>
                👁 Visualizar
              </div>
              <div style={dropItem} onClick={() => openEdit(row)}>
                ✏️ Editar
              </div>
              <div
                style={{ ...dropItem, color: '#ef4444' }}
                onClick={() => confirmDelete(row.id)}
              >
                🗑 Excluir
              </div>
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
          <span style={{ fontSize: 18 }}>＋</span>
          Novo Cliente
        </button>
      </div>

      {/* BUSCA COM ÍCONE */}
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
        <div style={spinnerWrap}>
          <div style={spinner} />
        </div>
      ) : (
        <AdminTable columns={columns} data={filtered} />
      )}

      {/* MODAL CREATE/EDIT */}
      {openModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>{editing ? 'Editar Cliente' : 'Novo Cliente'}</h3>

            <input
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              style={inputStyle}
            />

            <label>Cor</label>
            <input
              type="color"
              value={form.cor_primaria}
              onChange={e => setForm({ ...form, cor_primaria: e.target.value })}
            />

            <label>Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              <button onClick={resetForm}>Cancelar</button>
              <button
                style={btnPrimary}
                disabled={saving}
                onClick={editing ? updateCliente : createCliente}
              >
                {saving ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Excluir cliente?</h3>
            <p style={{ opacity: 0.7 }}>
              Essa ação não pode ser desfeita.
            </p>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setDeleteId(null)}>Cancelar</button>
              <button style={btnDanger} onClick={deleteCliente}>
                Confirmar exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}

// ================= VISUAL STYLES =================

const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const title = { fontSize: 32, fontWeight: 800 };
const subtitle = { opacity: 0.6, marginTop: 4 };

const heroButton: React.CSSProperties = {
  background: 'linear-gradient(90deg,#06b6d4,#22d3ee)',
  border: 'none',
  padding: '10px 18px',
  borderRadius: 10,
  color: '#fff',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer'
};

const searchInput: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px 12px 38px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)'
};

const searchIcon: React.CSSProperties = {
  position: 'absolute',
  left: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0.5
};

const spinnerWrap = { display: 'flex', justifyContent: 'center', padding: 60 };
const spinner: React.CSSProperties = {
  width: 28,
  height: 28,
  border: '3px solid rgba(255,255,255,0.2)',
  borderTop: '3px solid #22d3ee',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const btnPrimary = { background: '#0ea5e9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6 };
const btnDanger = { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6 };
const btnGhost = { background: 'transparent', border: '1px solid #555', padding: '6px 10px', borderRadius: 6 };

const dropdown = {
  position: 'absolute',
  right: 0,
  top: 30,
  background: '#111',
  borderRadius: 8,
  padding: 6,
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
};

const dropItem = { padding: '6px 12px', cursor: 'pointer', fontSize: 13 };

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modal = { background: '#111', padding: 24, borderRadius: 12, width: 400 };

const toastStyle = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  background: '#111',
  padding: '12px 16px',
  borderRadius: 8
};
