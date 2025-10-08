import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type WhereFilterOp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./config"

export class FirestoreService {
  // Get a single document
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }

    return null
  }

  // Get all documents from a collection
  async getCollection<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
  }

  // Query documents with filters
  async queryDocuments<T>(
    collectionName: string,
    filters: { field: string; operator: WhereFilterOp; value: any }[],
    orderByField?: string,
    orderDirection: "asc" | "desc" = "desc",
    limitCount?: number,
  ): Promise<T[]> {
    let q = query(collection(db, collectionName))

    // Apply filters
    filters.forEach((filter) => {
      q = query(q, where(filter.field, filter.operator, filter.value))
    })

    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection))
    }

    // Apply limit
    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
  }

  // Add a new document
  async addDocument<T>(collectionName: string, data: Omit<T, "id">): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  }

  // Update a document
  async updateDocument(collectionName: string, docId: string, data: Partial<any>): Promise<void> {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  }

  // Delete a document
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  }
}

export const firestoreService = new FirestoreService()
