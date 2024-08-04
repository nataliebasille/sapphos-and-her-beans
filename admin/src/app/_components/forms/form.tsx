import { type FormAction, FormProvider } from "./form-provider";
import { type ComponentType } from "react";
import { type FormControlProps } from "./form-control";
import { type FormErrorProps, FormError } from "./form-error";
import { fromControl } from "./form-control-server";

type ChildrenFactoryProps<TIn> = {
  FormError: ComponentType<FormErrorProps<TIn>>;
  FormControl: ComponentType<FormControlProps<TIn>>;
};

type ChildrenFactory<TIn> = (
  props: ChildrenFactoryProps<TIn>,
) => React.ReactNode;

export type FormProps<TIn, TResult> = {
  className?: string;
  action: FormAction<TIn, TResult>;
  initialState: TResult;
  children?: ChildrenFactory<TIn>;
} & Omit<JSX.IntrinsicElements["form"], "action" | "children">;

const WithinFormContext = <TIn, TResult>({
  children,
}: Pick<FormProps<TIn, TResult>, "children">) => {
  return children?.({ FormError, FormControl: fromControl.forInput<TIn>() });
};

export const Form = <TIn, TResult>({
  children,
  ...formProps
}: FormProps<TIn, TResult>) => {
  return (
    <FormProvider {...formProps}>
      <WithinFormContext>{children}</WithinFormContext>
    </FormProvider>
  );
};
