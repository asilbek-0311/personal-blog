'use client';

export default function PrintButton() {
  return (
    <button type="button" className="btn btn-outline no-print" onClick={() => window.print()}>
      Save as PDF
    </button>
  );
}
