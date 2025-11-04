import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[60vh] grid md:grid-cols-2 items-center overflow-hidden">
      <div className="p-8 md:p-16 space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
          LoanLens AI
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
          Conversational Loan Sales Agent
        </h1>
        <p className="text-gray-600 text-lg max-w-xl">
          A persuasive master agent that qualifies, verifies KYC, underwrites, and generates a sanction letter — all in one chat.
        </p>
        <ul className="text-gray-700 grid grid-cols-2 gap-3">
          <li>• Master + Worker agents</li>
          <li>• KYC verification</li>
          <li>• Rule-based underwriting</li>
          <li>• Sanction letter output</li>
        </ul>
      </div>
      <div className="relative h-[50vh] md:h-[60vh]">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
      </div>
    </section>
  );
}
