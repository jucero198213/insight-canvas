export default function PageContainer({ children }) {
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
}
