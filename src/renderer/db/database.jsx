import { getDatabase } from "firebase/database";
// firebase의 firestore 인스턴스를 변수에 저장
//const database = getFirestore();
const database = getDatabase();
// 필요한 곳에서 사용할 수 있도록 내보내기

export { database };