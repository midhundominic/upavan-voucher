export function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 240" fill="none" aria-hidden="true">
      <path d="M33 237C51 179 62 122 125 21" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M48 190C7 182 6 150 7 136C36 144 54 159 48 190ZM60 161C92 155 108 128 106 111C77 118 62 136 60 161ZM73 133C40 120 41 91 45 76C71 88 82 106 73 133ZM91 101C121 95 136 72 138 53C109 61 95 77 91 101ZM110 65C88 48 98 21 105 8C122 27 124 46 110 65ZM123 40C147 38 164 20 169 5C145 7 130 20 123 40ZM38 220C68 214 79 193 81 176C53 184 41 199 38 220Z"
        fill="currentColor"
        fillOpacity=".16"
        stroke="currentColor"
        strokeWidth=".75"
      />
      <path
        d="M48 190L17 150M60 161L98 124M73 133L49 90M91 101L129 67M110 65L107 25M123 40L157 15M38 220L71 190"
        stroke="currentColor"
        strokeWidth=".75"
      />
    </svg>
  );
}
