/**
 * Skeleton loading state utility.
 * Shows animated placeholder elements while content is loading,
 * then hides them once data is ready.
 */

/**
 * Show skeleton loaders and hide real content.
 * @param {Object} options
 * @param {string} options.skeletonId - ID of the skeleton stats element
 * @param {string} options.tableSkeletonId - ID of the skeleton table wrapper
 * @param {string} options.contentId - ID of the real content wrapper
 */
export const showSkeleton = ({ skeletonId, tableSkeletonId, contentId }) => {
  const skeleton = document.getElementById(skeletonId);
  const tableSkeleton = document.getElementById(tableSkeletonId);
  const content = document.getElementById(contentId);

  if (skeleton) {
    skeleton.classList.remove("skeleton-hidden");
  }

  if (tableSkeleton) {
    tableSkeleton.classList.add("visible");
  }

  if (content) {
    content.classList.add("skeleton-hidden");
  }
};

/**
 * Hide skeleton loaders and show real content.
 * @param {Object} options
 * @param {string} options.skeletonId - ID of the skeleton stats element
 * @param {string} options.tableSkeletonId - ID of the skeleton table wrapper
 * @param {string} options.contentId - ID of the real content wrapper
 */
export const hideSkeleton = ({ skeletonId, tableSkeletonId, contentId }) => {
  const skeleton = document.getElementById(skeletonId);
  const tableSkeleton = document.getElementById(tableSkeletonId);
  const content = document.getElementById(contentId);

  if (skeleton) {
    skeleton.classList.add("skeleton-hidden");
  }

  if (tableSkeleton) {
    tableSkeleton.classList.remove("visible");
  }

  if (content) {
    content.classList.remove("skeleton-hidden");
  }
};

/**
 * Wrapper to execute an async fetch operation with skeleton loading states.
 * @param {Object} options
 * @param {string} options.skeletonId - ID of the skeleton stats element
 * @param {string} options.tableSkeletonId - ID of the skeleton table wrapper
 * @param {string} options.contentId - ID of the real content wrapper
 * @param {Function} options.fetchFn - Async function that fetches the data
 * @returns {Promise<any>} The result of the fetch operation
 */
export const withSkeletonLoading = async ({ skeletonId, tableSkeletonId, contentId, fetchFn }) => {
  showSkeleton({ skeletonId, tableSkeletonId, contentId });

  try {
    const result = await fetchFn();
    hideSkeleton({ skeletonId, tableSkeletonId, contentId });
    return result;
  } catch (error) {
    hideSkeleton({ skeletonId, tableSkeletonId, contentId });
    throw error;
  }
};
