/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type infer as Infer,
  type ZodBigInt,
  type ZodBoolean,
  type ZodDate,
  type ZodEffects,
  type ZodNull,
  type ZodNumber,
  type ZodObject,
  type ZodString,
  type ZodType,
  type ZodTypeAny,
  type ZodUndefined,
} from "zod";

import {
  isZodArray,
  isZodBigInt,
  isZodBoolean,
  isZodDate,
  isZodEffects,
  isZodNull,
  isZodNumber,
  isZodObject,
  isZodString,
  isZodUndefined,
} from "./helpers";

type ZodPrimitive =
  | ZodString
  | ZodNumber
  | ZodBoolean
  | ZodDate
  | ZodBigInt
  | ZodUndefined
  | ZodNull;

export type ZodSchema = ZodObject<any> | ZodEffects<any>;

export function createFormParser<TType extends ZodSchema>(schema: TType) {
  const parser = (formData: FormData) => {
    const data = formDataToObject(formData, schema);

    return schema.safeParseAsync(data);
  };

  return parser;
}

function formDataToObject(
  formData: FormData,
  schema: ZodSchema,
  namePrefix = "",
) {
  const shape = getSchemaShape(schema);
  const obj: Record<string, any> = {};
  for (const [property, propertySchema] of Object.entries(shape)) {
    const name = `${namePrefix ? `${namePrefix}.` : ""}${property}`;

    if (isZodArray(propertySchema)) {
      const { element: elementSchema } = propertySchema;

      if (isPrimitive(elementSchema)) {
        obj[property] = formData
          .getAll(name)
          .map((value) => transformPrimitive(value, elementSchema));
      } else if (isZodObject(elementSchema)) {
        obj[property] = indexBased_formDataForArrayOfObjects(
          formData,
          elementSchema,
          name,
        );
      }
    } else if (isZodObject(propertySchema)) {
      obj[property] = formDataToObject(formData, propertySchema, name);
    } else {
      obj[property] = transformPrimitive(formData.get(name)!, propertySchema);
    }
  }

  return obj;
}

function getSchemaShape(schema: ZodSchema): Record<string, ZodTypeAny> {
  if (isZodEffects(schema)) {
    return getSchemaShape(schema._def.schema);
  }

  return schema.shape as Record<string, ZodTypeAny>;
}

function transformPrimitive(value: FormDataEntryValue, schema: ZodType) {
  const valueType = typeof value;
  if (value !== null && valueType === "object") {
    throw new Error(
      `Form value types of non strings are not yet supported. Sorry :(`,
    );
  }

  return isZodNumber(schema)
    ? parseFloat(value as string) || null
    : isZodBoolean(schema)
      ? value === "true"
      : isZodDate(schema)
        ? new Date(value as string)
        : isZodBigInt(schema)
          ? BigInt(value as string)
          : isZodUndefined(schema) && (value === "undefined" || value === "")
            ? undefined
            : isZodNull(schema) && (value === null || value === "")
              ? null
              : value;
}

function isPrimitive(schema: ZodType): schema is ZodPrimitive {
  return (
    isZodString(schema) ||
    isZodNumber(schema) ||
    isZodBoolean(schema) ||
    isZodDate(schema) ||
    isZodBigInt(schema) ||
    isZodUndefined(schema) ||
    isZodNull(schema)
  );
}

function indexBased_formDataForArrayOfObjects(
  formData: FormData,
  elementSchema: ZodObject<any>,
  name: string,
) {
  const obj = [];
  const shape = getSchemaShape(elementSchema);
  let index = 0;
  while (
    Object.keys(shape).some((property) =>
      formData.has(`${name}.${index}.${property}`),
    )
  ) {
    obj.push(formDataToObject(formData, elementSchema, `${name}.${index}`));
    index++;
  }

  return obj;
}
