function StatsAchievements() {
  return (
    <div className="border-2 border-[#4b3d2a] rounded-md bg-[#ead7ae] p-3 shadow-[2px_2px_0px_#4b3d2a]">

      <h2 className="font-bold text-lg mb-4">
        Achievements
      </h2>

      <div className="mb-4">

        <div className="flex justify-between text-sm">
          <span>Nodes Captured:</span>
          <span>42 / 100</span>
        </div>

        <div className="h-3 mt-1 border border-[#4b3d2a] bg-[#f1e5c7]">
          <div
            className="h-full bg-[#6f9b63]"
            style={{ width: "42%" }}
          />
        </div>

      </div>


      <div className="mb-5">

        <div className="flex justify-between text-sm">
          <span>Tags Created:</span>
          <span>5 / 10</span>
        </div>

        <div className="h-3 mt-1 border border-[#4b3d2a] bg-[#f1e5c7]">
          <div
            className="h-full bg-[#6f9b63]"
            style={{ width: "50%" }}
          />
        </div>

      </div>


    </div>
  );
}

export default StatsAchievements;