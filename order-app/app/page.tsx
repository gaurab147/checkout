"use client"; // クライアントコンポーネント宣言、このコードはクライアント（ブラウザ）側で動く。  Next.js では何も書かなければサーバーコンポーネントになります。

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const MENU_API_URL = "https://de9ysow3dp.microcms.io/api/v1/menu"; // microCMS のエンドポイント URL

// データをセットする配列を用意
type MenuItem = {
  id: string;
  name: string;
  price: number;
  comment?: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
};
const DRINK_MENU: MenuItem[] = [
  {
    id: "cola",
    name: "コーラ",
    price: 200,
    image: {
      url: "/drinks/coke.jpg",
      width: 300,
      height: 200,
    },
  },
  {
    id: "oolong",
    name: "ウーロン茶",
    price: 200,
    image: {
      url: "/drinks/oolong.jpg",
      width: 300,
      height: 200,
    },
  },
  {
    id: "orange",
    name: "オレンジジュース",
    price: 250,
    image: {
      url: "/drinks/orange.jpg",
      width: 300,
      height: 200,
    },
  },
  {
    id: "beer",
    name: "生ビール",
    price: 500,
    image: {
      url: "/drinks/draftbeer.jpg",
      width: 300,
      height: 200,
    },
  },
  {
    id: "lemonsour",
    name: "レモンサワー",
    price: 450,
    image: {
      url: "/drinks/lemonsour.png",
      width: 300,
      height: 200,
    },
  },
];

export default function MenuPage() {
  // menu,cart 表示データを入れる配列、
  // setMenu,setCart は、menu,cart を更新する関数function
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0); // カートの合計
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter(); //画面移動で使用

  // useEffect(() => { fetch(...); }, []); 画面の準備が終わったタイミングでmicroCMSからデータを取得する
  useEffect(() => {
    // CMSからメニューデータ取得
    fetch(MENU_API_URL, {
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_MICROCMS_API_KEY || "",
      },
    })
      // => はアロー関数といいます。functionを短く書いたのもです。
      // 例　これを短く書いたものです
      // .then(function(res) {
      //   return res.json();
      // })
      // res.json();の戻り値が res に入ります。
      .then((res) => res.json()) // 文字列からオブジェクトへ変換
      .then((data) => setMenu(data.contents)); // res オブジェクト が data に入る return が呼ばれる
    // 下記のように書き換えるとdataの中をブラウザ console で確認できます。
    // .then((data) => {
    //   setMenu(data.contents);
    //   console.table(data.contents); // contents 配列をテーブル形式で表示
    // });

    // localStorage からカートを復元
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  // カートに追加する
  const addToCart = (item: MenuItem) => {
    const updated = [...cart, item];
    setCart(updated);
    // JSON.stringify で配列を文字列化し、「cart」というキーで保存
    localStorage.setItem("cart", JSON.stringify(updated));
  };
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };
  const removeItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };
  const goCheckout = () => {
    if (cart.length === 0) {
      setErrorMsg("まだ注文はありません。");
      return;
    }
    setErrorMsg("");
    clearCart();
    router.push("/thankyou");
  };

  return (
    <div className={styles.container}>
      {/* メニュー一覧 */}
      <ul className={styles.list}></ul>
      <main className={styles.menuList}>
        <h1 className={styles.title}>メニュー一覧</h1>
        <ul className={styles.list}>
          {menu.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.name}
                  width={item.image.width}
                  height={item.image.height}
                  className={styles.menuImage}
                />
              )}
              <p className={styles.name}>
                {item.name} — {item.price}円
              </p>
              <button
                className={styles.addButton}
                // onClick={() => addToCart(item)}
                onClick={() => router.push(`/confirm/${item.id}`)}
              >
                追加
              </button>
              {item.comment && <p className={styles.comment}>{item.comment}</p>}
              <hr className={styles.separator} />
            </li>
          ))}
        </ul>
        <h2 className={styles.title}>ドリンクメニュー</h2>

        <ul className={styles.list}>
          {DRINK_MENU.map((drink) => (
            <li key={drink.id} className={styles.menuItem}>
              {drink.image && (
                <Image
                  src={drink.image.url}
                  alt={drink.name}
                  width={drink.image.width}
                  height={drink.image.height}
                  className={styles.menuImage}
                />
              )}
              <p className={styles.name}>
                {drink.name} — {drink.price}円
              </p>
              <button
                className={styles.addButton}
                onClick={() => addToCart(drink)}
              >
                追加
              </button>
              <hr className={styles.separator} />
            </li>
          ))}
        </ul>

        <Link href="/cart" className={styles.checkoutLink}>
          注文確認へ進む
        </Link>
      </main>

      <aside className={styles.cart}>
        <h2 className={styles.cartTitle}>注文状況</h2>
        {cart.length === 0 ? (
          <p className={styles.empty}></p>
        ) : (
          cart.map((item, i) => (
            <div key={`${item.id}-${i}`} className={styles.cartItem}>
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.name}
                  width={60}
                  height={40}
                  className={styles.cartImage}
                />
              )}
              <div className={styles.cartText}>
                <p className={styles.cartName}>{item.name}</p>
                <p className={styles.cartPrice}>{item.price}円</p>
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => removeItem(i)}
              >
                削除
              </button>
            </div>
          ))
        )}
        {/* カートの合計 */}
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
        <div className={styles.cartTotal}>
          合計金額：{totalAmount.toLocaleString()}円(税込)
        </div>
        <button className={styles.clearButton} onClick={clearCart}>
          注文をリセット
        </button>
        {/* 会計へボタン */}
        <button className={styles.checkoutButton} onClick={goCheckout}>
          会計する
        </button>
      </aside>
    </div>
  );
}
