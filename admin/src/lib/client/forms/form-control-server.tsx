import { type ComponentType } from "react";
import { FormControl, type FormControlProps } from "./form-control";
import {
  type FormAction_GetInput,
  type AnyFormAction,
} from "~/lib/server/action-rpc/forms/form-action";

type FormControlCreator = {
  forAction: <TAction extends AnyFormAction>() => <
    TControl extends keyof JSX.IntrinsicElements | ComponentType<any>,
  >(
    props: FormControlProps<FormAction_GetInput<TAction>, TControl>,
  ) => React.ReactNode;
  forInput: <TIn>() => <
    TControl extends keyof JSX.IntrinsicElements | ComponentType<any>,
  >(
    props: FormControlProps<TIn, TControl>,
  ) => React.ReactNode;
};

export const formControl = {
  forAction: () => {
    return FormControl;
  },
  forInput: () => {
    return FormControl;
  },
} as unknown as FormControlCreator;
