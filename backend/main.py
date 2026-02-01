from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

def load_llm():
    # Load Google Gemini
    llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    return llm

def get_qa_chain():
    if not os.getenv("PINECONE_API_KEY"):
         raise Exception("PINECONE_API_KEY not found in env.")

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    vectorstore = PineconeVectorStore(
        index_name=PINECONE_INDEX_NAME,
        embedding=embeddings
    )
    
    retriever = vectorstore.as_retriever(search_kwargs={'k': 3})
    
    llm = load_llm()
    
    prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}

Question: {question}

Instruction: {instruction}

Answer:"""
    
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question", "instruction"]
    )
    
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )
    
    return chain

class QueryRequest(BaseModel):
    question: str
    mode: str = "concise" # concise, 5-mark, 10-mark

@app.post("/query")
async def query_notes(request: QueryRequest):
    try:
        chain = get_qa_chain()
        
        instruction = "Answer concisely."
        if request.mode == "5-mark":
            instruction = "Provide a structured answer suitable for a 5-mark exam question (approx 150-200 words). Include point-wise explanation if applicable."
        elif request.mode == "10-mark":
            instruction = "Provide a detailed, comprehensive answer suitable for a 10-mark exam question (approx 400-500 words). Include Introduction, Key Concepts, Detailed Analysis, and Conclusion."
            
        response = chain({"query": request.question, "instruction": instruction})
        
        return {
            "answer": response["result"],
            "source_documents": [doc.page_content for doc in response["source_documents"]]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Smart Research Assistant Backend is Running"}
