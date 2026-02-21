import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminTable } from '../../components/admin/AdminTable';

interface Permissao {
  id: string;
  usuario_id: string;
  relatorio_id: string;
  usuario_nome?: string;
  usuario_email?: string;
  relatorio_nome?: string;
}

interface Usuario { id: string; nome: string; email: string; }
interface Relatorio { id: string; nome: string; }

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

export default function AdminPermissoes() {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Permissao | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [form, setForm] = useState({ usuario_id: '', relatorio_id: '' });

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2500); };

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('permissoes').select('id, usuario_id, relatorio_id, usuarios(nome, email), relatorios(nome)').order('created_at', { ascending: false });
    setPermissoes((data || []).map((p: any) => ({
      id: p.id, usuario_id: p.usuario_id, relatorio_id: p.relatorio_id,
      usuario_nome: p.usuarios?.nome || '-', usuario_email: p.usuarios?.email || '-',
      relatorio_nome: p.relatorios?.nome || '-',
    })));
    setLoading(false);
  };

  const fetchAux = async () => {
    const [{ data: u }, { data: r }] = await Promise.all([
      supabase.from('usuarios').select('id, nome, email').eq('status', 'ativo').order('nome'),
      supabase.from('relatorios').select('id, nome').eq('status', 'ativo').order('nome'),
    ]);
    setUsuarios(u || []);
    setRelatorios(r || []);
  };

  useEffect(() => { fetchData(); fetchAux(); }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpenModal(false); setDeleteTarget(null); } };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const resetForm = () => { setForm({ usuario_id: '', relatorio_id: '' }); setOpenModal(false); };

  const handleSave = async () => {
    if (!form.usuario_id || !form.relatorio_id) return showToast('Selecione usuário e relatório');
    setSaving(true);
    const { error } = await supabase.from('permissoes').insert({ usuario_id: form.usuario_id, relatorio_id: form.relatorio_id });
    if (error) { console.error('Erro insert permissoes:', error); showToast('Erro: ' + error.message); }
    else showToast('Permissão criada');
    setSaving(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('permissoes').delete().eq('id', deleteTarget.id);
    if (error) { console.error('Erro delete permissoes:', error); showToast('Erro: ' + error.message); }
    else showToast('Permissão excluída');
    setDeleteTarget(null);
    fetchData();
  };

  const filtered = permissoes.filter(p => (p.usuario_nome || '').toLowerCase().includes(search.toLowerCase()) || (p.relatorio_nome || '').toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {
      key: 'usuario_nome', header: 'Usuário',
      render: (_: any, row: any) => (
        <div>
          <p style={{ fontWeight: 500, margin: 0 }}>{row.usuario_nome}</p>
          <p style={{ fontSize: 12, color: 'hsla(210,40%,98%,0.4)', margin: 0 }}>{row.usuario_email}</p>
        </div>
      )
    },
    { key: 'relatorio_nome', header: 'Relatório' },
    { key: 'id', header: 'ID', render: (v: any) => <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'hsla(210,40%,98%,0.4)' }}>{v?.slice(0, 8)}...</span> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, marginBottom: 4, color: '#f8fafc' }}>Permissões</h1>
          <p style={{ margin: 0, opacity: 0.6, fontSize: 14, color: '#f8fafc' }}>Controle de acesso aos relatórios</p>
        </div>
        <button onClick={() => setOpenModal(true)} style={heroButton}><PlusIcon /> Nova Permissão</button>
      </div>

      <div style={{ position: 'relative', maxWidth: 420 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}><SearchIcon /></span>
        <input placeholder="Buscar por usuário ou relatório..." value={search} onChange={e => setSearch(e.target.value)} style={searchInput} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 28, height: 28, border: '3px solid hsla(210,40%,98%,0.12)', borderTop: '3px solid #06b6d4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <AdminTable columns={columns} data={filtered} onView={(row) => showToast(`${row.usuario_nome} → ${row.relatorio_nome}`)} onDelete={(row) => setDeleteTarget(row)} />
      )}

      {openModal && (
        <div style={overlay} onClick={() => resetForm()}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Nova Permissão</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>Vincule um usuário a um relatório.</p>
              </div>
              <button onClick={resetForm} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: '#94a3b8', padding: 4 }}>✕</button>
            </div>

            <label style={labelStyle}>Usuário *</label>
            <select value={form.usuario_id} onChange={e => setForm({ ...form, usuario_id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Selecione um usuário</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>)}
            </select>

            <label style={labelStyle}>Relatório *</label>
            <select value={form.relatorio_id} onChange={e => setForm({ ...form, relatorio_id: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Selecione um relatório</option>
              {relatorios.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <button onClick={resetForm} style={cancelBtn}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={heroButton}>{saving ? 'Salvando...' : 'Cadastrar Permissão'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={overlay} onClick={() => setDeleteTarget(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Excluir permissão?</h3>
            <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: 14 }}>A permissão de "{deleteTarget.usuario_nome}" para "{deleteTarget.relatorio_nome}" será removida.</p>
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
const modalBox: React.CSSProperties = { background: '#1e293b', padding: 28, borderRadius: 16, width: 500, boxShadow: '0 30px 80px rgba(0,0,0,0.4)', border: '1px solid hsla(210,40%,98%,0.08)', color: '#f8fafc' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#94a3b8' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid hsla(210,40%,98%,0.12)', background: 'hsla(210,40%,98%,0.04)', color: '#f8fafc', fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' };
const cancelBtn: React.CSSProperties = { background: 'hsla(210,40%,98%,0.06)', border: '1px solid hsla(210,40%,98%,0.12)', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', color: '#f8fafc', fontSize: 14 };
const dangerBtn: React.CSSProperties = { background: '#ef4444', border: 'none', padding: '10px 16px', borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 };
const toastStyle: React.CSSProperties = { position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#f8fafc', padding: '12px 20px', borderRadius: 10, fontSize: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 100, border: '1px solid hsla(210,40%,98%,0.1)' };
