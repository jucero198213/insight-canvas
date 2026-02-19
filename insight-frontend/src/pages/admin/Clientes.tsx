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

  useEffect(() => {
    const close = () => setMenuOpen(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const columns = [
    { key: 'nome', header: 'Nome do Cliente' },
    {
      key: 'created_at',
      header: 'Criado em',
      render: (v: any) => new Date(v).toLocaleDateString('pt-BR')
    },
    {
      key: 'acoes',
      header: 'Ações',
      render: (_: any, row: Cliente) => (
        <button onClick={() => openEdit(row)}>Editar</button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={header}>
        <div>
          <h1 style={title}>Clientes</h1>
          <p style={subtitle}>Gerencie os tenants da plataforma</p>
        </div>

        {/* BOTÃO AJUSTADO */}
        <button
          style={heroButton}
          onClick={() => setOpenModal(true)}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(56,189,248,0.25)';
            e.currentTarget.style.borderColor = '#38bdf8';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(56,189,248,0.15)';
            e.currentTarget.style.borderColor = 'rgba(56,189,248,0.35)';
          }}
        >
          + Novo Cliente
        </button>
      </div>

      {loading
        ? <div style={{ padding: 60 }}>Carregando...</div>
        : <AdminTable columns={columns} data={filtered} />
      }
    </div>
  );
}

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
