type SpinnerProps = {
  size?: number
  color?: string
  text?: string
}

export default function Spinner({
  size = 24,
  color = "#3782e3",
  text
}: SpinnerProps) {

  const dotSize = size / 6
  const radius = size / 2 - dotSize

  const dots = Array.from({ length: 8 })

  return (
    <div className="flex flex-col items-center justify-center gap-2">

      <div
        className="relative animate-spin"
        style={{ width: size, height: size }}
      >
        {dots.map((_, i) => {
          const angle = (360 / dots.length) * i
          const rad = (angle * Math.PI) / 180

          const x = radius * Math.cos(rad) + size / 2 - dotSize / 2
          const y = radius * Math.sin(rad) + size / 2 - dotSize / 2

          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                backgroundColor: color,
                left: x,
                top: y,
                opacity: 0.2 + i * 0.1
              }}
            />
          )
        })}
      </div>

      {text && (
        <p className="text-sm text-gray-600">
          {text}
        </p>
      )}
    </div>
  )
}