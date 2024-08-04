import { Form } from "~/app/_components/forms/form";
import { addProduct } from "../_actions/add-product";

export function ProductForm() {
  return (
    <Form
      action={addProduct}
      initialState={{ name: "", price: 0, tastingNotes: "" }}
    >
      {({ FormControl }) => (
        <>
          <input name="name" placeholder="Name" />
          <input inputMode="numeric" name="price" placeholder="Price" />
          <input name="tastingNotes" placeholder="Tasting Notes" />
          <button>Submit</button>
        </>
      )}
    </Form>
  );
}
