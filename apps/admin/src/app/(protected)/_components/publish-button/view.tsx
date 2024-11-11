import { Button } from "~/lib/client/ui/button";

type PublishButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export function PublishButtonView({
  children,
  onClick,
  disabled,
}: PublishButtonProps) {
  return (
    <Button
      variant="primary"
      style="outline"
      className="ml-auto flex items-center gap-2 text-sm uppercase tracking-wider"
      disabled={disabled}
      onClick={onClick}
    >
      {children} Publish{" "}
    </Button>
  );
}
