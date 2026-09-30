import { Seccion } from "@shared/enums/seccion";

export interface NavSubItem {
  nombre       : string;
  routerLink   : string[];
  seccion     ?: Seccion;
  accion      ?: 'ver' | 'crear';
  divisorAntes?: boolean;
}

export interface NavLink {
  nombre     : string;
  routerLink : string[];
  seccion   ?: Seccion;
}

export interface NavLinkItem {
  tipo       : 'link';
  nombre     : string;
  routerLink : string[];
  seccion   ?: Seccion;
}

export interface NavDropdownItem {
  tipo    : 'dropdown';
  nombre  : string;
  seccion?: Seccion;
  items   : NavSubItem[];
}

export interface NavMultiLinkItem {
  tipo    : 'multi';
  seccion?: Seccion;
  links   : NavLink[];
}

export type NavItem = NavLinkItem | NavDropdownItem | NavMultiLinkItem;

export interface NavExternalLinkItem {
  id    : number;
  nombre: string;
  url   : string;
}
