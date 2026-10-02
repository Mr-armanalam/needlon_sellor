import ProblemSolutionHeading from '../components/Heading';
import HeaderIconTitleIndicator from '../components/HeaderIconTitleIndicator';
import Differentiator from '../components/Differentiator';
import { transformationData } from '../../data/transformationData';


export default function ProblemSolutionSection() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto bg-slate-50/50 rounded-3xl my-12">
      <ProblemSolutionHeading />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {transformationData.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id} 
              className="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0,05)] hover:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group"
            >
              <HeaderIconTitleIndicator Icon={Icon}/>

             <Differentiator item={item} />
            </div>
          );
        })}
      </div>
    </section>
  );
}