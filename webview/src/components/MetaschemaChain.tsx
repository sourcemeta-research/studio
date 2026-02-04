import { useEffect, useRef, useState } from 'react';
import type { MetaschemaError, Position } from '../../../protocol/types';
import { goToPosition } from '../message';

const BOX_WIDTH = 260;
const GAP = 12;

interface Props {
  errors: MetaschemaError[];
}

export function MetaschemaChain({ errors }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<MetaschemaError[][]>([]);
  const [rowWidth, setRowWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const compute = () => {
      const width = containerRef.current!.clientWidth;
      if (width < BOX_WIDTH) {
        setRows(errors.map(e => [e]));
        setRowWidth(BOX_WIDTH);
        return;
      }

      const perRow = Math.max(
        1,
        Math.floor((width + GAP) / (BOX_WIDTH + GAP))
      );

      const computedRowWidth = perRow * (BOX_WIDTH + GAP) - GAP;

      const newRows: MetaschemaError[][] = [];
      for (let i = 0; i < errors.length; i += perRow) {
        newRows.push(errors.slice(i, i + perRow));
      }

      setRows(newRows);
      setRowWidth(computedRowWidth);
    };
    compute();

    const observer = new ResizeObserver(compute);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [errors]);

  return (
    <div ref={containerRef} className="flex justify-center overflow-x-auto">
      <div className="flex flex-col gap-4">
      {rows.map((row, rowIndex) => {
        const isLTR = rowIndex % 2 === 0;
        const items = isLTR ? row : [...row].reverse();

        return (
          <div key={rowIndex}>
            {/* ROW */}
            <div
              className="flex items-center gap-3"
              style={{
                width: rowWidth,
                justifyContent: isLTR ? 'flex-start' : 'flex-end'
              }}
            >
              {items.map((error, index) => (
                <div key={index} className="flex items-center gap-3">
                  <ErrorBox error={error} />

                  {/* Horizontal arrows */}
                  {index < items.length - 1 &&
                    (isLTR ? <ArrowRight /> : <ArrowLeft />)}
                </div>
              ))}
            </div>

            {/* TURN ARROW */}
            {rowIndex < rows.length - 1 && (
              <div className="relative" style={{ width: rowWidth }}>
                <div
                  className="absolute"
                  style={{
                    right: isLTR ? 0 :"auto",
                    left: isLTR ? "auto" : 0,
                    top: 0
                  }}
                >
                  <ArrowDown />
                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}

function ErrorBox({ error }: { error: MetaschemaError }) {
  return (
    <div
      className="bg-(--vscode-selection) border-l-[3px] rounded p-3 cursor-pointer transition-colors hover:bg-(--vscode-hover)"
      style={{
        width: BOX_WIDTH,
        borderLeftColor: "var(--error)",
        boxShadow: "0 0 0 1px rgba(255, 0, 0, 0.15)"
      }}
      onClick={() =>
        error.instancePosition &&
        goToPosition(error.instancePosition as Position)
      }
    >
      <div className="text-[12px] font-semibold mb-1 text-(--vscode-fg)">
        {error.error}
      </div>

      {error.instanceLocation && (
        <div className="text-[11px] text-(--vscode-muted) break-all">
          {error.instanceLocation || '(root)'}
        </div>
      )}
    </div>
  );
}

function ArrowRight() {
  return <span className="text-(--vscode-muted)">→</span>;
}

function ArrowLeft() {
  return <span className="text-(--vscode-muted)">←</span>;
}

function ArrowDown() {
  return (
    <div className="text-(--vscode-muted) text-lg leading-none">
      ↓
    </div>
  );
}
