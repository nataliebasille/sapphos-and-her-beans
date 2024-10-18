import { MenuIcon } from "./menu-icon";
import { PublishButton } from "./publish-button";

export function Header() {
  return (
    <header className="flex border-b-[1px] border-primary-200/30 px-8 py-2">
      <MenuIcon />
      <PublishButton />
    </header>
  );
}
