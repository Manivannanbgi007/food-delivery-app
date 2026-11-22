import { useId } from 'react';

import { Alert } from '@/components/common/Alert';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

/**
 * The frame of every form in a dialog: title, fields, the server's refusal, and Cancel / submit buttons.
 * The form itself (useForm, the fields, the rules) stays in the dialog that uses this, e.g. ReasonDialog.
 */
export function FormDialog({
  open,
  title,
  submitLabel,
  tone = 'primary',
  isSubmitting,
  serverError,
  onSubmit,
  onClose,
  size,
  children,
}) {
  const formId = useId();
  return (
    <Modal
      open={open}
      onClose={isSubmitting ? () => undefined : onClose}
      title={title}
      size={size}
      tone={tone}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant={tone} isLoading={isSubmitting}>
            {submitLabel}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}
        className="flex flex-col gap-4"
      >
        {serverError && <Alert tone="error">{serverError}</Alert>}
        {children}
      </form>
    </Modal>
  );
}
