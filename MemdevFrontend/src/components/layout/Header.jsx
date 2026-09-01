function Header() {
  return (
    <header className="h-16 border-b-2 border-[#3b3325] bg-[#86a574] px-4 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-4">

        <div className="text-sm font-semibold">
           MemDev: Your Personal Library
        </div>

      </div>


      {/* Center */}
      <h1 className="text-xl md:text-2xl font-bold">
        MemDev: Your Personal Library <span className="text-sm">v1.0</span>
      </h1>


      {/* Right */}
      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2">

          <div className="w-10 h-10 border-2 border-[#3b3325] bg-[#e4c99a] flex items-center justify-center">
            👤
          </div>

          <div className="text-sm leading-tight">
            <div className="font-bold">
              USERNAME
            </div>
          </div>

        </div>

        <input
          type="text"
          placeholder="Search Nodes"
          className="w-36 border-2 border-[#3b3325] rounded px-2 py-2 bg-white outline-none"
        />

      </div>

    </header>
  );
}

export default Header;