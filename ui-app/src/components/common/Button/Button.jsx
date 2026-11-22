import { buttonStyles } from '@/components/common/Button/buttonStyles';
import { Spinner } from '@/components/common/Loader';

/** A button (looks: buttonStyles). Its icon grows a little on hover; while loading a spinner takes its place. */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonStyles(variant, size, className)}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" label="Please wait" />
      ) : (
        leftIcon && (
          <span className="inline-flex transition-transform duration-200 group-hover/button:scale-110">
            {leftIcon}
          </span>
        )
      )}
      {children}
    </button>
  );
}
