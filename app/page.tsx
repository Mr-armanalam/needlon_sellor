import HeroSection from '@/modules/home/hero-section/section/HeroSection'
import ProblemSolution from '@/modules/home/problem-solution/section/ProblemSolution'

const page = () => {
  return (
    <div className='h-[200vh]'>
      <HeroSection />
      <ProblemSolution />
    </div>
  )
}

export default page