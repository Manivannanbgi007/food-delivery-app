import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Phone, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router';

import { toApiError } from '@/api/apiErrorHandler';
import { AuthShell } from '@/components/business/Auth/AuthShell';
import { PasswordStrengthMeter } from '@/components/business/Auth/PasswordStrengthMeter';
import { Alert } from '@/components/common/Alert';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { PasswordInput } from '@/components/common/PasswordInput';
import { useToast } from '@/context/ToastContext';
import { showServerErrors } from '@/utils/validationUtils';

/**
 * The sign-up of the areas for the platform's own people (restaurant owners, delivery partners): an account of the
 * area's role, signed in straight away, then on to what the area needs first. "Already registered" refusals are
 * shown next to the field they are about.
 */
export function StaffRegister({
  audience,
  title,
  subtitle,
  schema,
  phoneHint,
  submitLabel,
  registration,
  isSignedIn,
  home,
  next,
  welcome,
  signInYourself,
  signInRoute,
  signInPrompt,
  footer,
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  // Set once this page creates the account: it then leads on to `next` itself (not `home`, as for someone who opens
  // the page while already signed in)
  const [submitted, setSubmitted] = useState(false);
  const alreadySignedIn = isSignedIn && !registration.isPending && !submitted;
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  // Typing a password moves the strength meter
  const typedPassword = useWatch({ control, name: 'password' });

  const submit = handleSubmit(async ({ fullName, email, phone, password }) => {
    setSubmitted(true);
    try {
      const person = await registration.mutateAsync({
        fullName,
        email,
        password,
        phone: phone || undefined,
      });
      if (person) {
        showToast(welcome(person.fullName.split(' ')[0]));
        void navigate(next, { replace: true });
      } else {
        showToast(signInYourself, 'info');
        void navigate(signInRoute, { replace: true });
      }
    } catch (error) {
      setSubmitted(false);
      // "Already registered" belongs next to the field it is about
      const message = toApiError(error).userMessage;
      if (message.startsWith('Email is already registered')) {
        setError('email', { message: 'This email already has an account: sign in instead.' });
      } else if (message.startsWith('Phone number is already registered')) {
        setError('phone', { message: 'This phone number already has an account.' });
      } else {
        showServerErrors(error, setError, ['fullName', 'email', 'phone', 'password']);
      }
    }
  });

  if (alreadySignedIn) {
    return <Navigate to={home} replace />;
  }

  return (
    <AuthShell
      audience={audience}
      eyebrow="Get started"
      title={title}
      subtitle={subtitle}
      alternative={{ prompt: signInPrompt, label: 'Sign in', to: signInRoute }}
      footer={footer}
    >
      <form onSubmit={(event) => void submit(event)} noValidate className="flex flex-col gap-4">
        <Input
          label="Full name"
          autoComplete="name"
          maxLength={100}
          leftIcon={<UserRound aria-hidden="true" className="size-4.5" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={255}
          placeholder="you@example.com"
          leftIcon={<Mail aria-hidden="true" className="size-4.5" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          placeholder="+919800000000"
          leftIcon={<Phone aria-hidden="true" className="size-4.5" />}
          error={errors.phone?.message}
          hint={phoneHint}
          {...register('phone')}
        />
        <div className="flex flex-col gap-2">
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            maxLength={72}
            leftIcon={<Lock aria-hidden="true" className="size-4.5" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrengthMeter password={typedPassword} />
        </div>
        <PasswordInput
          label="Password again"
          autoComplete="new-password"
          maxLength={72}
          leftIcon={<Lock aria-hidden="true" className="size-4.5" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {errors.root?.server && <Alert tone="error">{errors.root.server.message}</Alert>}
        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-1 w-full">
          {submitLabel}
        </Button>
      </form>
    </AuthShell>
  );
}
