function Memories() {
  return (
    <div className="memories-page">
      <header>
        <h1>Memory Nodes</h1>
        <p>Your saved knowledge</p>
      </header>

      <main>
        <div className="memory-toolbar">
          <input
            type="text"
            placeholder="Search memory nodes..."
          />

          <select defaultValue="date">
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        <div className="memory-grid">
          <div className="empty-state">
            <h2>No memory nodes yet</h2>
            <p>
              Your saved memories will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Memories;