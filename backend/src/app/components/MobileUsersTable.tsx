"use client";

import { useEffect, useState } from "react";
import styles from "./Table.module.css";

// Simple mobile card view for users
export default function MobileUsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users from API (adjust endpoint as needed)
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando usuarios...</div>;
  if (!users.length) return <div>No hay usuarios.</div>;

  return (
    <div className={styles.tableWrapper} style={{ padding: 0, minWidth: 0 }}>
      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            margin: "10px 0",
            padding: 12,
            background: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
          <div style={{ color: "#475569", fontSize: 13 }}>{user.email}</div>
          <div style={{ color: "#64748b", fontSize: 13 }}>Depto: {user.department}</div>
          <div style={{ color: "#64748b", fontSize: 13 }}>Rol: {user.role}</div>
        </div>
      ))}
    </div>
  );
}
