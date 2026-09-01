import MemoryCard from "./MemoryCard";
function MemoryGrid() {
  const memories = [
    {
      id: 1,
      title: "Web Standards and best practices",
      date: "2023-10-27",
      category: "Common",
      icon: "📜",
    },
    {
      id: 2,
      title: "Cartography of the Atlantic",
      date: "2023-10-26",
      category: "Science",
      icon: "🗺️",
    },
    {
      id: 3,
      title: "The Golden Age of Pirates",
      date: "2023-10-27",
      category: "History",
      icon: "⚙️",
    },
    {
      id: 4,
      title: "Polishline History",
      date: "2023-10-27",
      category: "Chance",
      icon: "⚙️",
    },
  ];

  return (
    <div className="border-2 border-[#4b3d2a] rounded-md bg-[#ead7ae] p-3">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">

        <div>
          <h2 className="font-bold text-lg">
            Memory Node Grid
          </h2>

          <p className="text-xs">
            (Simplified Inventory System)
          </p>
        </div>


        <div className="flex gap-2 text-sm">

          <span>Sort by</span>

          <select className="border border-[#4b3d2a] rounded px-2">
            <option>Date</option>
            <option>Name</option>
            <option>Category</option>
          </select>

          <select className="border border-[#4b3d2a] rounded px-2">
            <option>Type</option>
            <option>Article</option>
            <option>Note</option>
          </select>

        </div>

      </div>


      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

        {memories.map((memory) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
          />
        ))}

      </div>

    </div>
  );
}

export default MemoryGrid;