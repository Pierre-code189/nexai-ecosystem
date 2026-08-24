import { IStorageAdapter } from '@/types/solid';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { FirestoreStorageAdapter } from './FirestoreStorageAdapter';

export class StorageFactory {
  private static instance: IStorageAdapter;

  public static getStorage(): IStorageAdapter {
    if (!StorageFactory.instance) {
      const useFirestore = process.env.NEXT_PUBLIC_ENABLE_MOCK_STORAGE !== 'true' &&
                           Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
      StorageFactory.instance = useFirestore ? new FirestoreStorageAdapter() : new LocalStorageAdapter();
    }
    return StorageFactory.instance;
  }
}
