import type { ComponentConfig } from "@measured/puck";

export type SiteHeaderProps = {
  logoUrl: string;
  links: {
    label: string;
    url: string;
  }[];
};

export const SiteHeader: ComponentConfig<SiteHeaderProps> = {
  fields: {
    logoUrl: {
      type: "text",
      label: "Logo URL",
    },
    links: {
      type: "array",
      arrayFields: {
        label: { type: "text" },
        url: { type: "text" },
      },
      defaultItemProps: {
        label: "Link",
        url: "#",
      },
    },
  },
  defaultProps: {
    logoUrl: "https://placehold.co/120x50/31343C/FFFFFF?text=Logo",
    links: [
      { label: "Home", url: "/" },
      { label: "About", url: "/about" },
      { label: "Menu", url: "/menu" },
      { label: "Contact", url: "/contact" },
    ],
  },
  render: ({ logoUrl, links }) => {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/">
                <img className="h-10" src={logoUrl} alt="Company Logo" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:space-x-8">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className="text-gray-500 hover:text-gray-900 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button (non-interactive in editor) */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger Icon */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  },
};
