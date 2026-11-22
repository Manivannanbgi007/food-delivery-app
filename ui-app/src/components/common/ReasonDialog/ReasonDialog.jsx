import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormDialog } from '@/components/common/FormDialog';
import { Textarea } from '@/components/common/Textarea';
import { REASON_MAX_LENGTH, reasonFormSchemaOf, showServerErrors } from '@/utils/validationUtils';

/**
 * Asks for the reason of an audited admin action and does it. The reason is checked in the browser first
 * (required, at most 500 characters); a refusal from the server (409, 422, network error) is shown in the dialog,
 * which stays open so the admin can read it and try again.
 */
export function ReasonDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = 'primary',
  reasonLabel = 'Reason',
  maxLength = REASON_MAX_LENGTH,
  placeholder = 'Kept in the audit log',
  requiredMessage,
  onSubmit,
  onClose,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reasonFormSchemaOf(maxLength, requiredMessage)),
    defaultValues: { reason: '' },
  });

  const close = () => {
    reset();
    onClose();
  };

  const submit = handleSubmit(async ({ reason }) => {
    try {
      await onSubmit(reason);
      close();
    } catch (error) {
      showServerErrors(error, setError, ['reason']);
    }
  });

  return (
    <FormDialog
      open={open}
      title={title}
      submitLabel={confirmLabel}
      tone={tone}
      isSubmitting={isSubmitting}
      serverError={errors.root?.server?.message}
      onSubmit={submit}
      onClose={close}
    >
      <div className="text-sm">{description}</div>
      <Textarea
        label={reasonLabel}
        placeholder={placeholder}
        maxLength={maxLength}
        error={errors.reason?.message}
        {...register('reason')}
      />
    </FormDialog>
  );
}
