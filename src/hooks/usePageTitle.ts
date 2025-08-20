import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTitle } from '@/features/layout/layoutSlice';
import { sidebarData } from '@/helpers/sidebarItems';

// Function to find the appropriate page title based on current path
const getPageTitleFromPath = (pathname: string): string => {
  // Handle root path
  if (pathname === '/' || pathname === '/home') {
    return 'Home';
  }

  // Create a flattened map of all routes to labels
  const routeMap: { [key: string]: string } = {};

  const flattenSidebarData = (items: typeof sidebarData) => {
    items.forEach(item => {
      if (item.isSection) return; // Skip section headers

      if (item.link) {
        // Normalize the link (remove leading slash for consistency)
        const normalizedLink = item.link.startsWith('/') ? item.link : `/${item.link}`;
        routeMap[normalizedLink] = item.label;
      }

      // Process children
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          if (child.link) {
            // For children, use child label unless it's generic
            const childTitle = child.label;

            // For some child routes, we might want to show parent context
            if (child.link.includes('/')) {
              const normalizedChildLink = child.link.startsWith('/')
                ? child.link
                : `/${child.link}`;
              routeMap[normalizedChildLink] = childTitle;
            } else {
              // Handle relative child links (like 'fleet-view' under '/fleet')
              const fullChildPath = `${item.link}/${child.link}`;
              routeMap[fullChildPath] = childTitle;
            }
          }
        });
      }
    });
  };

  flattenSidebarData(sidebarData);

  // Try exact match first
  if (routeMap[pathname]) {
    return routeMap[pathname];
  }

  // Try to find partial matches for nested routes
  const pathSegments = pathname.split('/').filter(Boolean);

  // Check for partial matches by building path segments
  for (let i = pathSegments.length; i > 0; i--) {
    const partialPath = '/' + pathSegments.slice(0, i).join('/');
    if (routeMap[partialPath]) {
      return routeMap[partialPath];
    }
  }

  // Special cases for known routes not in sidebar
  if (pathname.includes('/lease-agreement-overview')) {
    return 'Lease Agreement Overview';
  }
  if (pathname.includes('/rent-agreement-overview')) {
    return 'Rent Agreement Overview';
  }
  if (pathname.includes('/user-management')) {
    return 'User Management';
  }

  // Default fallback - capitalize first segment
  const firstSegment = pathSegments[0];
  if (firstSegment) {
    return firstSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return 'Tenleasing Customer Portal';
};

export const usePageTitle = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const pageTitle = getPageTitleFromPath(location.pathname);

    // Update Redux state
    dispatch(setTitle(pageTitle));

    // Update document title
    const fullTitle =
      pageTitle === 'Home'
        ? 'Tenleasing Customer Portal'
        : `Tenleasing Customer Portal | ${pageTitle}`;

    document.title = fullTitle;
  }, [location.pathname, dispatch]);
};
