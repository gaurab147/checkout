"use client";

import Link from "next/link";
import styles from "./thankyou.module.css";

export default function ThankYouPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>ご注文ありがとうございました</h1>

        <div className={styles.box}>
          <p className={styles.line}>またのご来店をお待ちしております。</p>
          <p className={styles.line}>お気をつけてお帰りください。</p>
        </div>

        <Link href="/" className={styles.link}>
          メニューにもどる
        </Link>
      </div>
    </div>
  );
}
