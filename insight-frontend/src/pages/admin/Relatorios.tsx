import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface Relatorio {
  id: string;
  nome: string;
  report_id: string;
  descricao: string | null;
  dataset_id: string | null;
  workspace_id: string | null;
  status: string;
  created_at: string;
  cliente_id: string;
  cliente_nome?: string;
}

interface Cliente { id: string; nome: string; }

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

export default function AdminRelatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Relatorio | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Relatorio | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [form, setForm] = useState({ nome: '', report_id: '', descricao: '', dataset_id: '', workspace_id: '', cliente_id: '', status: 'ativo' });

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2500); };

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('relatorios').select('id, nome, report_id, descricao, dataset_id, workspace_id, status, created_at, cliente_id, clientes(nome)').order('created_at', { ascending: false });
    setRelatorios((data || []).map((r: any) => ({ ...r, cliente_nome: r.clientes?.nome || '-' })));
    setLoading(false);
  };

  const fetchClientes = async () => {
    const { data } = await supabase.from('clientes').select('id, nome').eq('status', 'ativo').order('nome');
    setClientes(data || []);
  };

  useEffect(() => { fetchData(); fetchClientes(); }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpenModal(false); setDeleteTarget(null); } };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const resetForm = () => { setForm({ nome: '', report_id: '', descricao: '', dataset_id: '', workspace_id: '', cliente_id: '', status: 'ativo' }); setEditing(null); setOpenModal(false); };

  const handleSave = async () => {
    if (!form.nome.trim() || !form.report_id.trim()) return showToast('Informe nome e Report ID');
    if (!form.cliente_id) return showToast('Selecione um cliente');
    setSaving(true);
    const payload = {
      nome: form.nome, report_id: form.report_id, descricao: form.descricao || null,
      dataset_id: form.dataset_id || null, workspace_id: form.workspace_id || null,
      cliente_id: form.cliente_id, status: form.status,
    };
    if (editing) {
      const { error } = await supabase.from('relatorios').update(payload).eq('id', editing.id);
      showToast(error ? 'Erro ao atualizar' : 'Relatório atualizado');
    } else {
      const { error } = await supabase.from('relatorios').insert(payload);
      showToast(error ? 'Erro ao cadastrar' : 'Relatório criado');
    }
    setSaving(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('relatorios').delete().eq('id', deleteTarget.id);
    showToast(error ? 'Erro ao excluir' : 'Relatório excluído');
    setDeleteTarget(null);
    fetchData();
  };

  const openEdit = (r: Relatorio) => {
    setEditing(r);
    setForm({ nome: r.nome, report_id: r.report_id, descricao: r.descricao || '', dataset_id: r.dataset_id || '', workspace_id: r.workspace_id || '', cliente_id: r.cliente_id, status: r.status });
    setOpenModal(true);
  };

  const filtered = relatorios.filter(r => r.nome.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'nome', header: 'Nome' },
    { key: 'cliente_nome', header: 'Cliente' },
    { key: 'report_id', header: 'Report ID', render: (v: any) => <span style={{ fontSize: 11, fontFamily: 'monospace', background: 'hsla(210,40%,98%,0.05)', padding: '2px 8px', borderRadius: 4 }}>{v}</span> },
    {
      key: 'status', header: 'Status',
      render: (v: any) => (
        <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: v === 'ativo' ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)', color: v === 'ativo' ? '#22c55e' : '#94a3b8' }}>
          {v === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    { key: 'created_at', header: 'Criado em', render: (v: any) => new Date(v).toLocaleDateString('pt-BR') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, marginBottom: 4, color: '#f8fafc' }}>Relatórios Power BI</h1>
          <p style={{ margin: 0, opacity: 0.6, fontSize: 14, color: '#f8fafc' }}>Gerencie os relatórios embedados</p>
        </div>
        <button onClick={() => setOpenModal(true)} style={heroButton}><PlusIcon /> Novo Relatório</button>
      </div>

      <div style={{ position: 'relative', maxWidth: 420 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><SearchIcon /></span>
        <input placeholder="Buscar relatórios..." value={search} onChange={e => setSearch(e.target.value)} style={searchInput} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 28, height: 28, border: '3px solid hsla(210,40%,98%,0.12)', borderTop: '3px solid #06b6d4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <AdminTable columns={columns} data={filtered} onView={(row) => showToast(`Visualizando: ${row.nome}`)} onEdit={openEdit} onDelete={(row) => setDeleteTarget(row)} />
      )}

      {openModal && (
        <div style={overlay} onClick={() => resetForm()}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{editing ? 'Editar Relatório' : 'Novo Relatório'}</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>Cadastre um relatório Power BI embedado.</p>
              </div>
              <button onClick={resetForm} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: '#94a3b8', padding: 4 }}>✕</button>
            </div>

            <label style={labelStyle}>Nome do Relatório *</label>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Report ID *</label>
            <input value={form.report_id} onChange={e => setForm({ ...form, report_id: e.target.value })} placeholder="GUID do relatório" style={inputStyle} />
            <label style={labelStyle}>Descrição</label>
            <input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Dataset ID</label>
            <input value={form.dataset_id} onChange={e => setForm({ ...form, dataset_id: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Workspace ID</label>
            <input value={form.workspace_id} onChange={e => setForm({ ...form, workspace_id: e.target.value })} style={inputStyle} />
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
              <button onClick={handleSave} disabled={saving} style={heroButton}>{saving ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar Relatório'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={overlay} onClick={() => setDeleteTarget(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Excluir relatório?</h3>
            <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: 14 }}>Essa ação não pode ser desfeita. O relatório "{deleteTarget.nome}" será removido.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setDeleteTarget(null)} style={cancelBtn}>Cancelar</button>
              <button onClick={handleDelete} style={dangerBtn}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div style={toastStyle}>{toastMsg}</div>}
    </div>
  );
}

const heroButton: React.CSSProperties = { background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.35)', padding: '9px 16px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'all 0.15s ease', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14 };
const searchInput: React.CSSProperties = { width: '100%', padding: '10px 16px 10px 42px', borderRadius: 10, border: '1px solid hsla(210,40%,98%,0.12)', background: 'hsla(210,40%,98%,0.04)', color: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
const modalBox: React.CSSProperties = { background: '#1e293b', padding: 28, borderRadius: 16, width: 500, boxShadow: '0 30px 80px rgba(0,0,0,0.4)', border: '1px solid hsla(210,40%,98%,0.08)', color: '#f8fafc', maxHeight: '90vh', overflowY: 'auto' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94a3b8' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid hsla(210,40%,98%,0.12)', background: 'hsla(210,40%,98%,0.04)', color: '#f8fafc', fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' };
const cancelBtn: React.CSSProperties = { background: 'hsla(210,40%,98%,0.06)', border: '1px solid hsla(210,40%,98%,0.12)', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', color: '#f8fafc', fontSize: 14 };
const dangerBtn: React.CSSProperties = { background: '#ef4444', border: 'none', padding: '10px 16px', borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 };
const toastStyle: React.CSSProperties = { position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#f8fafc', padding: '12px 20px', borderRadius: 10, fontSize: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 100, border: '1px solid hsla(210,40%,98%,0.1)' };
