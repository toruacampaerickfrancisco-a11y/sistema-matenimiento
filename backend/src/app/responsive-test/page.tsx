"use client";

import { useState } from 'react';
import styles from './responsive-test.module.css';

const devices = [
  { name: 'iPhone 12 Pro', width: 390, height: 844, ratio: 3 },
  { name: 'iPhone SE', width: 375, height: 667, ratio: 2 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800, ratio: 3 },
  { name: 'iPad', width: 768, height: 1024, ratio: 2 },
  { name: 'Desktop', width: 1920, height: 1080, ratio: 1 },
];

export default function ResponsiveTest() {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [currentUrl, setCurrentUrl] = useState('http://localhost:30002');
  const [isLandscape, setIsLandscape] = useState(false);

  const frameWidth = isLandscape ? selectedDevice.height / 2 : selectedDevice.width / 2;
  const frameHeight = isLandscape ? selectedDevice.width / 2 : selectedDevice.height / 2;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <h1>📱 Responsive Testing Tool</h1>
        
        <div className={styles.deviceSelector}>
          {devices.map((device) => (
            <button
              key={device.name}
              onClick={() => setSelectedDevice(device)}
              className={`${styles.deviceBtn} ${selectedDevice.name === device.name ? styles.active : ''}`}
            >
              {device.name}
            </button>
          ))}
        </div>

        <div className={styles.urlControls}>
          <button 
            onClick={() => setCurrentUrl('http://localhost:30001')}
            className={`${styles.urlBtn} ${currentUrl.includes('30001') ? styles.active : ''}`}
          >
            🖥️ Desktop (30001)
          </button>
          <button 
            onClick={() => setCurrentUrl('http://localhost:30002')}
            className={`${styles.urlBtn} ${currentUrl.includes('30002') ? styles.active : ''}`}
          >
            📱 Mobile (30002)
          </button>
        </div>

        <div className={styles.orientationControls}>
          <button 
            onClick={() => setIsLandscape(false)}
            className={`${styles.orientationBtn} ${!isLandscape ? styles.active : ''}`}
          >
            📱 Portrait
          </button>
          <button 
            onClick={() => setIsLandscape(true)}
            className={`${styles.orientationBtn} ${isLandscape ? styles.active : ''}`}
          >
            🔄 Landscape
          </button>
        </div>

        <div className={styles.deviceInfo}>
          <p><strong>{selectedDevice.name}</strong></p>
          <p>{frameWidth * 2}×{frameHeight * 2}px</p>
          <p>Ratio: {selectedDevice.ratio}x</p>
        </div>
      </div>

      <div className={styles.viewport}>
        <div 
          className={styles.deviceFrame}
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
          }}
        >
          <div className={styles.deviceBezel}>
            <iframe
              src={currentUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              className={styles.deviceScreen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}