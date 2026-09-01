import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="settings-page">
      <header>
        <h1>Settings</h1>
        <p>Manage your MemDev account</p>
      </header>

      <main>
        <section className="settings-section">
          <h2>Account</h2>

          <div className="setting-item">
            <span>Username</span>
            <strong>Anvi</strong>
          </div>

          <div className="setting-item">
            <span>Email</span>
            <strong>anvi@gmail.com</strong>
          </div>
        </section>

        <section className="settings-section">
          <h2>Security</h2>

          <button onClick={handleLogout}>
            Logout
          </button>
        </section>
      </main>
    </div>
  );
}

export default Settings;