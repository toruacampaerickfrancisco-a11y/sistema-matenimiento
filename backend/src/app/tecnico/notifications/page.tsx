import NotificationsView from '../../components/NotificationsView';

export default function TechnicianNotificationsPage() {
  // Obtener el userId del técnico autenticado
  const userId = typeof window !== 'undefined' ? localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser') || '{}').id : '';

  return <NotificationsView userId={userId || ''} />;
}
