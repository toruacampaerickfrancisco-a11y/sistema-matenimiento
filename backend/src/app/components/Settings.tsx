"use client";

import React, { useState } from 'react';
import styles from './expediente.module.css';

export default function Settings() {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loginBgFile, setLoginBgFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(localStorage.getItem('customBanner') || null);
  const [loginBgPreview, setLoginBgPreview] = useState<string | null>(localStorage.getItem('customLoginBg') || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'login') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBannerFile(file);
          setBannerPreview(reader.result as string);
        } else {
          setLoginBgFile(file);
          setLoginBgPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (file: File, fileName: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Fallo al subir ${fileName}`);
    }
    return res.json();
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      let bannerPath = localStorage.getItem('customBanner');
      let loginBgPath = localStorage.getItem('customLoginBg');

      if (bannerFile) {
        const result = await handleUpload(bannerFile, 'banner-custom.png');
        bannerPath = `${result.path}?t=${new Date().getTime()}`; // Cache-busting
        localStorage.setItem('customBanner', bannerPath);
      }

      if (loginBgFile) {
        const result = await handleUpload(loginBgFile, 'login-bg-custom.jpg');
        loginBgPath = `${result.path}?t=${new Date().getTime()}`; // Cache-busting
        localStorage.setItem('customLoginBg', loginBgPath);
      }

      setMessage('Configuración guardada exitosamente. Los cambios pueden requerir recargar la página.');
      setBannerFile(null);
      setLoginBgFile(null);

    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle whether header shows text title instead of banner image
  const [useBannerText, setUseBannerText] = useState<boolean>(() => {
    try {
      const t = localStorage.getItem('useBannerText');
      return t === null ? true : t === 'true';
    } catch (_) { return true; }
  });

  const toggleBannerMode = () => {
    const next = !useBannerText;
    setUseBannerText(next);
    try { localStorage.setItem('useBannerText', next ? 'true' : 'false'); } catch (_) {}
  };

  const previewStyle = {
    width: '100%',
    height: '120px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #ddd'
  };

  return (
    <div style={{ width: '100%' }}>
      <h3>Configuración de Apariencia</h3>
      <div className={styles.card}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h4>Banner del Encabezado</h4>
            <div style={{ ...previewStyle, backgroundImage: `url(${bannerPreview || '/images/banner.png'})` }}></div>
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileChange(e, 'banner')} />
          </div>
          <div>
            <h4>Fondo de Inicio de Sesión</h4>
            <div style={{ ...previewStyle, backgroundImage: `url(${loginBgPreview || '/images/hero-bg-gobierno.jpg'})` }}></div>
            <input type="file" accept="image/jpeg" onChange={(e) => handleFileChange(e, 'login')} />
          </div>
        </div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
          {message && <span>{message}</span>}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
            <input type="checkbox" checked={useBannerText} onChange={toggleBannerMode} /> Mostrar título en el encabezado (en lugar de la imagen)
          </label>
          <button onClick={handleSave} disabled={loading} className={styles.btn} style={{ background: '#2aa58a', color: 'white' }}>{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </div>
    </div>
  );
}