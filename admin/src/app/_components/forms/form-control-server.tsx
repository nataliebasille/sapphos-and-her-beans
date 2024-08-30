import { type ComponentType } from "react";
import { FormControl, type FormControlProps } from "./form-control";
import {
  type FormAction,
  type AnyFormAction,
} from "~/server/server-form-actions/actions";

type FormControlCreator = {
  forAction: <TAction extends AnyFormAction>() => <
    TControl extends keyof JSX.IntrinsicElements | ComponentType<any>,
  >(
    props: FormControlProps<
      TAction extends FormAction<infer TIn, any, any> ? TIn : never,
      TControl
    >,
  ) => React.ReactNode;
  forInput: <TIn>() => <
    TControl extends keyof JSX.IntrinsicElements | ComponentType<any>,
  >(
    props: FormControlProps<TIn, TControl>,
  ) => React.ReactNode;
};

export const formControl: FormControlCreator = {
  forAction: () => {
    return FormControl;
  },
  forInput: () => {
    return FormControl;
  },
};
