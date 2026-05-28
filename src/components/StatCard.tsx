interface StatCardProps {
  value: string | number;
  label: string;
  subtext?: string;
  icon: React.ReactNode;
}

export default function StatCard({ value, label, subtext, icon }: StatCardProps) {
  return (
    <div className="bg-[#EAEAEA] shadow-[0px_2px_4px_rgba(0,0,0,0.12),0px_4px_4px_rgba(0,0,0,0.2),0px_0px_30px_12px_rgba(0,0,0,0.12)] rounded-[15px] p-6 w-[282px] h-[189px] flex flex-col justify-between">
      <div className="text-[#676767]">{icon}</div>
      <div>
        <h2 className="text-[48px] font-semibold text-[#737373] leading-none">{value}</h2>
        <p className="text-[16px] font-semibold text-[#737373] mt-2">{label}</p>
        {subtext && <p className="text-[12px] font-semibold text-[#737373] mt-1">{subtext}</p>}
      </div>
    </div>
  );
}