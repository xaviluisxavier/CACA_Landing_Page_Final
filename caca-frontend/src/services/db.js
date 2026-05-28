const DB_NAME = 'CACA_DB';
const DB_VERSION = 1;

export const STORE_EVENTOS = 'eventos';
export const STORE_NEWSLETTER = 'newsletter';

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_EVENTOS)) {
                const eventosStore = db.createObjectStore(STORE_EVENTOS, { keyPath: 'id', autoIncrement: true });
                eventosStore.createIndex('titulo', 'titulo', { unique: false });
                eventosStore.createIndex('data', 'data', { unique: false });
                eventosStore.createIndex('local', 'local', { unique: false });
            }
            if (!db.objectStoreNames.contains(STORE_NEWSLETTER)) {
                const newsletterStore = db.createObjectStore(STORE_NEWSLETTER, { keyPath: 'id', autoIncrement: true });
                newsletterStore.createIndex('email', 'email', { unique: true });
            }
        };
    });
}

export async function getAllRecords(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

// Funções específicas para os Eventos
export async function obterTodosEventos() {
    const eventos = await getAllRecords(STORE_EVENTOS);
    return eventos.sort((a, b) => new Date(a.data) - new Date(b.data));
}

// Função para adicionar um registo
export async function addRecord(storeName, record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.add(record);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

// Função para remover um registo
export async function deleteRecord(storeName, id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

export async function salvarEvento(evento) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_EVENTOS, 'readwrite');
        const store = tx.objectStore(STORE_EVENTOS);
        
        // Se o evento já tiver ID, ele atualiza. Se não, cria um novo.
        const request = store.put(evento); 
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function removerEvento(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_EVENTOS, 'readwrite');
        const store = tx.objectStore(STORE_EVENTOS);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export const salvarSubscritor = async (email) => {
    // 1. Vai buscar a lista atual à base de dados
    const subscritores = await obterSubscritores();
    
    // 2. Verifica se o email já existe para não haver repetidos
    if (subscritores.find(sub => sub.email === email)) {
        throw new Error('Este email já está subscrito!');
    }

    // 3. Cria o objeto
    const novoSubscritor = {
        email: email,
        data: new Date().toLocaleDateString('pt-PT')
    };

    // 4. Usa a função para guardar no IndexedDB
    await addRecord(STORE_NEWSLETTER, novoSubscritor);
    return novoSubscritor;
};

export const obterSubscritores = async () => {
    // Usa a função genérica para ler a tabela da newsletter
    return await getAllRecords(STORE_NEWSLETTER);
};

export const removerSubscritor = async (id) => {
    // Usa a função genérica para apagar pelo ID
    return await deleteRecord(STORE_NEWSLETTER, id);
};
