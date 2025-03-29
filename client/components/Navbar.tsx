import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="hidden md:flex gap-8">
    <Link
      href="#features"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      Features
    </Link>
    <Link
      href="#testimonials"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      Testimonials
    </Link>
    <Link
      href="#pricing"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      Pricing
    </Link>
    <Link
      href="#faq"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      FAQ
    </Link>
  </nav>
  )
}
