/**
 * AnimatedContainer Component
 * FE-150: Entrance Animation System
 *
 * Wraps children with Framer Motion animations
 * Supports staggered children, fade effects, and hover interactions
 */

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  staggerContainer,
  staggerContainerFast,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  pageTransition,
  staggerGridItem,
  cardHover,
} from '@/lib/animations'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AnimationType =
  | 'stagger'
  | 'stagger-fast'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'page'
  | 'grid-item'

type HoverType = 'card' | 'button' | 'none'

interface AnimatedContainerProps {
  children: React.ReactNode
  /** Animation preset to use */
  animation?: AnimationType
  /** Custom animation variants (overrides preset) */
  customVariants?: Variants
  /** Hover animation type */
  hover?: HoverType
  /** Additional CSS classes */
  className?: string
  /** HTML element to render as */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'ul' | 'li'
  /** Whether to trigger animation on mount */
  animateOnMount?: boolean
  /** Animation delay in seconds */
  delay?: number
  /** Unique key for forcing re-animation */
  animationKey?: string | number
}

// ---------------------------------------------------------------------------
// Animation Preset Map
// ---------------------------------------------------------------------------

const animationPresets: Record<AnimationType, Variants> = {
  stagger: staggerContainer,
  'stagger-fast': staggerContainerFast,
  'fade-up': fadeInUp,
  'fade-down': fadeInDown,
  'fade-left': fadeInLeft,
  'fade-right': fadeInRight,
  scale: scaleIn,
  page: pageTransition,
  'grid-item': staggerGridItem,
}

// ---------------------------------------------------------------------------
// Hover Preset Map
// ---------------------------------------------------------------------------

const hoverPresets: Record<Exclude<HoverType, 'none'>, typeof cardHover> = {
  card: cardHover,
  button: {
    rest: { y: 0, boxShadow: 'none', transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] } },
    hover: {
      y: -2,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnimatedContainer({
  children,
  animation = 'stagger',
  customVariants,
  hover = 'none',
  className,
  as: Component = 'div',
  animateOnMount = true,
  delay = 0,
  animationKey,
}: AnimatedContainerProps) {
  const variants = customVariants ?? animationPresets[animation]

  // Create delayed variants if delay is specified
  const delayedVariants: Variants = delay
    ? {
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            ...(variants.visible as { transition?: object })?.transition,
            delayChildren:
              ((variants.visible as { transition?: { delayChildren?: number } })?.transition
                ?.delayChildren ?? 0.1) + delay,
          },
        },
      }
    : variants

  const MotionComponent = motion[Component]

  if (hover !== 'none') {
    return (
      <MotionComponent
        key={animationKey}
        initial={animateOnMount ? 'hidden' : false}
        animate="visible"
        variants={delayedVariants}
        className={cn(className)}
        whileHover="hover"
        whileTap="tap"
        {...hoverPresets[hover]}
      >
        {children}
      </MotionComponent>
    )
  }

  return (
    <MotionComponent
      key={animationKey}
      initial={animateOnMount ? 'hidden' : false}
      animate="visible"
      variants={delayedVariants}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  )
}

// ---------------------------------------------------------------------------
// AnimatedItem Component (for staggered children)
// ---------------------------------------------------------------------------

interface AnimatedItemProps {
  children: React.ReactNode
  animation?: AnimationType
  customVariants?: Variants
  hover?: HoverType
  className?: string
  as?: 'div' | 'li' | 'article' | 'section' | 'span'
}

export function AnimatedItem({
  children,
  animation = 'fade-up',
  customVariants,
  hover = 'none',
  className,
  as: Component = 'div',
}: AnimatedItemProps) {
  const variants = customVariants ?? animationPresets[animation]
  const MotionComponent = motion[Component]

  if (hover !== 'none') {
    return (
      <MotionComponent
        variants={variants}
        className={cn(className)}
        whileHover="hover"
        whileTap="tap"
        {...hoverPresets[hover]}
      >
        {children}
      </MotionComponent>
    )
  }

  return (
    <MotionComponent variants={variants} className={cn(className)}>
      {children}
    </MotionComponent>
  )
}

// ---------------------------------------------------------------------------
// AnimatedPage Component (for route transitions)
// ---------------------------------------------------------------------------

interface AnimatedPageProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// AnimatedCard Component (with built-in hover)
// ---------------------------------------------------------------------------

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function AnimatedCard({ children, className, onClick }: AnimatedCardProps) {
  return (
    <motion.div
      variants={staggerGridItem}
      className={cn(className)}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// AnimatedButton Component (with built-in hover)
// ---------------------------------------------------------------------------

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function AnimatedButton({
  children,
  className,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      className={cn(className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      {...props as HTMLMotionProps<'button'>}
    >
      {children}
    </motion.button>
  )
}
