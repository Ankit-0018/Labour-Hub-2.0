export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg  min-h-[520px]">
          {children}
        </div>
         <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
