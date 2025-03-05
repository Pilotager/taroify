import NavbarComponent, { type NavbarProps } from "./navbar"
import NavBarLeft from "./navbar-left"
import NavBarRight from "./navbar-right"
import NavBarTitle from "./navbar-title"

export type { NavbarThemeVars } from "./navbar.shared"

interface NavbarInterface {
  (props: NavbarProps): JSX.Element

  NavLeft: typeof NavBarLeft
  NavRight: typeof NavBarRight
  Title: typeof NavBarTitle
}

const Navbar = NavbarComponent as NavbarInterface

Navbar.NavLeft = NavBarLeft
Navbar.NavRight = NavBarRight
Navbar.Title = NavBarTitle

export default Navbar
