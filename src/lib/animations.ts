/**
 * Animation Configuration for OptiMax
 * FE-150: Entrance Animation System
 *
 * Uses Framer Motion for declarative animations
 * Provides consistent animation variants across the application
 */

import type { Variants, Transition } from 'framer-motion'

// ---------------------------------------------------------------------------
// Base Easing Functions
// ---------------------------------------------------------------------------

export const easing = {
  /** Standard ease - smooth acceleration and deceleration */
  standard: [0.25, 0.1, 0.25, 1] as const,
  /** Enter ease - quick start, smooth end */
  enter: [0, 0, 0.2, 1] as const,
  /** Exit ease - smooth start, quick end */
  exit: [0.4, 0, 1, 1] as const,
  /** Bounce effect for playful interactions */
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  /** Spring-like easing */
  spring: { type: 'spring', stiffness: 300, damping: 30 } as const,
} as const

// ---------------------------------------------------------------------------
// Base Transitions
// ---------------------------------------------------------------------------

export const transitions: Record<string, Transition> = {
  fast: { duration: 0.15, ease: easing.standard },
  default: { duration: 0.3, ease: easing.standard },
  slow: { duration: 0.5, ease: easing.standard },
  stagger: { staggerChildren: 0.1, delayChildren: 0.1 },
  staggerFast: { staggerChildren: 0.05, delayChildren: 0.05 },
  spring: { type: 'spring', stiffness: 400, damping: 30 },
}

// ---------------------------------------------------------------------------
// Container Variants (Stagger Children)
// ---------------------------------------------------------------------------

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.stagger,
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.staggerFast,
  },
}

// ---------------------------------------------------------------------------
// Fade Animations
// ---------------------------------------------------------------------------

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.default,
  },
}

export const fadeOut: Variants = {
  visible: { opacity: 1 },
  hidden: {
    opacity: 0,
    transition: transitions.default,
  },
}

// ---------------------------------------------------------------------------
// Fade + Direction Animations (Most Common)
// ---------------------------------------------------------------------------

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.standard,
    },
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.standard,
    },
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easing.standard,
    },
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easing.standard,
    },
  },
}

// ---------------------------------------------------------------------------
// Scale Animations
// ---------------------------------------------------------------------------

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easing.standard,
    },
  },
}

export const scaleOut: Variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: easing.exit,
    },
  },
}

// ---------------------------------------------------------------------------
// Card Hover Animations (Micro-interactions)
// ---------------------------------------------------------------------------

export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2, ease: easing.standard },
  },
  hover: {
    y: -2,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2, ease: easing.standard },
  },
}

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
}

// ---------------------------------------------------------------------------
// Button Hover Animations
// ---------------------------------------------------------------------------

export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: easing.standard },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

// ---------------------------------------------------------------------------
// Page Transition Animations
// ---------------------------------------------------------------------------

export const pageTransition: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easing.enter,
    },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
      ease: easing.exit,
    },
  },
}

export const pageTransitionFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easing.standard,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: easing.exit,
    },
  },
}

// ---------------------------------------------------------------------------
// List Item Animations (for tables/lists)
// ---------------------------------------------------------------------------

export const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easing.enter,
    },
  },
}

// ---------------------------------------------------------------------------
// Modal/Dialog Animations
// ---------------------------------------------------------------------------

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easing.enter,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: easing.exit,
    },
  },
}

// ---------------------------------------------------------------------------
// Drawer/Sheet Animations
// ---------------------------------------------------------------------------

export const drawerSlideRight: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: easing.enter,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.2,
      ease: easing.exit,
    },
  },
}

export const drawerSlideLeft: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: easing.enter,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      duration: 0.2,
      ease: easing.exit,
    },
  },
}

// ---------------------------------------------------------------------------
// Stagger Grid Item Animations (for KPI cards, etc.)
// ---------------------------------------------------------------------------

export const staggerGridItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.standard,
    },
  },
}

// ---------------------------------------------------------------------------
// Loading Skeleton Animation
// ---------------------------------------------------------------------------

export const skeletonPulse: Variants = {
  hidden: { opacity: 0.5 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
}

// ---------------------------------------------------------------------------
// Utility: Create custom stagger with delay
// ---------------------------------------------------------------------------

export function createStaggerContainer(
  staggerDelay: number = 0.1,
  delayChildren: number = 0.1
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Utility: Create fade with custom distance
// ---------------------------------------------------------------------------

export function createFadeInUp(distance: number = 20): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easing.standard,
      },
    },
  }
}
