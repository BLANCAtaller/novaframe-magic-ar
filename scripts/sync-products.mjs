import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { SAMPLE_PRODUCTS } from "../src/types/index.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLOwoIiZE7o5ZwQFsfH_zJ3XXuGZDkAeU",
  authDomain: "novaframe-art-catalog-73805.firebaseapp.com",
  projectId: "novaframe-art-catalog-73805",
  storageBucket: "novaframe-art-catalog-73805.firebasestorage.app",
  messagingSenderId: "393721215711",
  appId: "1:393721215711:web:03367a70f3484a837d476a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sync() {
  console.log("Iniciando sincronización de productos...");
  
  for (const product of SAMPLE_PRODUCTS) {
    try {
      await setDoc(doc(db, "products", product.id), product);
      console.log(`✅ Producto sincronizado: ${product.name} (${product.id})`);
    } catch (error) {
      console.error(`❌ Error sincronizando ${product.id}:`, error);
    }
  }
  
  console.log("Sincronización finalizada.");
  process.exit(0);
}

sync();
