
interface HeroSectionProps {
  subtitle?: string;
  currentStep?: number; 
  totalSteps?: number; 
}

function HeroSection({ subtitle, currentStep, totalSteps }: HeroSectionProps) {
  const progressPercent = currentStep && totalSteps 
    ? (currentStep / totalSteps) * 100 
    : 0;

  return (
    <section className="hero-section hidden lg:flex flex-col lg:w-[27%] items-center justify-center bg-logo-gradient p-4 shrink-0">
      <div className="logo-container w-full flex flex-col items-center max-h-[60%]">
        
        
        <img 
          src="/psique-logo-white.svg" 
          alt="Logo Psique" 
          className="w-[78%] max-w-[280px] object-contain" 
        />

        
        {currentStep && totalSteps && (
          <div className="w-[78%] max-w-[280px] mt-12 flex flex-col items-start w-full">
            
            {subtitle && (
              <p className="text-white font-bold text-2xl mb-4 opacity-90">
                {subtitle}
              </p>
            )}

            <div className="w-full h-[6px] bg-white/100 rounded-full mb-3 overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-700 ease-in-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <p className="text-white text-2xl font-bold tracking-wide">
              Etapa {currentStep} de {totalSteps}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;