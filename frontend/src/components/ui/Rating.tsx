export function Rating({ value }: { value: number }) {
  return <span className="font-black text-ember">★ {value.toFixed(2)}</span>;
}
