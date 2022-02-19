/**
 * 
 * @param name 获取cookie
 * @returns 
 */
 export function getCookie(name: string): string | undefined {
    if ((process as any).browser) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts[1].split(';').shift();
      }
    }
    return undefined;
}