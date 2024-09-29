import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FileInput, Form, SubmitButton } from "~/lib/client/forms";
import { addProduct } from "~/server/products/actions";

type ProductFormProps = {
  label: React.ReactNode;
};

export function ProductForm({ label }: ProductFormProps) {
  return (
    <Form<typeof addProduct>
      action={async function (formData) {
        "use server";
        const result = await addProduct(formData);
        console.log(result);
        if (result.type === "ok") {
          revalidatePath("/products");
          redirect("/products");
        }

        return result;
      }}
      initialState={{
        name: "",
        price: 0,
        tastingNotes: "",
        story: "",
        image: "",
        sizeOunces: 10,
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
                inputProps={{ uploader: "imageUploader" }}
              />
            </div>
            <div className="grid grid-cols-subgrid gap-6">
              <FormControl control="input" label="Name" name="name" />

              <div className="flex gap-2">
                <FormControl
                  control="input"
                  label="Price"
                  name="price"
                  controlPrefix="$"
                  inputProps={{ inputMode: "numeric" }}
                />
                <FormControl
                  control="input"
                  label="Size"
                  name="sizeOunces"
                  controlSuffix="oz"
                  inputProps={{ inputMode: "numeric" }}
                />
              </div>
              <FormControl
                control="input"
                name="tastingNotes"
                label="Tasting notes"
              />
              <FormControl
                control="textarea"
                name="story"
                label="Story"
                inputProps={{
                  className:
                    "h-52 resize-none transition-property-[border-color]",
                }}
              />
            </div>

            <SubmitButton className="btn-primary btn col-span-2">
              Submit
            </SubmitButton>
          </div>
        </div>
      )}
    </Form>
  );
}
