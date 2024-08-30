import { FormProvider } from "./form-provider";
import { type ComponentType } from "react";
import { type FormControlProps } from "./form-control";
import { type FormErrorProps, FormError } from "./form-error";
import { formControl } from "./form-control-server";
import {
  type FormAction_GetMetadata,
  type AnyFormAction,
} from "~/server/server-form-actions/actions";
import { type Validation_GetSchema } from "~/server/server-form-actions.old/validation";

type ChildrenFactoryProps<TIn> = {
  FormError: ComponentType<FormErrorProps<TIn>>;
  FormControl: <
    TControl extends keyof JSX.IntrinsicElements | ComponentType<any>,
  >(
    props: FormControlProps<TIn, TControl>,
  ) => React.ReactNode;
};

type ChildrenFactory<TIn> = (
  props: ChildrenFactoryProps<TIn>,
) => React.ReactNode;

type InitialState<TResult> = {
  [K in keyof TResult as TResult[K] extends File ? never : K]: TResult[K];
};

export type FormProps<TAction extends AnyFormAction> = {
  className?: string;
  action: TAction;
  initialState: InitialState<Validation_GetSchema<TAction>>;
  children?: ChildrenFactory<Validation_GetSchema<TAction>>;
} & Omit<JSX.IntrinsicElements["form"], "action" | "children">;

const WithinFormContext = <TAction extends AnyFormAction>({
  children,
}: Pick<FormProps<TAction>, "children">) => {
  return children?.({
    FormError,
    FormControl: formControl.forInput<FormAction_GetMetadata<TAction>>(),
  });
};

export const Form = <TAction extends AnyFormAction>({
  children,
  ...formProps
}: FormProps<TAction>) => {
  return (
    <FormProvider {...formProps}>
      <WithinFormContext>{children}</WithinFormContext>
    </FormProvider>
  );
};
