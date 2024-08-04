import { FormControl } from "./form-control";
import { type FormAction } from "./form-provider";

export const fromControl = {
  forAction: <TAction extends FormAction<unknown, unknown>>() =>
    FormControl<TAction extends FormAction<infer TIn, unknown> ? TIn : never>,
  forInput: <TIn,>() => FormControl<TIn>,
};
