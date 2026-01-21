export const API_VERSIONS = {
  CURRENT: 'v1',
  SUPPORTED: ['v1'],
  DEPRECATED: [] as string[],
  
  getPrefix: (version: string = 'v1') => `/api/${version}`,
  
  isSupported: (version: string) => API_VERSIONS.SUPPORTED.includes(version),
  
  getLatest: () => API_VERSIONS.CURRENT
};
