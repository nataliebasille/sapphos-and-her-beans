import { PaperAirplaneSVG } from "@natcore/design-system-core/src/icons/paper-airplane";

export function PublishButton() {
  return (
    <button className="btn-primary btn btn-outline ml-auto flex items-center gap-2 text-sm uppercase tracking-wider">
      <PaperAirplaneSVG className="size-5" /> Publish
    </button>
  );
}
