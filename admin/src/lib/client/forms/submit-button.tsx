"use client";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";
import { useFormProvider } from "./form-provider";

type SubmitButtonProps = {
  className?: string;
  children?: React.ReactNode;
  submittingElement?: React.ReactNode;
};
export function SubmitButton({
  className,
  children,
  submittingElement = "Submitting...",
}: SubmitButtonProps) {
  const { useSelector } = useFormProvider();
  const disabled = useSelector((state) => state.disabled);
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={twMerge(className)}
      disabled={disabled || pending}
    >
      {pending ? submittingElement : children}
    </button>
  );
}
