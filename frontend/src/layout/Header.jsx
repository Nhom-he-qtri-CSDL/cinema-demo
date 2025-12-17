import { LOGO, HOME_ICON, MYTICKET_ICON } from "../utils/constants";
function Header() {
  return (
    <header className="bg-[var(--primary-color)] p-4 flex justify-between items-center border-b-1 border-solid border-[var(--light-color)]">
      <img
        src={LOGO.src}
        alt={LOGO.alt}
        width={LOGO.width}
        height={LOGO.height}
      />
      <nav className="mr-4">
        <ul className="flex space-x-6 items-center text-white font-semibold">
          <li className="cursor-pointer">
            <img
              src={HOME_ICON.src}
              alt={HOME_ICON.alt}
              width={HOME_ICON.width}
              height={HOME_ICON.height}
            />
          </li>
          <li className="cursor-pointer">
            <img
              src={MYTICKET_ICON.src}
              alt={MYTICKET_ICON.alt}
              width={MYTICKET_ICON.width}
              height={MYTICKET_ICON.height}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
