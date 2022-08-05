import { app } from "../config/app";
import { getFirestore } from "firebase/firestore";

// firebase의 firestore 인스턴스를 변수에 저장
const database = getFirestore(app);
//const database = getDatabase(app);
// 필요한 곳에서 사용할 수 있도록 내보내기
export { database };