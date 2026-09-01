import Header from "./Header";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#9bb58a]">

      <Header />

      <main className="p-3">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;