import Link from "next/link";

const navItem = [
  {
    name: "Features",
    url: "/features",
  },
  {
    name: "How It Works",
    url: "/how-it-works",
  },
  {
    name: "Pricing",
    url: "/pricing",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

const NavLinks = () => {
  return (
    <div className="flex gap-x-10">
      {navItem.map((item, index) => (
        <Link key={index} href={item.url}>
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
