import dynamic from 'next/dynamic';
export default dynamic(() => import('./NotificationsPanel'), { ssr: false });
