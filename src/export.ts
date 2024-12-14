import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { db } from "./firebase";

interface FirestoreData {
  id: string;
  [key: string]: any;
}

export const exportFirestoreToExcel = async () => {
  try {
    // Buscar dados do Firestore
    const querySnapshot = await getDocs(collection(db, "clients"));
    const data: FirestoreData[] = [];

    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // Converter dados para planilha Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

    // Criar arquivo Excel e iniciar download
    XLSX.writeFile(workbook, "dados_firestore.xlsx");
    console.log("Exportação concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
  }
};


