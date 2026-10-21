import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  formatStat,
  type PlatformStats,
} from "../../services/platform-stats.service";

const HeroTagline = ({ stats }: { stats: PlatformStats }) => {
  return (
    <div className="flex flex-col w-3/5 pl-14 justify-center items-start">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        For local tailors, boutiques &amp; clothing sellers
      </span>
      <h1 className="text-5xl mt-6">
        <span className="text-6xl">Turn Your Clothing</span>{" "}
        <span className="pl-2">Business Into Income</span>
      </h1>
      <p className="pl-2 mt-8 text-xl">
        Sell clothes in your locality without delivery charges.
      </p>
      <ul className="pl-2 text-stone-600">
        <li>✔ Sell from home</li>
        <li>✔ Keep 100% of your earnings</li>
        <li> ✔ Free for first 40 days</li>
      </ul>

      <Link
        href="/signup"
        className={buttonVariants({
          variant: "destructive",
          className: "rounded-2xl ml-2 mt-4",
        })}
      >
        Start Selling Free
      </Link>

      {/* Live marketplace numbers (server-rendered from the database). */}
      <dl className="ml-2 mt-10 flex items-start gap-8 border-t border-stone-200 pt-6">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Sellers onboard
          </dt>
          <dd className="text-2xl font-bold text-stone-900">
            {formatStat(stats.sellers)}+
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Products listed
          </dt>
          <dd className="text-2xl font-bold text-stone-900">
            {formatStat(stats.products)}+
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Orders fulfilled
          </dt>
          <dd className="text-2xl font-bold text-stone-900">
            {formatStat(stats.orders)}+
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Bespoke orders
          </dt>
          <dd className="text-2xl font-bold text-stone-900">
            {formatStat(stats.bespokeOrders)}+
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default HeroTagline;
