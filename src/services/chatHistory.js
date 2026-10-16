import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "chatHistory";
const MAX_HISTORY = 100;

/**
 * Save a question + council result to Firestore.
 * Returns the saved entry with its id and timestamp.
 */
export async function saveChat(uid, question, result) {
  const entry = {
    uid,
    question,
    result,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COLLECTION), entry);

  return {
    id: ref.id,
    uid,
    question,
    result,
    createdAt: new Date(),
  };
}

/**
 * Load the current user's chat history, newest first.
 * orderBy runs in Firestore, so with more than MAX_HISTORY chats the newest
 * ones are returned (a client-side sort would only reorder an arbitrary 100).
 * Needs the (uid ASC, createdAt DESC) composite index in firestore.indexes.json.
 */
export async function loadChats(uid) {
  const q = query(
    collection(db, COLLECTION),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(MAX_HISTORY)
  );

  const snapshot = await getDocs(q);

  const chats = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      question: data.question,
      result: data.result,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    };
  });

  chats.sort((a, b) => b.createdAt - a.createdAt);
  return chats;
}

/**
 * Fetch a single chat entry by id.
 */
export async function getChat(id) {
  const snapshot = await getDoc(doc(db, COLLECTION, id));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    question: data.question,
    result: data.result,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
  };
}

/**
 * Delete a chat entry.
 */
export async function removeChat(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
