import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import styles from './Login.module.css';
import Modal from '@/components/Modal';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Intentando login con:', username, password);
      const user = await login({ username, password });
      console.log('Login exitoso, redirigiendo según rol:', user.role);
      
      if (user.role === 'usuario' || user.role === 'user') {
        navigate('/tickets');
      } else if (user.role === 'inventario') {
        navigate('/equipos');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error de login:', error);
      if (error instanceof Error) {
        setError(error.message || 'Error al iniciar sesión');
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Fondo estático del desierto */}
      <div className={styles.desertBackground}></div>
      
      {/* Overlay púrpura/magenta */}
      <div className={styles.purpleOverlay}></div>

      {/* Línea vertical divisoria */}
      <div className={styles.verticalDivider}></div>

      {/* Contenedor Izquierdo (Textos) */}
      <div className={styles.leftContent}>
        <div className={styles.textContent}>
          <h1 className={styles.mainTitle}>SECRETARIA DE BIENESTAR DEL ESTADO DE SONORA</h1>
          <p className={styles.description}>
            Sistema interno para el reporte de las y los servidores públicos de la secretaría. Gestión eficiente de recursos y mantenimiento para el bienestar de Sonora
          </p>
          <p className={styles.slogan}>
            SISTEMA INTERNO DE MANTENIMIENTO
          </p>
        </div>
        
        <div className={styles.footerContent}>
          <div className={styles.address}>
            Gran Plaza, Blvr. P.º Río Sonora Nte. 76-Int. 207, Proyecto Rio Sonora Hermosillo XXI, 83270 Hermosillo, Sonora, México
          </div>
          <div className={styles.privacyLink}>Aviso de privacidad.</div>
        </div>
      </div>

      {/* Contenedor Derecho (Formulario) */}
      <div className={styles.rightContent}>
        <div className={styles.authForm}>
          <div className={styles.loginHeading}>
            <div className={styles.userIconContainer}>
              <User size={80} color="white" strokeWidth={1.8} />
            </div>
            
            <h2 className={styles.loginTitle}>INICIAR SESIÓN</h2>

            <form onSubmit={handleSubmit}>
            {error && (
              <div className={styles.alertMessage}>
                <div className={styles.textAlertMessage}>
                  {error}
                </div>
              </div>
            )}

            {/* Campo Correo electrónico */}
            <div className={styles.inputGroup}>
              <label htmlFor="nickname" className={styles.inputLabel}>
                Correo electrónico
              </label>
              <input
                id="nickname"
                required
                className={styles.formControl}
                name="nickname"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Campo Contraseña */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                Contraseña
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  required
                  className={styles.formControl}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} color="white" /> : <Eye size={20} color="white" />}
                </button>
              </div>
            </div>

            <div className={styles.forgotPasswordSection}>
              <a 
                href="#" 
                className={styles.forgotPasswordLink}
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotModal(true);
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón */}
            <div className={styles.submitSection}>
              <button
                className={styles.btnWhite}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {/* Modal de Recuperación de Contraseña */}
    <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Recuperación de Contraseña"
        size="md"
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', color: '#4b5563' }}>
            <p style={{ marginBottom: '15px' }}>
              Por razones de seguridad, el restablecimiento de contraseñas debe ser realizado por el administrador del sistema.
            </p>
            <p>
              Por favor, contacte al departamento de Sistemas para solicitar una nueva contraseña.
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '15px', 
            borderRadius: '8px',
            textAlign: 'left',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
              <Mail size={18} color="#2563eb" />
              <span style={{ fontWeight: 500, color: '#374151' }}>yesmil.figueroa@sonora.gob.mx</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color="#2563eb" />
              <span style={{ fontWeight: 500, color: '#374151' }}>Ext. 46041</span>
            </div>
          </div>

          <button
            onClick={() => setShowForgotModal(false)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              width: '100%'
            }}
          >
            Entendido
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
