import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
