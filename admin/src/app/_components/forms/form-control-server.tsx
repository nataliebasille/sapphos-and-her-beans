import { type ComponentType } from "react";
import { FormControl, type FormControlProps } from "./form-control";
import { type FormAction } from "./form-provider";

type FormControlCreator = {
  forAction: <TAction extends FormAction<unknown, unknown>>() => <
    TControl extends keyof JSX.IntrinsicElements | ComponentType<unknown>,
  >(
    props: FormControlProps<
      TAction extends FormAction<infer TIn, unknown> ? TIn : never,
      TControl
    >,
  ) => React.ReactNode;
  forInput: <TIn>() => <
    TControl extends keyof JSX.IntrinsicElements | ComponentType<unknown>,
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
