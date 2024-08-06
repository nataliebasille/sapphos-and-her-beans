import { Form } from "~/app/_components/forms/form";
import { addProduct } from "../_actions/add-product";

export function ProductForm() {
  return (
    <Form
      action={addProduct}
      initialState={{ name: "", price: 0, tastingNotes: "" }}
    >
      {({ FormControl }) => (
        <div className="flex flex-col gap-4">
          <h3 className="self-center">Product description</h3>
          <FormControl name="name" label="Name" />
          <FormControl inputMode="numeric" label="Price" name="price" />
          <FormControl name="tastingNotes" label="Tasting notes" />
          <button>Submit</button>
        </div>
      )}
    </Form>
  );
}
