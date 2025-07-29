"use client";

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-bg-dark flex h-dvh w-full flex-col items-center justify-center text-white">
          <h1 className="text-2xl font-bold">เกิดข้อผิดพลาดบางอย่าง</h1>
          <p>เรากำลังแก้ไข โปรดลองอีกครั้งในภายหลัง</p>
          <pre className="mt-4 text-xs text-red-400">{this.state.error.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
