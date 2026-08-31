export interface ImpersonationState {
  /** Email of the demo account being viewed. */
  email: string;
  /** Human label, e.g. "Property Manager". */
  label: string;
  /** Route (path + query) the admin was on, restored after exiting. */
  returnPath: string;
}

const KEY = "estatesrw.impersonation";

const notify = () => window.dispatchEvent(new Event("estatesrw:impersonation"));

export const readImpersonation = (): ImpersonationState | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ImpersonationState;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
};

export const setImpersonation = (state: ImpersonationState) => {
  localStorage.setItem(KEY, JSON.stringify(state));
  notify();
};

export const clearImpersonation = () => {
  localStorage.removeItem(KEY);
  notify();
};

/** Routes an impersonated user can meaningfully land on, keeping filters/query intact. */
export const preservedRoute = (pathname: string, search: string) => {
  const keep = pathname.startsWith("/manage") || pathname.startsWith("/dashboard");
  return keep ? `${pathname}${search || ""}` : "/dashboard";
};
