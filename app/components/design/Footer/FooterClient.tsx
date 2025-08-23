import type { FooterProps } from "./Footer";
import { Facebook, Instagram, Twitter } from "lucide-react";

// A helper component to render the correct social icon based on the platform prop
const SocialIcon = ({ platform }: { platform: "Facebook" | "Instagram" | "Twitter" }) => {
  switch (platform) {
    case "Facebook":
      return <Facebook size={24} />;
    case "Instagram":
      return <Instagram size={24} />;
    case "Twitter":
      return <Twitter size={24} />;
    default:
      return null;
  }
};


export const FooterClient = ({ logoText, tagline, linkColumns, socialLinks, copyrightText }: FooterProps) => {
    return (
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-bold mb-4">{logoText}</h3>
              <p className="text-gray-400">{tagline}</p>
            </div>
            {linkColumns.map((column, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.url} className="text-gray-400 hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, k) => (
                  <a key={k} href={social.url} className="text-gray-400 hover:text-white">
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
            <p>{copyrightText}</p>
          </div>
        </div>
      </footer>
    );
}