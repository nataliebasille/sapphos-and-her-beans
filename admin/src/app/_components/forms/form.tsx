import { type ComponentType } from "react";
import {
  type AnyFormAction,
  type FormAction_GetInput,
} from "~/server/action-rpc/forms/form-action";
import { type FormControlProps } from "./form-control";
import { formControl } from "./form-control-server";
import { type FormErrorProps, FormError } from "./form-error";
import { type FormProps as BaseFormProps, FormProvider } from "./form-provider";

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

type FormProps<TAction extends AnyFormAction> = BaseFormProps<TAction> & {
  children?: ChildrenFactory<FormAction_GetInput<TAction>>;
};

const WithinFormContext = <TAction extends AnyFormAction>({
  children,
}: Pick<FormProps<TAction>, "children">) => {
  return children?.({
    FormError,
    FormControl: formControl.forInput<FormAction_GetInput<TAction>>(),
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
