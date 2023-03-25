import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [ownerInput, setOwnerInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput, owner: ownerInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
      setOwnerInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
    <Head>
      <title>OpenAI Quickstart</title>
      <link rel="icon" href="/petsark.png" />
    </Head>

    <main className={styles.main}>
      <img src="/petsark.png" className={styles.icon} />
      <h3 className={styles.title}>Pets Ark</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="animal"
          placeholder="Enter an animal"
          value={animalInput}
          onChange={(e) => setAnimalInput(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          name="owner"
          placeholder="Enter owner name"
          value={ownerInput}
          onChange={(e) => setOwnerInput(e.target.value)}
          className={styles.input}
        />
        <input type="submit" value="Generate names" className={styles.button} />
      </form>
      <div className={styles.result}>{result}</div>
    </main>
    </div>
  );
}
