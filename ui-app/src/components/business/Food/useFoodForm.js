import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { toApiError } from '@/api/apiErrorHandler';
import { ERROR_MESSAGES } from '@/utils/errorMessages';
import { foodFormSchema, showServerErrors } from '@/utils/validationUtils';

const FIELDS = [
  'restaurantId',
  'categoryId',
  'name',
  'description',
  'price',
  'foodType',
  'imageUrl',
  'ingredients',
  'nutritionInfo',
];

/** What both a new item and a changed one send (empty optional texts become null). */
function bodyOf(values) {
  return {
    name: values.name,
    description: values.description === '' ? null : values.description,
    price: Number(values.price),
    categoryId: Number(values.categoryId),
    foodType: values.foodType,
    imageUrl: values.imageUrl === '' ? null : values.imageUrl,
    ingredients: values.ingredients === '' ? null : values.ingredients,
    nutritionInfo: values.nutritionInfo === '' ? null : values.nutritionInfo,
  };
}

/** The form as POST /menu-items wants it. */
export function foodFormToCreateRequest(values) {
  return { ...bodyOf(values), restaurantId: Number(values.restaurantId) };
}

/** The form as PUT /menu-items/{id} wants it (with the version the form started from). */
export function foodFormToUpdateRequest(values, version) {
  return { ...bodyOf(values), version };
}

/**
 * The menu item form, shared by the "New Menu" / "Edit" dialog and the "Add New Food Item" page: its starting values,
 * its rules, the categories to choose from, and what a refusal of the server shows (on the field it is about, and
 * above the fields).
 */
export function useFoodForm({ item, preset, categories, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(foodFormSchema),
    defaultValues: {
      restaurantId: String((item ?? preset)?.restaurantId ?? ''),
      categoryId: String((item ?? preset)?.categoryId ?? ''),
      name: item?.name ?? '',
      description: item?.description ?? '',
      price: item ? item.price.toFixed(2) : '',
      foodType: item?.foodType,
      imageUrl: item?.imageUrl ?? '',
      ingredients: item?.ingredients ?? '',
      nutritionInfo: item?.nutritionInfo ?? '',
    },
  });
  const { setError } = form;

  // Active categories, plus the one the item has now (it may have been deactivated since)
  const categoryOptions = categories
    .filter(
      (category) => category.status === 'ACTIVE' || category.id === (item ?? preset)?.categoryId,
    )
    .map((category) => ({ value: String(category.id), label: category.name }));

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      showServerErrors(error, setError, FIELDS);
      const apiError = toApiError(error);
      // A 409 on an edit is a stale version unless the server says the name is taken
      if (
        item &&
        apiError.status === 409 &&
        !/already|exists|duplicate|taken/i.test(apiError.userMessage)
      ) {
        setError('root.server', { message: ERROR_MESSAGES.FOOD_VERSION_CONFLICT });
      }
    }
  });

  return { form, categoryOptions, submit };
}
