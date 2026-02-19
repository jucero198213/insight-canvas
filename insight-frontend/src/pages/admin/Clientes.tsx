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
    await supabase
      .from('clientes')
      .update(form)
      .eq('id', editing.id);
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

  const columns = [
    { key: 'nome', header: 'Nome' },

    {
      key: 'cor_primaria',
      header: 'Cor',
      render: (v: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: v || '#666'
          }} />
          <span style={{ fontSize: 12, fontFamily: 'monospace' }}>
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
          padding: '4px 12px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 500,
          background: v === 'ativo'
            ? 'hsla(142,71%,45%,0.1)'
            : 'hsla(210,40%,98%,0.05)',
          color: v === 'ativo'
            ? 'hsl(142 71% 45%)'
            : 'hsla(210,40%,98%,0.5)'
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
              <div style={dropItem} onClick={() => showToast(JSON.stringify(row, null, 2))}>
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
    <div>
      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Clientes</h1>
          <p style={{ opacity: 0.6 }}>Gerencie os tenants da plataforma</p>
        </div>

        <button style={btnGradient} onClick={() => setOpenModal(true)}>
          + Novo Cliente
        </button>
      </div>

      {/* BUSCA */}
      <input
        placeholder="Buscar clientes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={inputStyle}
      />

      {/* TABELA */}
      {loading
        ? <p style={{ padding: 48, textAlign: 'center' }}>Carregando...</p>
        : <AdminTable columns={columns} data={filtered} />
      }

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

      {/* TOAST */}
      {toast && <div style={toastStyle}>{toast}</div>}
    </div>
  );
}

// ================= STYLES =================

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 400,
  padding: '10px 16px',
  borderRadius: 8,
  marginBottom: 16
};

const btnGradient: React.CSSProperties = {
  background: 'linear-gradient(90deg,#06b6d4,#22d3ee)',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 8,
  color: '#fff',
  cursor: 'pointer'
};

const btnPrimary: React.CSSProperties = {
  background: '#0ea5e9',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: 6,
  cursor: 'pointer'
};

const btnDanger: React.CSSProperties = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: 6,
  cursor: 'pointer'
};

const btnGhost: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #555',
  padding: '6px 10px',
  borderRadius: 6,
  cursor: 'pointer'
};

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50
};

const modal: React.CSSProperties = {
  background: '#111',
  padding: 24,
  borderRadius: 12,
  width: 400
};

const dropdown: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  top: 30,
  background: '#111',
  borderRadius: 8,
  padding: 6,
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  zIndex: 10
};

const dropItem: React.CSSProperties = {
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: 13
};

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  background: '#111',
  padding: '12px 16px',
  borderRadius: 8,
  boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
};
