import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>MemDev</h1>

        <div className="dashboard-user">
          <div className="avatar">A</div>
          <div>
            <strong>Level 1</strong>
            <p>Scholar</p>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>Welcome to MemDev</h2>
          <p>Your memory node archive</p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <h3>Memory Nodes</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>Tags Created</h3>
            <p>0</p>
          </div>

          <div className="stat-card">
            <h3>Nodes Accessed</h3>
            <p>0</p>
          </div>
        </section>

        <section className="memory-section">
          <div className="section-header">
            <h2>Memory Nodes</h2>
            <Link to="/memories">View All</Link>
          </div>

          <div className="empty-state">
            <h3>No memory nodes yet</h3>
            <p>
              Start saving useful information and it will appear here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;