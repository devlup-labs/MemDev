function MemoryCard({ memory }) {
  return (
    <div
      className="
        flex
        gap-2
        border-2
        border-[#4b3d2a]
        rounded-md
        bg-[#e6cc9b]
        p-2
        cursor-pointer
        hover:bg-[#dcc08a]
        transition
      "
    >

      {/* Icon */}
      <div className="
        w-12
        h-12
        shrink-0
        border-2
        border-[#4b3d2a]
        bg-[#c8a86e]
        flex
        items-center
        justify-center
        text-2xl
      ">
        {memory.icon}
      </div>


      {/* Content */}
      <div className="min-w-0">

        <h3 className="font-bold text-sm leading-tight">
          {memory.title}
        </h3>

        <p className="text-xs">
          (Captured: {memory.date}, Cat: {memory.category})
        </p>

      </div>

    </div>
  );
}

export default MemoryCard;