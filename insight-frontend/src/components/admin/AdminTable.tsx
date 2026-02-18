interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
}

export function AdminTable({ columns, data }: AdminTableProps) {
  if (data.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'hsla(210,40%,98%,0.4)' }}>
        Nenhum registro encontrado
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid hsla(210,40%,98%,0.08)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'hsla(210,40%,98%,0.03)' }}>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600,
                color: 'hsla(210,40%,98%,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em',
                borderBottom: '1px solid hsla(210,40%,98%,0.08)',
              }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: '1px solid hsla(210,40%,98%,0.05)' }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '12px 16px', fontSize: 14, color: 'hsla(210,40%,98%,0.8)' }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}