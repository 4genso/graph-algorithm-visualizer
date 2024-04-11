import { useEffect, useRef } from "react";

type OutputTracerProps = {
  outputs: string[];
};

function OutputTracer({ outputs }: OutputTracerProps) {
  const outputsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (outputsRef.current) {
      outputsRef.current.scrollTop = outputsRef.current.scrollHeight;
    }
  }, [outputs]);
  return (
    <div
      className="h-72 max-h-72 overflow-y-auto border-black border-2 p-2"
      ref={outputsRef}
    >
      <ul className="list-inside list-disc text-black font-semibold">
        {outputs.map((output, index) => (
          <li key={index} tabIndex={1}>
            {output}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OutputTracer;
