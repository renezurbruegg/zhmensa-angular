export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  matIcon?: boolean;
  pngIcon?: boolean;
  route?: string;
  children?: NavItem[];
  loginRequired:boolean;
}
