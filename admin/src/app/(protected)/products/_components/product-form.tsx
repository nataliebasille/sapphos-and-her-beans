import { FileInput, Form } from "~/lib/client/forms";
import { addProduct } from "../_actions/add-product";

type ProductFormProps = {
  label: React.ReactNode;
};

export function ProductForm({ label }: ProductFormProps) {
  return (
    <Form<typeof addProduct>
      action={async function (formData) {
        "use server";
        return await addProduct(formData);
      }}
      initialState={{
        name: "",
        price: 0,
        tastingNotes: "",
        story: "",
        image: "",
      }}
    >
      {({ FormControl }) => (
        <div className="card-surface card card-filled border-surface-900">
          <h3 className="card-header mb-0 mt-0 rounded-t bg-surface-800 text-surface-contrast-800">
            {label}
          </h3>

          <div className="card-content grid grid-cols-2 gap-4 rounded-b-md bg-surface-500">
            <div className="grid grid-cols-subgrid">
              <FormControl
                control={FileInput}
                name="image"
                inputProps={{ accept: "image/*" }}
              />
            </div>
            <div className="grid grid-cols-subgrid gap-6">
              <FormControl
                control="input"
                label="Price"
                name="price"
                inputProps={{ inputMode: "numeric" }}
              />
              <FormControl
                control="input"
                name="tastingNotes"
                label="Tasting notes"
              />
              <FormControl
                control="textarea"
                name="story"
                label="Story"
                inputProps={{ className: "h-52 resize-none" }}
              />
            </div>

            <button className="btn-primary btn col-span-2">Submit</button>
          </div>
        </div>
      )}
    </Form>
  );
}
