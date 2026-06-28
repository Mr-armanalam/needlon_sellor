import EarningsCalculator from '@/modules/home/earning-calculator/section/EarnCalc'
import HeroSection from '@/modules/home/hero-section/section/HeroSection'
import HowItWorksSection from '@/modules/home/how-it-work/section/HowItWorks'
import PricingSection from '@/modules/home/pricing/section/PricingSection'
import ProblemSolution from '@/modules/home/problem-solution/section/ProblemSolution'
import SuccessStories from '@/modules/home/success-story/section/SuccessStory'
import WhySellersLoveUs from '@/modules/home/why-seller-love-us/section/WhyUs'

const page = () => {
  return (
    <div className=''>
      <HeroSection />
      <ProblemSolution />
      <HowItWorksSection/>
      <WhySellersLoveUs />
      <EarningsCalculator />
      <SuccessStories />
      <PricingSection />
    </div>
  )
}

export default page