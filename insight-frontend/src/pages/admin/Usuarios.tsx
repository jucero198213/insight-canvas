import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  status: string;
  created_at: string;
  cliente_id: string;
  cliente_nome?: string;
  role?: string;
}

interface Cliente {
  id: string;
  nome: string;
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [saving, setSaving] = useState(false);

  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: '',
    email: '',
    cliente_id: '',
    status: 'ativo',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('usuarios')
      .select('id, email, nome, cliente_id, status, created_at, clientes(nome)')
      .order('created_at', { ascending: false });
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const rolesMap = new Map((roles || []).map(r => [r.user_id, r.role]));
    setUsuarios(
      (data || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        nome: u.nome,
        status: u.status,
        created_at: u.created_at,
        cliente_id: u.cliente_id,
        cliente_nome: u.clientes?.nome || '-',
        role: rolesMap.get(u.id) || 'user',
      }))
    );
    setLoading(false);
  };

  const fetchClientes = async () => {
    const { data } = await supabase.from('clientes').select('id, nome').eq('status', 'ativo').order('nome');
    setClientes(data || []);
  };

  useEffect(() => {
    fetchUsuarios();
    fetchClientes();
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenModal(false); setDeleteId(null); setMenuOpen(null); }
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  useEffect(() => {
    const close = () => setMenuOpen(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const filtered = usuarios.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ nome: '', email: '', cliente_id: '', status: 'ativo' });
    setEditing(null);
    setOpenModal(false);
  };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.email.trim()) return showToast('Informe nome e e-mail');
    if (!form.cliente_id) return showToast('Selecione um cliente');
    setSaving(true);

    if (editing) {
      const { error } = await supabase
        .from('usuarios')
        .update({ nome: form.nome, email: form.email, cliente_id: form.cliente_id, status: form.status })
        .eq('id', editing.id);
      showToast(error ? 'Erro ao atualizar usuário' : 'Usuário atualizado com sucesso!');
    } else {
      const { error } = await supabase
        .from('usuarios')
        .insert({ nome: form.nome, email: form.email, cliente_id: form.cliente_id, status: form.status, auth_user_id: crypto.randomUUID() });
      showToast(error ? 'Erro ao cadastrar usuário' : `Usuário "${form.nome}" cadastrado com sucesso!`);
    }

    setSaving(false);
    resetForm();
    fetchUsuarios();
  };

  const openEdit = (u: Usuario) => {
    setEditing(u);
    setForm({ nome: u.nome, email: u.email, cliente_id: u.cliente_id, status: u.status });
    setOpenModal(true);
    setMenuOpen(null);
  };

  const confirmDelete = (id: string) => { setDeleteId(id); setMenuOpen(null); };

  const deleteUsuario = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('usuarios').delete().eq('id', deleteId);
    showToast(error ? 'Erro ao excluir usuário' : 'Usuário excluído');
    setDeleteId(null);
    fetchUsuarios();
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === id ? null : id);
  };

  // Icons
  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  );
  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  );
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, marginBottom: 4, color: '#f8fafc' }}>Usuários</h1>
          <p style={{ margin: 0, opacity: 0.6, fontSize: 14, color: '#f8fafc' }}>Gerencie os usuários do sistema</p>
        </div>
        <button onClick={() => setOpenModal(true)} style={heroBtn}>
          <PlusIcon /> Novo Usuário
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ position: 'relative', maxWidth: 420 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
          <SearchIcon />
        </span>
        <input
          placeholder="Buscar usuários..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 16px 10px 42px', borderRadius: 10,
            border: '1px solid hsla(210,40%,98%,0.12)', background: 'hsla(210,40%,98%,0.04)',
            color: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{
            width: 28, height: 28, border: '3px solid hsla(210,40%,98%,0.12)',
            borderTop: '3px solid #06b6d4', borderRadius: '50%', animation: 'spin 1s linear infinite',
          }} />
        </div>
      ) : (
        <div style={{ borderRadius: 12, border: '1px solid hsla(210,40%,98%,0.08)', overflow: 'visible' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'hsla(210,40%,98%,0.04)' }}>
                {['Nome', 'E-mail', 'Cliente', 'Perfil', 'Status', 'Criado em', 'Ações'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600,
                    color: 'hsla(210,40%,98%,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid hsla(210,40%,98%,0.08)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'hsla(210,40%,98%,0.4)' }}>
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid hsla(210,40%,98%,0.05)' }}>
                  <td style={cellStyle}>{u.nome}</td>
                  <td style={cellStyle}>{u.email}</td>
                  <td style={cellStyle}>{u.cliente_nome}</td>
                  <td style={cellStyle}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: u.role === 'admin' ? 'rgba(6,182,212,0.15)' : 'rgba(148,163,184,0.15)',
                      color: u.role === 'admin' ? '#06b6d4' : '#94a3b8',
                    }}>
                      {u.role === 'admin' ? 'Admin' : 'Usuário'}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      background: u.status === 'ativo' ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
                      color: u.status === 'ativo' ? '#22c55e' : '#94a3b8',
                    }}>
                      {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={cellStyle}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                  <td style={{ ...cellStyle, position: 'relative', overflow: 'visible' }}>
                    <button onClick={(e) => toggleMenu(u.id, e)} style={ghostBtn}>
                      <MoreIcon />
                    </button>
                    {menuOpen === u.id && (
                      <div style={dropdownStyle}>
                        <DropdownItem icon={<EyeIcon />} label="Visualizar" onClick={() => { showToast(`Visualizando: ${u.nome}`); setMenuOpen(null); }} />
                        <DropdownItem icon={<PencilIcon />} label="Editar" onClick={() => openEdit(u)} />
                        <DropdownItem icon={<TrashIcon />} label="Excluir" danger onClick={() => confirmDelete(u.id)} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CREATE / EDIT */}
      {openModal && (
        <div style={overlay} onClick={() => resetForm()}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  {editing ? 'Editar Usuário' : 'Novo Usuário'}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                  {editing ? 'Edite as informações do usuário.' : 'Cadastre um novo usuário no sistema.'}
                </p>
              </div>
              <button onClick={resetForm} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: '#94a3b8', padding: 4 }}>✕</button>
            </div>

            <label style={labelStyle}>Nome *</label>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: João Silva" style={inputStyle} />

            <label style={labelStyle}>E-mail *</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="joao@empresa.com" style={inputStyle} />

            <label style={labelStyle}>Cliente *</label>
            <select value={form.cliente_id} onChange={e => setForm({ ...form, cliente_id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Selecione um cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>

            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <button onClick={resetForm} style={cancelBtn}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={heroBtn}>
                {saving ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar Usuário'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div style={overlay} onClick={() => setDeleteId(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Excluir usuário?</h3>
            <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: 14 }}>
              Essa ação não pode ser desfeita. Todos os dados deste usuário serão removidos.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setDeleteId(null)} style={cancelBtn}>Cancelar</button>
              <button onClick={deleteUsuario} style={dangerBtn}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#0f172a', color: '#f8fafc', padding: '12px 20px',
          borderRadius: 10, fontSize: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 100, border: '1px solid hsla(210,40%,98%,0.1)',
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// DropdownItem
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

// STYLES
const cellStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 14, color: 'hsla(210,40%,98%,0.8)' };

const heroBtn: React.CSSProperties = {
  background: 'linear-gradient(90deg, #06b6d4, #67e8f9)',
  border: 'none', padding: '10px 18px', borderRadius: 10,
  color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
  display: 'inline-flex', alignItems: 'center', gap: 8,
  boxShadow: '0 4px 14px rgba(6,182,212,0.3)',
  transition: 'opacity 0.2s, transform 0.2s',
};

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

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 50,
};

const modalBox: React.CSSProperties = {
  background: '#1e293b', padding: 28, borderRadius: 16, width: 500,
  boxShadow: '0 30px 80px rgba(0,0,0,0.4)', border: '1px solid hsla(210,40%,98%,0.08)',
  color: '#f8fafc',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94a3b8',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1px solid hsla(210,40%,98%,0.12)', background: 'hsla(210,40%,98%,0.04)',
  color: '#f8fafc', fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box',
};

const cancelBtn: React.CSSProperties = {
  background: 'hsla(210,40%,98%,0.06)', border: '1px solid hsla(210,40%,98%,0.12)',
  padding: '10px 16px', borderRadius: 10, cursor: 'pointer', color: '#f8fafc', fontSize: 14,
};

const dangerBtn: React.CSSProperties = {
  background: '#ef4444', border: 'none', padding: '10px 16px',
  borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
};
