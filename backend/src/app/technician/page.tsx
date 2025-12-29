import { redirect } from 'next/navigation';

export default function TechnicianRedirect() {
  redirect('/tecnico');
  return null;
}