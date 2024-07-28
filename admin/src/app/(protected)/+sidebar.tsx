import Image from "next/image";

export function Sidebar() {
  return (
    <>
      <div className="mx-auto">
        <Image
          src="/images/sappho no background - cropped.png"
          alt="Sappho"
          className="!static mx-auto !h-auto !w-[50%] border-b-[1px] border-secondary-base object-contain"
          fill
        />
        <h2
          className="py-2 text-center uppercase tracking-widest text-primary-contrast-base"
          style={{ fontFamily: "fantasy" }}
        >
          Admin
        </h2>
      </div>

      <div className="divider-surface divider my-0" />

      <ul className="list list-secondary">
        <li className="list-item">Products</li>
      </ul>
    </>
  );
}
