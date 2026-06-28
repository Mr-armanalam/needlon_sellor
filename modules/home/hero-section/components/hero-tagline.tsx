import { Button } from "@/components/ui/button";

const HeroTagline = () => {
  return (
    <div className="flex flex-col w-3/5 pl-14 justify-center items-start">
      <h1 className="text-5xl">
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

      <Button variant={"destructive"} className={"rounded-2xl ml-2 mt-4"}>
        Start Selling Free
      </Button>
    </div>
  );
};

export default HeroTagline;
