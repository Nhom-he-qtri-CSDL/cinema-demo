import Header from "./Header";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-linear-to-b from-[var(--primary-color)] to-[var(--secondary-color)] py-[50px] px-[120px] text-[var(--light-color)] text-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
export default MainLayout;
