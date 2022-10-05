export function changeRouter(pathname: string) {
  return window.history.pushState(null, "", pathname);
}
