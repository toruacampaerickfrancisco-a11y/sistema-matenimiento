import NotificationsView from '../../components/NotificationsView';

export default function UserNotificationsPage() {
  // Aquí deberías obtener el userId del usuario autenticado
  // Por ejemplo, desde contexto, props, o localStorage
  const userId = typeof window !== 'undefined' ? localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser') || '{}').id : '';

  return <NotificationsView userId={userId || ''} />;
}
