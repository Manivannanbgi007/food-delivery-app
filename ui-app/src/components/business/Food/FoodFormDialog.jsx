import {
  FoodBasicsFields,
  FoodImageField,
  FoodTextFields,
  FoodTypeField,
} from '@/components/business/Food/FoodFormFields';
import {
  foodFormToCreateRequest,
  foodFormToUpdateRequest,
  useFoodForm,
} from '@/components/business/Food/useFoodForm';
import { FormDialog } from '@/components/common/FormDialog';

/**
 * "New Menu" / "Edit": one form for creating and editing a menu item. Server refusals stay in the dialog. The
 * Foods page creates on a page of its own (FoodNewPage), with the same fields and rules (useFoodForm).
 */
export function FoodFormDialog({
  open,
  item,
  restaurants,
  restaurantName,
  categories,
  preset,
  onCreate,
  onUpdate,
  onClose,
}) {
  const { form, categoryOptions, submit } = useFoodForm({
    item,
    preset,
    categories,
    onSubmit: async (values) => {
      if (item) {
        await onUpdate(item.id, foodFormToUpdateRequest(values, item.version));
      } else if (onCreate) {
        await onCreate(foodFormToCreateRequest(values));
      } else {
        throw new Error('FoodFormDialog needs onCreate to create a menu item');
      }
      onClose();
    },
  });
  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <FormDialog
      open={open}
      title={item ? `Edit "${item.name}"` : 'New Menu'}
      submitLabel={item ? 'Save changes' : 'Create menu item'}
      isSubmitting={isSubmitting}
      serverError={errors.root?.server?.message}
      onSubmit={submit}
      onClose={onClose}
      size="lg"
    >
      <FoodBasicsFields
        form={form}
        item={item}
        restaurants={restaurants}
        restaurantName={restaurantName}
        categoryOptions={categoryOptions}
      />
      <FoodTextFields form={form} />
      <FoodTypeField form={form} />
      <FoodImageField form={form} />
    </FormDialog>
  );
}
