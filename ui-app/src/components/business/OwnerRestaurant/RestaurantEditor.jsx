import { useState } from 'react';

import { toApiError } from '@/api/apiErrorHandler';
import { OperatingHoursEditor } from '@/components/business/OwnerRestaurant/OperatingHoursEditor';
import {
  RestaurantForm,
  RestaurantSection,
} from '@/components/business/OwnerRestaurant/RestaurantForm';
import { Card } from '@/components/common/Card';
import { hoursOf, hoursProblem, requestOf } from '@/utils/ownerRestaurantUtils';

const sameRows = (a, b) =>
  a.length === b.length &&
  a.every(
    (row, index) =>
      row.day === b[index].day &&
      row.open === b[index].open &&
      row.opensAt === b[index].opensAt &&
      row.closesAt === b[index].closesAt,
  );

/**
 * The restaurant form and its opening hours as one screen with one button: registering a restaurant and changing
 * one are the same thing to fill in. The hours are checked here (the form cannot be sent with hours that do not
 * add up); everything else by the form's own rules.
 */
export function RestaurantEditor({
  initialValues,
  initialHours,
  otherDocuments,
  submitLabel,
  editing = false,
  onSave,
}) {
  const [hours, setHours] = useState(initialHours);
  const [hoursError, setHoursError] = useState(null);
  const [serverError, setServerError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (values) => {
    setServerError(undefined);
    const problem = hoursProblem(hours);
    setHoursError(problem);
    if (problem) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(requestOf(values, hoursOf(hours), otherDocuments));
    } catch (error) {
      setServerError(toApiError(error).userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const discard = () => {
    setHours(initialHours);
    setHoursError(null);
    setServerError(undefined);
  };

  return (
    <RestaurantForm
      defaultValues={initialValues}
      submitLabel={submitLabel}
      isSubmitting={isSubmitting}
      serverError={serverError}
      extraDirty={!sameRows(hours, initialHours)}
      onDiscard={editing ? discard : undefined}
      onSubmit={submit}
    >
      <RestaurantSection id="restaurant-hours">
        <Card title="Opening hours" subtitle="Customers can order only while you are open">
          <OperatingHoursEditor
            rows={hours}
            onChange={(rows) => {
              setHours(rows);
              setHoursError(null);
            }}
            error={hoursError}
          />
        </Card>
      </RestaurantSection>
    </RestaurantForm>
  );
}
