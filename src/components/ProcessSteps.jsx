const steps = [
  { id: 'intro', label: 'Qualify' },
  { id: 'verification', label: 'KYC' },
  { id: 'underwriting', label: 'Underwrite' },
  { id: 'sanction', label: 'Sanction' },
  { id: 'complete', label: 'Done' },
];

export default function ProcessSteps({ current }) {
  const idx = steps.findIndex(s => s.id === current);
  return (
    <div className="w-full px-6 md:px-12 py-4">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex-1 flex items-center gap-3">
            <div className={`h-2 rounded-full flex-1 ${i <= idx ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
            <span className={`text-xs whitespace-nowrap ${i <= idx ? 'text-purple-700 font-semibold' : 'text-gray-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
