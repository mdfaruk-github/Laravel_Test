"use client";

import { useState } from "react";

const API_URL = "http://localhost:8000/api/calculate";

type Operator = "+" | "-" | "*" | "/";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [num1, setNum1] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForNum2, setWaitingForNum2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function inputDigit(digit: string) {
    setError(null);
    if (waitingForNum2) {
      setDisplay(digit);
      setWaitingForNum2(false);
    } else {
      setDisplay((prev) =>
        prev === "0" ? digit : prev.length >= 15 ? prev : prev + digit
      );
    }
  }

  function inputDecimal() {
    setError(null);
    if (waitingForNum2) {
      setDisplay("0.");
      setWaitingForNum2(false);
    } else if (!display.includes(".")) {
      setDisplay((prev) => prev + ".");
    }
  }

  function inputOperator(op: Operator) {
    setError(null);
    setNum1(display);
    setOperator(op);
    setWaitingForNum2(true);
  }

  function toggleSign() {
    setDisplay((prev) =>
      prev.startsWith("-") ? prev.slice(1) : prev === "0" ? "0" : "-" + prev
    );
  }

  function clearAll() {
    setDisplay("0");
    setNum1(null);
    setOperator(null);
    setWaitingForNum2(false);
    setError(null);
  }

  function clearEntry() {
    setDisplay("0");
    setError(null);
  }

  function backspace() {
    setError(null);
    setDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  }

  async function calculate() {
    if (num1 === null || operator === null || waitingForNum2) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ num1, num2: display, operator }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Error");
        return;
      }

      const result: number = json.data.result;
      const formatted = Number.isInteger(result)
        ? String(result)
        : parseFloat(result.toFixed(10)).toString();

      setDisplay(formatted);
      setNum1(formatted);
      setOperator(null);
      setWaitingForNum2(false);
    } catch {
      setError("Server unreachable");
    } finally {
      setLoading(false);
    }
  }

  const operatorSymbol: Record<Operator, string> = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  const displayText = loading ? "..." : error ?? display;

  const baseBtn = "flex items-center justify-center h-14 text-base font-medium transition-colors cursor-pointer select-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-200">
      <div className="w-72 rounded-2xl overflow-hidden shadow-2xl bg-zinc-100">

        {/* Title */}
        <div className="px-4 pt-4 pb-1 text-sm font-semibold text-zinc-800">
          Standard Calculator
        </div>

        {/* Display */}
        <div className="px-4 pb-3 flex flex-col items-end min-h-20 justify-end">
          {operator && num1 !== null && (
            <div className="text-xs text-zinc-500 mb-1">
              {num1} {operatorSymbol[operator]}
            </div>
          )}
          <div
            className={[
              "text-right font-light leading-none break-all",
              error ? "text-red-500 text-base" : "text-zinc-900",
              !error && displayText.length > 10 ? "text-2xl" : "text-4xl",
            ].join(" ")}
          >
            {displayText}
          </div>
        </div>

        {/* Button grid */}
        <div className="grid grid-cols-4 gap-px bg-zinc-300 border-t border-zinc-300">

          {/* Row 1 */}
          <button className={`${baseBtn} bg-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm`} onClick={clearEntry}>CE</button>
          <button className={`${baseBtn} bg-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm`} onClick={clearAll}>C</button>
          <button className={`${baseBtn} bg-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm`} onClick={backspace}>⌫</button>
          <button className={`${baseBtn} bg-zinc-200 hover:bg-zinc-50 text-zinc-800`} onClick={() => inputOperator("/")}>÷</button>

          {/* Row 2 */}
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("7")}>7</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("8")}>8</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("9")}>9</button>
          <button className={`${baseBtn} bg-zinc-200 hover:bg-zinc-50 text-zinc-800`} onClick={() => inputOperator("*")}>×</button>

          {/* Row 3 */}
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("4")}>4</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("5")}>5</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("6")}>6</button>
          <button className={`${baseBtn} bg-zinc-200 hover:bg-zinc-50 text-zinc-800`} onClick={() => inputOperator("-")}>−</button>

          {/* Row 4 */}
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("1")}>1</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("2")}>2</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("3")}>3</button>
          <button className={`${baseBtn} bg-zinc-200 hover:bg-zinc-50 text-zinc-800`} onClick={() => inputOperator("+")}>+</button>

          {/* Row 5 */}
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={toggleSign}>+/−</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={() => inputDigit("0")}>0</button>
          <button className={`${baseBtn} bg-white hover:bg-zinc-50 text-zinc-900`} onClick={inputDecimal}>.</button>
          <button className={`${baseBtn} bg-blue-600 hover:bg-blue-500 text-white text-xl`} onClick={calculate}>=</button>

        </div>
      </div>
    </div>
  );
}
