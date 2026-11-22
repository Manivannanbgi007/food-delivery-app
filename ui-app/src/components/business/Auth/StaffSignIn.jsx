import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router';

import { toApiError } from '@/api/apiErrorHandler';
import { AuthShell } from '@/components/business/Auth/AuthShell';
import { DevAccounts } from '@/components/business/Auth/DevAccounts';
import { Alert } from '@/components/common/Alert';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { PasswordInput } from '@/components/common/PasswordInput';
import { useToast } from '@/context/ToastContext';
import { ERROR_MESSAGES } from '@/utils/errorMessages';
import { signInFormSchema } from '@/utils/validationUtils';

/** The message for a refused sign-in: wrong password, deactivated account, or the service's own. */
function signInProblem(error) {
  const apiError = toApiError(error);
  if (apiError.kind === 'unauthorized') {
    return ERROR_MESSAGES.SIGN_IN_FAILED;
  }
  // The "not an owner / admin account" refusal has no HTTP status: it is shown as it is
  return apiError.status === 403 ? ERROR_MESSAGES.ACCOUNT_DEACTIVATED : apiError.userMessage;
}

/**
 * The sign-in of the areas for the platform's own people: restaurant owners and admins. A standalone page (no
 * storefront header around it): the form next to what the area is for. Signing in starts the area's session: an
 * access token in memory and a refresh cookie (hooks/api/authHooks.js).
 */
export function StaffSignIn({
  audience,
  title,
  subtitle,
  emailPlaceholder,
  signIn,
  isSignedIn,
  home,
  returnTo,
  alternative,
  footer,
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async (form) => {
    try {
      const person = await signIn.mutateAsync(form);
      showToast(`Welcome back, ${person.fullName.split(' ')[0]}!`);
      void navigate(returnTo ?? home, { replace: true });
    } catch (error) {
      setError('root.server', { message: signInProblem(error) });
    }
  });

  /** A test account of the panel under the form (npm run dev only): filled in and sent like a typed one */
  const signInAs = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
    void submit();
  };

  if (isSignedIn && !signIn.isPending) {
    // Signed in already (another tab, the back button): straight on
    return <Navigate to={returnTo ?? home} replace />;
  }

  return (
    <AuthShell
      audience={audience}
      eyebrow="Welcome back"
      title={title}
      subtitle={subtitle}
      alternative={alternative}
      footer={footer}
    >
      <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          leftIcon={<Mail aria-hidden="true" className="size-4.5" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          leftIcon={<Lock aria-hidden="true" className="size-4.5" />}
          error={errors.password?.message}
          {...register('password')}
        />
        {errors.root?.server && <Alert tone="error">{errors.root.server.message}</Alert>}
        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-1 w-full">
          Sign in
        </Button>
      </form>
      {DevAccounts && (
        <Suspense fallback={null}>
          <DevAccounts audience={audience} onUse={signInAs} isBusy={isSubmitting} />
        </Suspense>
      )}
    </AuthShell>
  );
}
