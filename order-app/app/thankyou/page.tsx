"use client";

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>ご注文ありがとうございました</h2>

      <p>ご注文が完了しました。</p>

      <Link href="/">
        <button style={{ marginTop: "20px", padding: "8px 16px" }}>
          メニューに戻る
        </button>
      </Link>
    </div>
  );
}
