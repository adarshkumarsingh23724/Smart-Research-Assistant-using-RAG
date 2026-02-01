import os
import time
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATA_DIR = "data"
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

def ingest_to_pinecone():
    if not PINECONE_API_KEY or not PINECONE_INDEX_NAME:
        print("Error: PINECONE_API_KEY or PINECONE_INDEX_NAME not found in .env")
        return

    # Initialize Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)

    # Create index if it doesn't exist (Serverless)
    existing_indexes = [index.name for index in pc.list_indexes()]
    if PINECONE_INDEX_NAME not in existing_indexes:
        print(f"Creating index: {PINECONE_INDEX_NAME}")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=768, # Dimension for Google Gemini embeddings
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        # Wait for index to be ready
        while not pc.describe_index(PINECONE_INDEX_NAME).status['ready']:
            time.sleep(1)

    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Created {DATA_DIR} directory. Please put your PDF notes there.")
        return

    print("Loading PDF files...")
    loader = DirectoryLoader(DATA_DIR, glob="*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()

    if not documents:
        print("No PDF files found in 'data/' directory.")
        return

    print(f"Loaded {len(documents)} documents. Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    texts = text_splitter.split_documents(documents)

    print(f"Created {len(texts)} text chunks. Generating embeddings and uploading to Pinecone...")
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    try:
        PineconeVectorStore.from_documents(
            documents=texts,
            embedding=embeddings,
            index_name=PINECONE_INDEX_NAME
        )
        print(f"Successfully uploaded {len(texts)} chunks to Pinecone index '{PINECONE_INDEX_NAME}'.")
    except Exception as e:
        print(f"Error uploading to Pinecone: {e}")

if __name__ == "__main__":
    ingest_to_pinecone()
