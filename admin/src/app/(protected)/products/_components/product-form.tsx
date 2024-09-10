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
          <FormControl
            control="input"
            name="name"
            label="Name"
            inputProps={{ type: "text" }}
          />
          <FormControl
            control="input"
            label="Price"
            name="price"
            inputProps={{ inputMode: "numeric" }}
          />
          <FormControl
            control="textarea"
            name="tastingNotes"
            label="Tasting notes"
          />
          <button>Submit</button>
        </div>
      )}
    </Form>
  );
}
