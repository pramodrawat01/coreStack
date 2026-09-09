const LOGOS = ['Northgate', 'Ashford Retail', 'Meridian Foods', 'Blue Harbor', 'Vantage Supply', 'Cedarline', 'Nolan & Co']

export default function LogoCloud({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-4 ${className}`}>
      {LOGOS.map((name) => (
        <span key={name} className="text-sm sm:text-base font-medium text-faint">
          {name}
        </span>
      ))}
    </div>
  )
}
