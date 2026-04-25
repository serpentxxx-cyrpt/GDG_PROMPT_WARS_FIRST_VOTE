import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../services/firebase";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaders(data);
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <div className="game-container" style={{ padding: "100px 20px 40px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "8px", background: "linear-gradient(to right, var(--color-saffron), var(--color-blue-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Citizen Leaderboard
        </h1>
        <p style={{ color: "var(--text-muted)" }}>Top Integrity Scores across the simulation</p>
      </div>

      <button className="btn btn-secondary" onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back to Home
      </button>

      <div className="glass-card" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading citizens...</div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No records found. Be the first!</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {leaders.map((user, index) => {
              const isTop = index < 3;
              const badgeColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
              return (
                <div key={user.id} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "16px 20px", 
                  background: isTop ? `linear-gradient(to right, ${badgeColors[index]}15, transparent)` : "var(--bg-card-2)",
                  border: isTop ? `1px solid ${badgeColors[index]}40` : "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  gap: "16px"
                }}>
                  <div style={{ 
                    fontSize: isTop ? "1.5rem" : "1.2rem", 
                    fontWeight: 800, 
                    color: isTop ? badgeColors[index] : "var(--text-muted)",
                    width: "30px",
                    textAlign: "center"
                  }}>
                    {index + 1}
                  </div>
                  
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="profile" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "1px solid var(--border-subtle)" }} />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-glass-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                      🧑
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "1.1rem", color: "var(--text-primary)" }}>{user.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {user.certificate?.issued ? `🏅 ${user.certificate.profile}` : `Level: ${user.level}`}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--color-saffron)" }}>
                      {user.ip}
                    </div>
                    <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>
                      Points
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
