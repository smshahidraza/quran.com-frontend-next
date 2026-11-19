import { useState, useEffect } from 'react';

import { isMobile, isSmallMobile } from '@/utils/responsive';

export enum MobileSizeVariant {
  SMALL = 'small',
  LARGE = 'large',
}

/**
 * A hook that safely detects if the current viewport is mobile-sized.
 * Handles SSR by returning false on server and updating on client after hydration.
 * Also listens for window resize events to update the state.
 *
 * @returns {boolean} True if the viewport is mobile-sized, false otherwise
 */
const useIsMobile = (variant?: MobileSizeVariant): boolean => {
  // Always start as false so SSR HTML and the first client render match.
  // Update after mount (and on resize) so we never hydrate with a different tree.
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobileView(variant === MobileSizeVariant.SMALL ? isSmallMobile() : isMobile());
    };

    update();
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [variant]);

  return isMobileView;
};

export default useIsMobile;
