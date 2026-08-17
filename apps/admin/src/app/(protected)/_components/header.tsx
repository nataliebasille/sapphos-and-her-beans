import { MenuIcon } from "./menu-icon";
import { PublishButton } from "./publish-button";

export function Header() {
  return (
    <header className="border-primary-200/30 flex border-b-[1px] px-8 py-2">
      <MenuIcon />
      <PublishButton />
    </header>
  );
}
