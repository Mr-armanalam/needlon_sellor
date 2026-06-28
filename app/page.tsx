import HeroSection from '@/modules/home/hero-section/section/HeroSection'
import HowItWorksSection from '@/modules/home/how-it-work/section/HowItWorks'
import ProblemSolution from '@/modules/home/problem-solution/section/ProblemSolution'

const page = () => {
  return (
    <div className=''>
      <HeroSection />
      <ProblemSolution />
      <HowItWorksSection/>
    </div>
  )
}

export default page